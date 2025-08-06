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
  title: "AI SaaS - Find the Best AI Tools & Software",
  description:
    "Discover, explore, and launch the best AI SaaS tools. Join thousands of developers, entrepreneurs, and AI enthusiasts finding cutting-edge artificial intelligence solutions daily.",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  alternates: {
    canonical: "https://ai-saas.org/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "AI SaaS Discovery Platform - Find the Best AI Tools & Software",
    description:
      "Discover, explore, and launch the best AI SaaS tools and software. Join thousands of developers, entrepreneurs, and AI enthusiasts finding cutting-edge artificial intelligence solutions daily.",
    url: "https://ai-saas.org/",
    siteName: "AI SaaS Discovery Platform",
    images: [
      {
        url: "/logo.png",
        alt: "AI SaaS Discovery Platform - Find the Best AI Tools & Software",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI SaaS Discovery Platform - Find the Best AI Tools & Software",
    description:
      "Discover, explore, and launch the best AI SaaS tools and software. Join thousands of developers, entrepreneurs, and AI enthusiasts.",
    images: ["/logo.png"],
    creator: "@aisaas",
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
