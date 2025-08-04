import type { NextConfig } from "next"

import createMDX from "@next/mdx"
import remarkGfm from "remark-gfm"

const nextConfig: NextConfig = {
  /* config options here */

  // Configuration pour MDX
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yt3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "yt3.ggpht.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "designmodo.com",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_UPLOADTHING_URL!,
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "nexty.dev",
      },
      {
        protocol: "https",
        hostname: "yxucdfr9f5.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "findly.tools",
      },
      {
        protocol: "https",
        hostname: "twelve.tools",
      },
      {
        protocol: "https",
        hostname: "bestdirectories.org",
      },
      {
        protocol: "https",
        hostname: "aiwith.me",
      },
      {
        protocol: "https",
        hostname: "startupfa.me",
      },
      {
        protocol: "https",
        hostname: "api.producthunt.com",
      },
      {
        protocol: "https",
        hostname: "magicbox.tools",
      },
      {
        protocol: "https",
        hostname: "frogdr.com",
      },
      {
        protocol: "https",
        hostname: "open-launch.com",
      },
      {
        protocol: "https",
        hostname: "img.shields.io",
      },
    ],
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
  },
})

// Combine MDX and Next.js config
export default withMDX(nextConfig)
