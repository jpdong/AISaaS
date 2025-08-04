"use server"

import { headers } from "next/headers"

import { db } from "@/drizzle/db"
import { category, project, user } from "@/drizzle/db/schema"
import { addDays, format } from "date-fns"
import { and, desc, eq, gte, sql } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { DATE_FORMAT, LAUNCH_SETTINGS } from "@/lib/constants"

import { getLaunchAvailabilityRange } from "./launch"

// Vérification des droits admin
async function checkAdminAccess() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user?.role || session.user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required")
  }
}

// Get all users and launch stats
export async function getAdminStatsAndUsers() {
  await checkAdminAccess()

  // Get all users, sorted by registration date descending
  const usersData = await db.select().from(user).orderBy(desc(user.createdAt))

  // Get project counts for each user
  const projectCounts = await db
    .select({
      userId: project.createdBy,
      count: sql<number>`count(*)::int`,
    })
    .from(project)
    .where(sql`${project.createdBy} IS NOT NULL`)
    .groupBy(project.createdBy)

  // Create a map for quick lookup
  const projectCountMap = new Map(projectCounts.map((pc) => [pc.userId, pc.count]))

  // Combine user data with project counts
  const users = usersData.map((u) => ({
    ...u,
    hasLaunched: (projectCountMap.get(u.id) || 0) > 0,
    projectCount: projectCountMap.get(u.id) || 0,
  }))

  // Get today's date at midnight UTC
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  // Get new users today
  const newUsersToday = await db
    .select({ count: sql`count(*)` })
    .from(user)
    .where(gte(user.createdAt, today))

  // Get launch stats
  const totalLaunches = await db.select({ count: sql`count(*)` }).from(project)
  const premiumLaunches = await db
    .select({ count: sql`count(*)` })
    .from(project)
    .where(eq(project.launchType, "premium"))
  const premiumPlusLaunches = await db
    .select({ count: sql`count(*)` })
    .from(project)
    .where(eq(project.launchType, "premium_plus"))

  // Get new launches today
  const newLaunchesToday = await db
    .select({ count: sql`count(*)` })
    .from(project)
    .where(gte(project.createdAt, today))

  // Get new premium launches today
  const newPremiumLaunchesToday = await db
    .select({ count: sql`count(*)` })
    .from(project)
    .where(and(gte(project.createdAt, today), eq(project.launchType, "premium")))

  // Get new premium plus launches today
  const newPremiumPlusLaunchesToday = await db
    .select({ count: sql`count(*)` })
    .from(project)
    .where(and(gte(project.createdAt, today), eq(project.launchType, "premium_plus")))

  return {
    users,
    stats: {
      totalLaunches: Number(totalLaunches[0]?.count || 0),
      premiumLaunches: Number(premiumLaunches[0]?.count || 0),
      premiumPlusLaunches: Number(premiumPlusLaunches[0]?.count || 0),
      totalUsers: users.length,
      newUsersToday: Number(newUsersToday[0]?.count || 0),
      newLaunchesToday: Number(newLaunchesToday[0]?.count || 0),
      newPremiumLaunchesToday: Number(newPremiumLaunchesToday[0]?.count || 0),
      newPremiumPlusLaunchesToday: Number(newPremiumPlusLaunchesToday[0]?.count || 0),
    },
  }
}

// Get free launch availability
export async function getFreeLaunchAvailability() {
  await checkAdminAccess()

  const today = new Date()
  const startDate = format(addDays(today, LAUNCH_SETTINGS.MIN_DAYS_AHEAD), DATE_FORMAT.API)
  const endDate = format(addDays(today, LAUNCH_SETTINGS.MAX_DAYS_AHEAD), DATE_FORMAT.API)

  const availability = await getLaunchAvailabilityRange(startDate, endDate, "free")

  // Find the first available date
  const firstAvailableDate = availability.find((date) => date.freeSlots > 0)

  return {
    availability,
    firstAvailableDate: firstAvailableDate
      ? {
          date: firstAvailableDate.date,
          freeSlots: firstAvailableDate.freeSlots,
        }
      : null,
  }
}

// Get all categories
export async function getCategories() {
  await checkAdminAccess()

  const categories = await db
    .select({
      name: category.name,
    })
    .from(category)
    .orderBy(category.name)

  const totalCount = await db.select({ count: sql<number>`count(*)::int` }).from(category)

  return {
    categories,
    totalCount: totalCount[0]?.count || 0,
  }
}

// Add a new category
export async function addCategory(name: string) {
  await checkAdminAccess()

  // Name validation
  const trimmedName = name.trim()
  if (!trimmedName) {
    return { success: false, error: "Category name cannot be empty" }
  }
  if (trimmedName.length < 2) {
    return { success: false, error: "Category name must be at least 2 characters long" }
  }
  if (trimmedName.length > 50) {
    return { success: false, error: "Category name cannot exceed 50 characters" }
  }

  try {
    // Check if category already exists
    const existingCategory = await db
      .select()
      .from(category)
      .where(eq(category.name, trimmedName))
      .limit(1)

    if (existingCategory.length > 0) {
      return { success: false, error: "This category already exists" }
    }

    const id = trimmedName.toLowerCase().replace(/\s+/g, "-")

    await db.insert(category).values({
      id,
      name: trimmedName,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return { success: true }
  } catch (error) {
    console.error("Error adding category:", error)
    if (error instanceof Error && error.message.includes("unique constraint")) {
      return { success: false, error: "This category already exists" }
    }
    return { success: false, error: "An error occurred while adding the category" }
  }
}
