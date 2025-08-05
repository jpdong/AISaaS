/**
 * 功能特性检查工具
 * 根据环境变量配置动态启用/禁用功能
 */

export const featureFlags = {
  // Stripe 支付功能
  stripe: {
    enabled: !!(
      process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_SECRET_KEY !== "sk_test_..." &&
      process.env.STRIPE_WEBHOOK_SECRET &&
      process.env.STRIPE_WEBHOOK_SECRET !== "whsec_..."
    ),
    paymentLinks: {
      premium: process.env.NEXT_PUBLIC_PREMIUM_PAYMENT_LINK || null,
      premiumPlus: process.env.NEXT_PUBLIC_PREMIUM_PLUS_PAYMENT_LINK || null,
    },
  },

  // OAuth 登录功能
  oauth: {
    enabled: !!(
      (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET &&
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== "your_google_client_id" &&
        process.env.GOOGLE_CLIENT_SECRET !== "your_google_client_secret") ||
      (process.env.GITHUB_CLIENT_ID &&
        process.env.GITHUB_CLIENT_SECRET &&
        process.env.GITHUB_CLIENT_ID !== "your_github_client_id" &&
        process.env.GITHUB_CLIENT_SECRET !== "your_github_client_secret")
    ),
    google: !!(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== "your_google_client_id" &&
      process.env.GOOGLE_CLIENT_SECRET !== "your_google_client_secret"
    ),
    github: !!(
      process.env.GITHUB_CLIENT_ID &&
      process.env.GITHUB_CLIENT_SECRET &&
      process.env.GITHUB_CLIENT_ID !== "your_github_client_id" &&
      process.env.GITHUB_CLIENT_SECRET !== "your_github_client_secret"
    ),
    oneTap: !!(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== "your_google_client_id"
    ),
  },

  // 邮件功能
  email: {
    enabled: !!(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_..."),
  },

  // 文件上传功能
  upload: {
    enabled: !!(
      process.env.UPLOADTHING_TOKEN &&
      process.env.UPLOADTHING_TOKEN !== "your_uploadthing_token" &&
      process.env.NEXT_PUBLIC_UPLOADTHING_URL &&
      process.env.NEXT_PUBLIC_UPLOADTHING_URL !== "your_uploadthing_url_without_protocol"
    ),
  },

  // 验证码功能
  captcha: {
    enabled: !!(
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
      process.env.TURNSTILE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY !== "your_turnstile_site_key" &&
      process.env.TURNSTILE_SECRET_KEY !== "your_turnstile_secret_key"
    ),
  },

  // Discord 通知功能
  discord: {
    enabled: !!(
      process.env.DISCORD_WEBHOOK_URL &&
      process.env.DISCORD_WEBHOOK_URL !== "https://discord.com/api/webhooks/..."
    ),
    launchNotifications: !!(
      process.env.DISCORD_LAUNCH_WEBHOOK_URL &&
      process.env.DISCORD_LAUNCH_WEBHOOK_URL !== "https://discord.com/api/webhooks/..."
    ),
  },

  // 分析功能
  analytics: {
    enabled: !!(
      process.env.PLAUSIBLE_API_KEY &&
      process.env.PLAUSIBLE_URL &&
      process.env.PLAUSIBLE_SITE_ID
    ),
    plausible: !!(
      process.env.PLAUSIBLE_API_KEY &&
      process.env.PLAUSIBLE_URL &&
      process.env.PLAUSIBLE_SITE_ID
    ),
  },
} as const

// 导出类型定义
export type FeatureFlags = typeof featureFlags

// 辅助函数：检查功能是否可用
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const featureConfig = featureFlags[feature]

  // 检查是否有 enabled 属性
  if ("enabled" in featureConfig) {
    return featureConfig.enabled
  }

  return false
}

// 辅助函数：获取可用的 OAuth 提供商
export function getAvailableOAuthProviders(): string[] {
  const providers: string[] = []

  if (featureFlags.oauth.google) providers.push("google")
  if (featureFlags.oauth.github) providers.push("github")

  return providers
}

// 辅助函数：检查是否有任何 OAuth 提供商可用
export function hasAnyOAuthProvider(): boolean {
  return getAvailableOAuthProviders().length > 0
}

// 开发环境下的功能状态日志
if (process.env.NODE_ENV === "development") {
  console.log("🚀 Feature Flags Status:")
  console.log("  💳 Stripe:", featureFlags.stripe.enabled ? "✅" : "❌")
  console.log("  🔐 Google OAuth:", featureFlags.oauth.google ? "✅" : "❌")
  console.log("  🐙 GitHub OAuth:", featureFlags.oauth.github ? "✅" : "❌")
  console.log("  📧 Email:", featureFlags.email.enabled ? "✅" : "❌")
  console.log("  📁 File Upload:", featureFlags.upload.enabled ? "✅" : "❌")
  console.log("  🤖 Captcha:", featureFlags.captcha.enabled ? "✅" : "❌")
  console.log("  💬 Discord:", featureFlags.discord.enabled ? "✅" : "❌")
  console.log("  📊 Analytics:", featureFlags.analytics.enabled ? "✅" : "❌")
}
