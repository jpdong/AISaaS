/* eslint-disable @next/next/no-img-element */
import { headers } from "next/headers"
import Link from "next/link"
import { Metadata } from "next"

import { auth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ProjectSection } from "@/components/home/project-section"
import { getMonthBestProjects, getTodayProjects, getYesterdayProjects } from "@/app/actions/home"
import { getLast30DaysPageviews, getLast30DaysVisitors } from "@/app/actions/plausible"
import { getTopCategories } from "@/app/actions/projects"

export const metadata: Metadata = {
  title: "AI SaaS - Find the Best AI Tools & Software",
  description: "Discover, explore, and launch the best AI SaaS tools. Join thousands of developers, entrepreneurs, and AI enthusiasts finding artificial intelligence solutions.",
  alternates: {
    canonical: "https://ai-saas.org/",
  },
  openGraph: {
    title: "AI SaaS - Find the Best AI Tools & Software",
    description: "Discover, explore, and launch the best AI SaaS tools and software. Join thousands of developers, entrepreneurs, and AI enthusiasts.",
    type: "website",
    url: "https://ai-saas.org/",
  },
}

export default async function Home() {
  // Récupérer les données réelles
  const todayProjects = await getTodayProjects()
  const yesterdayProjects = await getYesterdayProjects()
  const monthProjects = await getMonthBestProjects()
  const topCategories = await getTopCategories(5)

  const last30DaysVisitors = await getLast30DaysVisitors()
  const last30DaysPageviews = await getLast30DaysPageviews()

  // // Get session
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AI SaaS Discovery Platform",
    "description": "Discover, explore, and launch the best AI SaaS tools and software",
    "url": process.env.NEXT_PUBLIC_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_URL}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI SaaS Discovery Platform",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_URL}/logo.png`
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="bg-muted/30 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted/30 py-12 md:py-20">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Discover the Best{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI SaaS Tools
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Join thousands of developers, entrepreneurs, and AI enthusiasts discovering cutting-edge artificial intelligence software and SaaS solutions launching daily.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/categories">
                  Explore AI Tools
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects/submit">
                  Submit Your AI SaaS
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto max-w-6xl px-4 pt-6 pb-12 md:pt-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:items-start">
            {/* Main Content */}
            <div className="space-y-6 sm:space-y-8 lg:col-span-2">


              {/* Featured AI SaaS Tools */}
              <section>
                <ProjectSection
                  title="🚀 Top AI SaaS Tools Launching Today"
                  projects={todayProjects}
                  sortByUpvotes={true}
                  isAuthenticated={!!session?.user}
                />
              </section>

              <section>
                <ProjectSection
                  title="⭐ Yesterday's AI Launches"
                  projects={yesterdayProjects}
                  moreHref="/trending?filter=yesterday"
                  sortByUpvotes={true}
                  isAuthenticated={!!session?.user}
                />
              </section>

              <section>
                <ProjectSection
                  title="🏆 This Month's Best AI Tools"
                  projects={monthProjects}
                  moreHref="/trending?filter=month"
                  sortByUpvotes={true}
                  isAuthenticated={!!session?.user}
                />
              </section>

              {/* AI SaaS Categories Overview */}
              <section className="mt-12">
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="mb-4 text-2xl font-semibold">Popular AI SaaS Categories</h2>
                  <p className="mb-6 text-muted-foreground">
                    Explore AI tools across different categories - from machine learning platforms to automation software.
                  </p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <Link href="/categories?category=ai" className="rounded-md border p-3 text-center transition-colors hover:bg-muted/50">
                      <div className="text-2xl mb-2">🤖</div>
                      <div className="font-medium">AI & ML</div>
                    </Link>
                    <Link href="/categories?category=automation" className="rounded-md border p-3 text-center transition-colors hover:bg-muted/50">
                      <div className="text-2xl mb-2">⚡</div>
                      <div className="font-medium">Automation</div>
                    </Link>
                    <Link href="/categories?category=analytics" className="rounded-md border p-3 text-center transition-colors hover:bg-muted/50">
                      <div className="text-2xl mb-2">📊</div>
                      <div className="font-medium">Analytics</div>
                    </Link>
                    <Link href="/categories?category=nlp" className="rounded-md border p-3 text-center transition-colors hover:bg-muted/50">
                      <div className="text-2xl mb-2">💬</div>
                      <div className="font-medium">NLP</div>
                    </Link>
                    <Link href="/categories?category=computer-vision" className="rounded-md border p-3 text-center transition-colors hover:bg-muted/50">
                      <div className="text-2xl mb-2">👁️</div>
                      <div className="font-medium">Computer Vision</div>
                    </Link>
                    <Link href="/categories?category=productivity" className="rounded-md border p-3 text-center transition-colors hover:bg-muted/50">
                      <div className="text-2xl mb-2">🚀</div>
                      <div className="font-medium">Productivity</div>
                    </Link>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="top-24">
              {/* Platform Statistics */}
              {(last30DaysVisitors !== null || last30DaysPageviews !== null) && (
                <div className="space-y-3 pt-0 pb-4">
                  <h3 className="flex items-center gap-2 font-semibold">🔥 Platform Growth</h3>

                  <div className="grid grid-cols-2 gap-4">
                    {last30DaysVisitors !== null && (
                      <div className="hover:bg-muted/40 rounded-md border p-2 text-center transition-colors">
                        <div className="text-xl font-bold">{last30DaysVisitors}</div>
                        <div className="text-muted-foreground text-xs font-medium">Visitors</div>
                      </div>
                    )}

                    {last30DaysPageviews !== null && (
                      <div className="hover:bg-muted/40 rounded-md border p-2 text-center transition-colors">
                        <div className="text-xl font-bold">{last30DaysPageviews}</div>
                        <div className="text-muted-foreground text-xs font-medium">Page Views</div>
                      </div>
                    )}
                  </div>
                </div>
              )}


              {/* AI Categories */}
              <div className="space-y-3 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-semibold">🎯 Trending AI Categories</h3>
                  <Button variant="ghost" size="sm" className="text-sm" asChild>
                    <Link href="/categories" className="flex items-center gap-1">
                      View all
                    </Link>
                  </Button>
                </div>
                <div className="space-y-2">
                  {topCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories?category=${category.id}`}
                      className={cn(
                        "-mx-2 flex items-center justify-between rounded-md p-2",
                        category.id === "all" ? "bg-muted font-medium" : "hover:bg-muted/40",
                      )}
                    >
                      <span className="text-sm">{category.name}</span>
                      <span className="text-muted-foreground bg-secondary rounded-full px-2 py-0.5 text-xs">
                        {category.count} projects
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              {/* Podium
            {yesterdayProjects.length > 0 && (
              <div className="p-5 pt-0 space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  Yesterday&apos;s Top Launches
                </h3>
                <TopLaunchesPodium topProjects={yesterdayProjects} />
              </div>
            )} */}

              {/* Quick Navigation */}
              <div className="space-y-3 py-4">
                <h3 className="flex items-center gap-2 font-semibold">🔗 Quick Navigation</h3>
                <div className="space-y-2">
                  {session?.user && (
                    <Link
                      href="/dashboard"
                      className="-mx-2 flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:bg-muted/50"
                    >
                      📊 Dashboard
                    </Link>
                  )}
                  <Link
                    href="/trending"
                    className="-mx-2 flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    📈 Trending AI Tools
                  </Link>
                  <Link
                    href="/winners"
                    className="-mx-2 flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    🏆 Daily Winners
                  </Link>
                  <Link
                    href="/trending?filter=month"
                    className="-mx-2 flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    ⭐ Best AI Tools This Month
                  </Link>
                  <Link
                    href="/projects/submit"
                    className="-mx-2 flex items-center gap-2 rounded-md p-2 text-sm font-medium text-primary transition-colors hover:bg-muted/50"
                  >
                    🚀 Submit Your AI SaaS
                  </Link>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="space-y-3 py-4">
                <h3 className="flex items-center gap-2 font-semibold">💡 Why AI SaaS Discovery?</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Curated AI tools reviewed by experts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Daily launches from innovative startups</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Community-driven ratings & reviews</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Free platform for developers & entrepreneurs</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}
