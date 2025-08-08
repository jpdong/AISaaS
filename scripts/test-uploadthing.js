#!/usr/bin/env node

/**
 * UploadThing 配置测试脚本
 * 用于验证环境变量是否正确配置
 */

console.log("🔍 Testing UploadThing Configuration...\n")

// 检查环境变量
const token = process.env.UPLOADTHING_TOKEN
const url = process.env.NEXT_PUBLIC_UPLOADTHING_URL

console.log("📋 Environment Variables:")
console.log(`  UPLOADTHING_TOKEN: ${token ? '✅ Set' : '❌ Missing'}`)
console.log(`  NEXT_PUBLIC_UPLOADTHING_URL: ${url ? '✅ Set' : '❌ Missing'}`)

if (token) {
  console.log(`  Token Length: ${token.length}`)
  
  try {
    // 验证 token 格式
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const tokenData = JSON.parse(decoded)
    
    console.log("\n🔑 Token Validation:")
    console.log(`  API Key: ${tokenData.apiKey ? '✅ Present' : '❌ Missing'}`)
    console.log(`  App ID: ${tokenData.appId ? '✅ Present' : '❌ Missing'}`)
    console.log(`  Regions: ${tokenData.regions ? '✅ Present' : '❌ Missing'}`)
    
    if (tokenData.appId) {
      console.log(`  App ID Value: ${tokenData.appId}`)
    }
    
    if (tokenData.regions) {
      console.log(`  Regions: ${tokenData.regions.join(', ')}`)
    }
    
  } catch (error) {
    console.log("\n❌ Token Format Error:")
    console.log(`  ${error.message}`)
  }
}

if (url) {
  console.log(`\n🌐 Upload URL: ${url}`)
  
  // 验证 URL 格式
  if (url.includes('://')) {
    console.log("  ⚠️  Warning: URL should not include protocol (https://)")
  } else {
    console.log("  ✅ URL format looks correct")
  }
}

console.log("\n🚀 Next Steps:")
console.log("1. Ensure all environment variables are set in Vercel")
console.log("2. Redeploy your application")
console.log("3. Check Vercel function logs for any errors")
console.log("4. Test file upload functionality")