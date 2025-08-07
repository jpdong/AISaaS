import { sendEmail } from "@/lib/email"

interface BasicUser {
  email: string
  name: string | null
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL

function getBadgeName(ranking: number): string {
  switch (ranking) {
    case 1:
      return `Top 1 Winner`
    case 2:
      return `Top 2 Winner`
    case 3:
      return `Top 3 Winner`
    default:
      return `Winner`
  }
}

export async function sendWinnerBadgeEmail({
  projectName,
  projectSlug,
  ranking,
  user,
  launchType,
}: {
  user: BasicUser
  ranking: number
  projectName: string
  projectSlug: string
  launchType: string | null
}) {
  const badgeName = getBadgeName(ranking)
  const effectiveUserName = user.name || "Winner"
  const effectiveUserEmail = user.email
  const isPremium = launchType === "premium" || launchType === "premium_plus"

  const projectBadgesPageUrl = `${APP_URL}/projects/${projectSlug}/badges`

  const subject = `🏆 ${projectName} is a Top ${ranking} Winner!`

  // Message différent selon le type de lancement

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="font-size: 24px; color: #1a1a1a;">Hi ${effectiveUserName} 👋</h1>
      <p><strong>${projectName}</strong> is a <strong>${badgeName}</strong> on AI SaaS!</p>

      <p style="text-align: center; margin: 25px 0;">
        <a href="${projectBadgesPageUrl}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
          🏆 Get Your Badge
        </a>
      </p>
      

      <p style="margin-top: 25px;">Congrats! 🎉<br>Eric</p>
    </div>
  `

  return sendEmail({
    to: effectiveUserEmail,
    subject,
    html: htmlBody,
  })
}

export async function sendLaunchReminderEmail({
  projectName,
  projectSlug,
  user,
}: {
  user: BasicUser
  projectName: string
  projectSlug: string
}) {
  const effectiveUserName = user.name || "Creator"
  const effectiveUserEmail = user.email

  const subject = `🚀 ${projectName} is Live on AI SaaS!`
  const projectUrl = `${APP_URL}/projects/${projectSlug}`

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="font-size: 22px; color: #1a1a1a;">Hi ${effectiveUserName},</h1>
      <p>Just a quick heads-up: your project, <strong>${projectName}</strong>, is launching today on AI SaaS!</p>
      <p>We hope you had a great launch day!</p>
      <p>You can view your project live here: <a href="${projectUrl}">${projectUrl}</a></p> 
      <p style="margin-top: 25px;">Best of luck!</p>
      <p>The AI SaaS Team</p>
    </div>
  `

  return sendEmail({
    to: effectiveUserEmail,
    subject,
    html: htmlBody,
  })
}
