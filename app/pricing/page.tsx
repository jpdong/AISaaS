/* eslint-disable @next/next/no-img-element */
import Link from "next/link"

import { db } from "@/drizzle/db"
import { seoArticle } from "@/drizzle/db/schema"
import { RiArticleLine, RiCheckboxCircleFill, RiInformationLine, RiLinkM } from "@remixicon/react"
import { desc } from "drizzle-orm"
import { Calendar, Clock } from "lucide-react"

import { LAUNCH_LIMITS, LAUNCH_SETTINGS } from "@/lib/constants"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export const metadata = {
  title: "Pricing - AI SaaS",
  description: "Choose the perfect plan for your project launch",
  alternates: {
    canonical: "https://ai-saas.org/pricing",
  },
}

const faqItems = [
  {
    id: "1",
    title: "When do launches happen?",
    content: `All launches happen at 8:00 AM UTC. We launch a limited number of projects each day to ensure quality visibility.`,
  },
  {
    id: "2",
    title: "How many projects are launched each day?",
    content: `We launch up to ${LAUNCH_LIMITS.FREE_DAILY_LIMIT} free projects and ${LAUNCH_LIMITS.PREMIUM_DAILY_LIMIT} premium projects daily.`,
  },
  {
    id: "3",
    title: "How far in advance can I schedule my launch?",
    content: `Free users can schedule up to ${LAUNCH_SETTINGS.MAX_DAYS_AHEAD} days in advance and Premium users up to ${LAUNCH_SETTINGS.PREMIUM_MAX_DAYS_AHEAD} days.`,
  },
  {
    id: "4",
    title: "What is the refund policy for the SEO Growth Package?",
    content: `We do not offer refunds for the SEO Growth Package. Once purchased, the service is considered final and non-refundable. However, we do our best to ensure customer satisfaction and work closely with you throughout the process.`,
  },
  {
    id: "5",
    title: "How is the SEO Growth Package content created?",
    content: `Our content creation process involves thorough product testing, note-taking, screenshots, and custom illustrations. While we use AI assistance to optimize our workflow after testing your product, all content is carefully reviewed, edited, and finalized by us, a human team, to ensure quality and accuracy.`,
  },
]

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

async function getLatestReviews() {
  const reviews = await db.select().from(seoArticle).orderBy(desc(seoArticle.publishedAt)).limit(5)

  return reviews.map((review) => ({
    ...review,
    readingTime: calculateReadingTime(review.content),
  }))
}

export default async function PricingPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold">Pricing Unavailable</h1>
        <p className="text-muted-foreground mb-8">
          Premium features are currently not available. All projects can be submitted for free!
        </p>
        <a href="/projects/submit" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
          Submit Your Project
        </a>
      </div>
    </div>
  )
}
