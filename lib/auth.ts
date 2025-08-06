import { db } from "@/drizzle/db"
import { stripe } from "@better-auth/stripe"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, captcha, oneTap } from "better-auth/plugins"
import Stripe from "stripe"

import { sendEmail } from "@/lib/email"

// 只有在 Stripe 密钥存在时才创建 Stripe 客户端
const stripeClient = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_...' 
  ? new Stripe(process.env.STRIPE_SECRET_KEY) 
  : null

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const html = `
        <p>Hello ${user.name},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${url}" style="padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>Or copy and paste this URL into your browser:</p>
        <p>${url}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `

      try {
        await sendEmail({
          to: user.email,
          subject: "Reset your password",
          html,
        })
      } catch (error) {
        console.error("Failed to send reset password email:", error)
        // 不抛出错误，避免阻塞密码重置流程
      }
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const html = `
        <p>Hello ${user.name},</p>
        <p>Click the link below to verify your email address:</p>
        <a href="${url}" style="padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>Or copy and paste this URL into your browser:</p>
        <p>${url}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      `

      try {
        await sendEmail({
          to: user.email,
          subject: "Verify your email address",
          html,
        })
      } catch (error) {
        console.error("Failed to send verification email:", error)
        // 不抛出错误，避免阻塞用户注册
      }
    },
    expiresIn: 86400,
  },
  socialProviders: {
    // 只有在 Google OAuth 配置完整时才启用
    ...(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && 
        process.env.GOOGLE_CLIENT_SECRET && 
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== 'your_google_client_id' &&
        process.env.GOOGLE_CLIENT_SECRET !== 'your_google_client_secret'
      ? {
          google: {
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }
        }
      : {}
    ),
    // 只有在 GitHub OAuth 配置完整时才启用
    ...(process.env.GITHUB_CLIENT_ID && 
        process.env.GITHUB_CLIENT_SECRET && 
        process.env.GITHUB_CLIENT_ID !== 'your_github_client_id' &&
        process.env.GITHUB_CLIENT_SECRET !== 'your_github_client_secret'
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }
        }
      : {}
    ),
  },
  trustedOrigins: [
    process.env.NODE_ENV !== "development"
      ? process.env.NEXT_PUBLIC_URL!
      : "http://localhost:3000",
  ],
  plugins: [
    // 只有在 Stripe 配置完整时才启用 Stripe 插件
    ...(stripeClient && process.env.STRIPE_WEBHOOK_SECRET && process.env.STRIPE_WEBHOOK_SECRET !== 'whsec_...' 
      ? [stripe({
          stripeClient,
          stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
          createCustomerOnSignUp: true,
        })] 
      : []
    ),
    // 只有在 Turnstile 配置完整时才启用验证码插件
    ...(process.env.TURNSTILE_SECRET_KEY && process.env.TURNSTILE_SECRET_KEY !== 'your_turnstile_secret_key'
      ? [captcha({
          provider: "cloudflare-turnstile",
          secretKey: process.env.TURNSTILE_SECRET_KEY,
          endpoints: ["/sign-up/email", "/sign-in/email", "/forget-password"],
        })]
      : []
    ),
    // 只有在 Google Client ID 配置时才启用 One Tap
    ...(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== 'your_google_client_id'
      ? [oneTap({
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        })]
      : []
    ),
    admin({}),
  ],
})
