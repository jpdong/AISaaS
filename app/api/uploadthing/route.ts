import { createRouteHandler } from "uploadthing/next"

import { ourFileRouter } from "./core"

// Debug environment variables
console.log("UploadThing Config:", {
  hasToken: !!process.env.UPLOADTHING_TOKEN,
  tokenLength: process.env.UPLOADTHING_TOKEN?.length,
  url: process.env.NEXT_PUBLIC_UPLOADTHING_URL,
  nodeEnv: process.env.NODE_ENV,
})

// Validate token format
if (process.env.UPLOADTHING_TOKEN) {
  try {
    const decoded = Buffer.from(process.env.UPLOADTHING_TOKEN, 'base64').toString('utf-8')
    const tokenData = JSON.parse(decoded)
    console.log("Token validation:", {
      hasApiKey: !!tokenData.apiKey,
      hasAppId: !!tokenData.appId,
      hasRegions: !!tokenData.regions,
      appId: tokenData.appId,
    })
  } catch (error) {
    console.error("Invalid UPLOADTHING_TOKEN format:", error)
  }
} else {
  console.error("UPLOADTHING_TOKEN is not set!")
}

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  },
})
