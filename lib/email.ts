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

  // 检查是否有Resend API密钥
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_resend_api_key') {
    console.warn("Resend API key not configured, skipping email send")
    return { success: false, error: "Email service not configured" }
  }

  try {
    console.log(`Sending email to: ${to}, subject: ${subject}`)

    const data = await resend.emails.send({
      from: "AI SaaS <noreply@ai-saas.org>", // 使用Resend的默认发送域名
      to,
      subject,
      html,
    })

    console.log("Email sent successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Failed to send email:", error)
    // 不抛出错误，而是返回失败状态，避免阻塞用户注册
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
}
