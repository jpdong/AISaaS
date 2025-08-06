import type { Metadata } from "next"
import { Outfit as FontHeading, Inter as FontSans } from "next/font/google"

import { Toaster } from "sonner"

import Footer from "@/components/layout/footer"
import Nav from "@/components/layout/nav"
import { ThemeProvider } from "@/components/theme/theme-provider"

import "./globals.css"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontHeading = FontHeading({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL!),
  title: "AI SaaS - Discover the Best AI SaaS Products",
  description:
    "AI SaaS is a platform to discover and upvote the best tech products. Find top products launching daily.",
    icons: {
      icon: '/logo.png',
    },
    alternates: {
      canonical: `https://ai-saas.org/`,
    },
    openGraph: {
    title: "AI SaaS - Discover the Best AI SaaS Products",
    description:
      "AI SaaS is a platform to discover and upvote the best AI SaaS products. Find top products launching daily.",
    url: process.env.NEXT_PUBLIC_URL,
    siteName: "AI SaaS",
    images: [
      {
        url: "logo.png",
        alt: "AI SaaS - Discover the Best Tech Products",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI SaaS - Discover the Best Tech Products",
    description:
      "AI SaaS is a platform to discover and upvote the best tech products. Find top products launching daily.",
    images: ["logo.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      
      <body
        className={`font-sans antialiased ${fontSans.variable} ${fontHeading.variable} sm:overflow-y-scroll`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-dvh flex-col">
            <Nav />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
