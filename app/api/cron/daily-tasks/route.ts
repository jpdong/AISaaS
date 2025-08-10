import { NextRequest, NextResponse } from "next/server"

import { db } from "@/drizzle/db"
import { launchStatus, project, upvote, user } from "@/drizzle/db/schema"
import { endOfDay, startOfDay, subDays, subHours } from "date-fns"
import { and, count, desc, eq, gte, inArray, lt, lte } from "drizzle-orm"

import { sendLaunchReminderEmail, sendWinnerBadgeEmail } from "@/lib/transactional-emails"

const API_KEY = process.env.CRON_API_KEY

export async function GET(request: NextRequest) {
    try {
        // Vérification de la clé API (support Vercel Cron et external calls)
        const authHeader = request.headers.get("authorization")
        const vercelCronSecret = request.headers.get("x-vercel-cron-secret")
        const providedKey = authHeader?.replace("Bearer ", "")

        // Allow Vercel Cron (has x-vercel-cron-secret header) or external calls with API key
        const isVercelCron = vercelCronSecret !== null
        const isValidApiKey = API_KEY && providedKey === API_KEY

        if (!isVercelCron && !isValidApiKey) {
            //return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const now = new Date()
        const today = startOfDay(now)
        const yesterday = subDays(today, 1)
        const endOfToday = endOfDay(now)
        const endOfYesterday = endOfDay(yesterday)
        const paymentDeadline = subHours(now, 24)

        console.log(`[${now.toISOString()}] Starting daily cron tasks`)

        // ========== TASK 1: UPDATE LAUNCH STATUSES ==========
        console.log("=== Task 1: Updating launch statuses ===")

        let rankGroups: Array<Array<{ projectId: string; projectName: string; upvoteCount: number }>> = []

        // 1.1 Update SCHEDULED -> ONGOING
        const scheduledToOngoing = await db
            .update(project)
            .set({
                launchStatus: launchStatus.ONGOING,
                updatedAt: now,
            })
            .where(
                and(
                    eq(project.launchStatus, launchStatus.SCHEDULED),
                    gte(project.scheduledLaunchDate, today),
                    lt(project.scheduledLaunchDate, endOfDay(today)),
                ),
            )
            .returning({ id: project.id, name: project.name })

        // 1.2 Update ONGOING -> LAUNCHED
        const ongoingToLaunched = await db
            .update(project)
            .set({
                launchStatus: launchStatus.LAUNCHED,
                updatedAt: now,
            })
            .where(
                and(
                    eq(project.launchStatus, launchStatus.ONGOING),
                    gte(project.scheduledLaunchDate, yesterday),
                    lt(project.scheduledLaunchDate, today),
                ),
            )
            .returning({ id: project.id, name: project.name })

        // 1.3 Calculate rankings for newly launched projects
        const justLaunchedProjectIds = ongoingToLaunched.map((p) => p.id)
        console.log(`Projects moved to LAUNCHED: ${justLaunchedProjectIds.length}`, justLaunchedProjectIds)

        if (justLaunchedProjectIds.length > 0) {
            const projectUpvotes = await db
                .select({
                    projectId: upvote.projectId,
                    count: count(upvote.id),
                })
                .from(upvote)
                .where(inArray(upvote.projectId, justLaunchedProjectIds))
                .groupBy(upvote.projectId)
                .orderBy(desc(count(upvote.id)))
                .execute()

            const projectsWithUpvotes = ongoingToLaunched
                .map((proj) => {
                    const upvoteData = projectUpvotes.find((uv) => uv.projectId === proj.id)
                    return {
                        projectId: proj.id,
                        projectName: proj.name,
                        upvoteCount: upvoteData ? Number(upvoteData.count) : 0,
                    }
                })
                .sort((a, b) => b.upvoteCount - a.upvoteCount)

            // Group projects by upvote count for ranking
            rankGroups = []
            let currentCount = -1
            let currentGroup: Array<{ projectId: string; projectName: string; upvoteCount: number }> = []

            for (const projectData of projectsWithUpvotes) {
                if (projectData.upvoteCount === 0) continue

                if (projectData.upvoteCount !== currentCount) {
                    if (currentGroup.length > 0) {
                        rankGroups.push(currentGroup)
                    }
                    currentCount = projectData.upvoteCount
                    currentGroup = [projectData]
                } else {
                    currentGroup.push(projectData)
                }
            }

            if (currentGroup.length > 0) {
                rankGroups.push(currentGroup)
            }

            // Assign rankings
            let currentRank = 1
            let projectsRanked = 0

            for (const group of rankGroups) {
                if (currentRank > 3) break

                for (const projectData of group) {
                    await db
                        .update(project)
                        .set({
                            dailyRanking: currentRank,
                            updatedAt: now,
                        })
                        .where(eq(project.id, projectData.projectId))

                    console.log(
                        `Ranked #${currentRank}: ${projectData.projectName} with ${projectData.upvoteCount} upvotes`
                    )
                    projectsRanked++
                }
                currentRank++
            }
            console.log(`Total projects ranked: ${projectsRanked}`)
        }

        // 1.4 Clean up abandoned PAYMENT_PENDING
        const abandonedPayments = await db
            .delete(project)
            .where(
                and(
                    eq(project.launchStatus, launchStatus.PAYMENT_PENDING),
                    lte(project.updatedAt, paymentDeadline),
                ),
            )
            .returning({ id: project.id, name: project.name })

        // ========== TASK 2: SEND ONGOING REMINDERS ==========
        console.log("=== Task 2: Sending ongoing launch reminders ===")

        const ongoingProjects = await db
            .select({
                projectId: project.id,
                projectName: project.name,
                projectSlug: project.slug,
                projectCreatorId: project.createdBy,
            })
            .from(project)
            .where(
                and(
                    eq(project.launchStatus, launchStatus.ONGOING),
                    gte(project.scheduledLaunchDate, today),
                    lt(project.scheduledLaunchDate, endOfToday),
                ),
            )
            .execute()

        let reminderEmailsSent = 0
        let reminderEmailsFailed = 0

        for (const proj of ongoingProjects) {
            if (!proj.projectCreatorId) {
                console.warn(`Skipping reminder for project ${proj.projectName} - missing creator ID`)
                continue
            }

            const projectCreator = await db
                .select({ email: user.email, name: user.name })
                .from(user)
                .where(eq(user.id, proj.projectCreatorId))
                .limit(1)
                .then((res) => res[0])

            if (!projectCreator?.email) {
                console.warn(`User not found for creator ID ${proj.projectCreatorId}`)
                reminderEmailsFailed++
                continue
            }

            try {
                await sendLaunchReminderEmail({
                    user: { email: projectCreator.email, name: projectCreator.name },
                    projectName: proj.projectName,
                    projectSlug: proj.projectSlug,
                })
                reminderEmailsSent++
                console.log(`Sent reminder email to ${projectCreator.email} for ${proj.projectName}`)
            } catch (error) {
                reminderEmailsFailed++
                console.error(`Failed to send reminder email for ${proj.projectName}:`, error)
            }
        }

        // ========== TASK 3: SEND WINNER NOTIFICATIONS ==========
        console.log("=== Task 3: Sending winner notifications ===")

        const winners = await db
            .select({
                projectId: project.id,
                projectName: project.name,
                projectSlug: project.slug,
                projectRanking: project.dailyRanking,
                projectCreatorId: project.createdBy,
                projectLaunchType: project.launchType,
            })
            .from(project)
            .where(
                and(
                    eq(project.launchStatus, launchStatus.LAUNCHED),
                    inArray(project.dailyRanking, [1, 2, 3]),
                    gte(project.scheduledLaunchDate, yesterday),
                    lt(project.scheduledLaunchDate, today),
                ),
            )
            .execute()

        let winnerEmailsSent = 0
        let winnerEmailsFailed = 0

        for (const winner of winners) {
            if (!winner.projectCreatorId || !winner.projectRanking) {
                console.warn(`Skipping winner notification for ${winner.projectName} - missing data`)
                continue
            }

            const projectCreator = await db
                .select({ email: user.email, name: user.name })
                .from(user)
                .where(eq(user.id, winner.projectCreatorId))
                .limit(1)
                .then((res) => res[0])

            if (!projectCreator?.email) {
                console.warn(`User not found for winner creator ID ${winner.projectCreatorId}`)
                winnerEmailsFailed++
                continue
            }

            try {
                await sendWinnerBadgeEmail({
                    user: { email: projectCreator.email, name: projectCreator.name },
                    projectName: winner.projectName,
                    projectSlug: winner.projectSlug,
                    ranking: winner.projectRanking,
                    launchType: winner.projectLaunchType,
                })
                winnerEmailsSent++
                console.log(`Sent winner email to ${projectCreator.email} for ${winner.projectName} (Rank #${winner.projectRanking})`)
            } catch (error) {
                winnerEmailsFailed++
                console.error(`Failed to send winner email for ${winner.projectName}:`, error)
            }
        }

        // ========== SUMMARY ==========
        const totalRanked = rankGroups.reduce((sum, group) => sum + group.length, 0)

        console.log(`[${now.toISOString()}] Daily cron tasks completed`)
        console.log(`- ${scheduledToOngoing.length} projects: SCHEDULED → ONGOING`)
        console.log(`- ${ongoingToLaunched.length} projects: ONGOING → LAUNCHED`)
        console.log(`- ${totalRanked} projects ranked in top 3`)
        console.log(`- ${abandonedPayments.length} abandoned payments deleted`)
        console.log(`- ${reminderEmailsSent} reminder emails sent (${reminderEmailsFailed} failed)`)
        console.log(`- ${winnerEmailsSent} winner emails sent (${winnerEmailsFailed} failed)`)

        return NextResponse.json({
            message: "Daily cron tasks completed successfully",
            details: {
                launchUpdates: {
                    scheduledToOngoing: scheduledToOngoing.length,
                    ongoingToLaunched: ongoingToLaunched.length,
                    projectsRanked: totalRanked,
                    abandonedPaymentsDeleted: abandonedPayments.length,
                },
                emailNotifications: {
                    reminderEmails: {
                        projectsFound: ongoingProjects.length,
                        sent: reminderEmailsSent,
                        failed: reminderEmailsFailed,
                    },
                    winnerEmails: {
                        winnersFound: winners.length,
                        sent: winnerEmailsSent,
                        failed: winnerEmailsFailed,
                    },
                },
            },
        })
    } catch (error) {
        console.error("Error in daily cron tasks:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}