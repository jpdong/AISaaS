#!/usr/bin/env node

/**
 * Open Launch 配置检查脚本
 * 检查环境变量配置并显示功能可用性状态
 */

require("dotenv").config()

// 必需的环境变量
const requiredEnvVars = ["DATABASE_URL", "REDIS_URL", "BETTER_AUTH_SECRET", "NEXT_PUBLIC_URL"]

// 可选的环境变量及其功能描述
const optionalEnvVars = {
  // Stripe 支付
  STRIPE_SECRET_KEY: "💳 Stripe 支付功能",
  STRIPE_WEBHOOK_SECRET: "💳 Stripe Webhook",

  // OAuth 登录
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: "🔐 Google OAuth 登录",
  GOOGLE_CLIENT_SECRET: "🔐 Google OAuth 登录",
  GITHUB_CLIENT_ID: "🐙 GitHub OAuth 登录",
  GITHUB_CLIENT_SECRET: "🐙 GitHub OAuth 登录",

  // 邮件服务
  RESEND_API_KEY: "📧 邮件发送功能",

  // 文件上传
  UPLOADTHING_TOKEN: "📁 文件上传功能",
  NEXT_PUBLIC_UPLOADTHING_URL: "📁 文件上传功能",

  // 验证码
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "🤖 Cloudflare 验证码",
  TURNSTILE_SECRET_KEY: "🤖 Cloudflare 验证码",

  // 通知
  DISCORD_WEBHOOK_URL: "💬 Discord 通知",
  DISCORD_LAUNCH_WEBHOOK_URL: "💬 Discord 发布通知",

  // 分析
  PLAUSIBLE_API_KEY: "📊 Plausible 分析",
  PLAUSIBLE_URL: "📊 Plausible 分析",
  PLAUSIBLE_SITE_ID: "📊 Plausible 分析",
}

// 默认值（表示未配置）
const defaultValues = [
  "sk_test_...",
  "whsec_...",
  "your_google_client_id",
  "your_google_client_secret",
  "your_github_client_id",
  "your_github_client_secret",
  "re_...",
  "your_uploadthing_token",
  "your_uploadthing_url_without_protocol",
  "your_turnstile_site_key",
  "your_turnstile_secret_key",
  "https://discord.com/api/webhooks/...",
  "your_cron_api_key",
]

function checkRequired() {
  console.log("\n🔍 检查必需配置...\n")

  const missing = []

  requiredEnvVars.forEach((varName) => {
    const value = process.env[varName]
    if (!value) {
      missing.push(varName)
      console.log(`❌ ${varName}: 未设置`)
    } else {
      console.log(`✅ ${varName}: 已配置`)
    }
  })

  if (missing.length > 0) {
    console.log(`\n⚠️  缺少 ${missing.length} 个必需的环境变量`)
    console.log("请参考 .env.example 文件进行配置")
    return false
  } else {
    console.log("\n✅ 所有必需配置都已设置")
    return true
  }
}

function checkOptional() {
  console.log("\n🔍 检查可选功能配置...\n")

  const features = {}

  Object.entries(optionalEnvVars).forEach(([varName, description]) => {
    const value = process.env[varName]
    const isConfigured = value && !defaultValues.includes(value)

    if (!features[description]) {
      features[description] = []
    }
    features[description].push({ varName, isConfigured })
  })

  Object.entries(features).forEach(([description, vars]) => {
    const allConfigured = vars.every((v) => v.isConfigured)
    const someConfigured = vars.some((v) => v.isConfigured)

    if (allConfigured) {
      console.log(`✅ ${description}: 已完整配置`)
    } else if (someConfigured) {
      console.log(`⚠️  ${description}: 部分配置`)
      vars.forEach((v) => {
        if (!v.isConfigured) {
          console.log(`   - ${v.varName}: 未配置`)
        }
      })
    } else {
      console.log(`⭕ ${description}: 未配置 (功能将被禁用)`)
    }
  })
}

function checkDatabase() {
  console.log("\n🔍 检查数据库连接...\n")

  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.log("❌ DATABASE_URL 未设置")
    return
  }

  try {
    const url = new URL(dbUrl)
    console.log(`✅ 数据库类型: ${url.protocol.replace(":", "")}`)
    console.log(`✅ 数据库主机: ${url.hostname}`)
    console.log(`✅ 数据库端口: ${url.port || "默认"}`)
    console.log(`✅ 数据库名称: ${url.pathname.substring(1)}`)
  } catch (error) {
    console.log("❌ DATABASE_URL 格式无效")
  }
}

function main() {
  console.log("🚀 Open Launch 配置检查工具")
  console.log("检查环境变量配置和功能可用性\n")

  const requiredOk = checkRequired()
  checkOptional()
  checkDatabase()

  console.log("\n📋 总结:")

  if (requiredOk) {
    console.log("✅ 应用可以正常启动")
    console.log("💡 可选功能将根据配置自动启用/禁用")
  } else {
    console.log("❌ 应用无法启动，请配置必需的环境变量")
    process.exit(1)
  }

  console.log('\n运行 "bun run dev" 查看详细的功能状态')
}

main()
