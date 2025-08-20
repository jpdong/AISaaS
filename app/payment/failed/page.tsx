"use client"

import { useRouter } from "next/navigation"

import { RiAlertLine, RiArrowLeftLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"

export default function PaymentFailedPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto max-w-md px-4 py-12">
      <div className="bg-card rounded-lg border p-6 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <RiAlertLine className="h-8 w-8 text-blue-500" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Payment Features Disabled</h1>
        <p className="text-muted-foreground mb-6">
          Payment functionality is currently disabled. All projects can be submitted for free!
        </p>
        <Button onClick={() => router.push("/")} className="flex items-center gap-2">
          <RiArrowLeftLine className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  )
}
