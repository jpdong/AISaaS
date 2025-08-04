import { Resend } from "resend"

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailPayload {
  to: string
  subject: string
  html: string
}

/**
 * Sends an email using Resend
 * @param payload - Email configuration object
 * @returns Promise that resolves when email is sent
 */
export async function sendEmail(payload: EmailPayload) {
  const { to, subject, html } = payload

  try {
    const data = await resend.emails.send({
      from: "Open-Launch <noreply@open-launch.com>",
      to,
      subject,
      html,
    })

    return { success: true, data }
  } catch (error) {
    console.error("Failed to send email:", error)
    throw new Error("Failed to send email")
  }
}
