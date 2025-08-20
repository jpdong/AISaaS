"use client"

import Image from "next/image"
import Link from "next/link"

import { RiStarSFill } from "@remixicon/react"

interface Project {
  id: string
  slug: string
  name: string
  logoUrl: string
  description?: string | null
  launchStatus: string
}

interface PremiumCardProps {
  projects: Project[]
}

export function PremiumCard({ projects }: PremiumCardProps) {
  return null
}
