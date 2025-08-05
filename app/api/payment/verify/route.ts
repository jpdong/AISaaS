import { NextRequest, NextResponse } from "next/server"

import { db } from "@/drizzle/db"
import { project } from "@/drizzle/db/schema"
import { eq } from "drizzle-orm"
import Stripe from "stripe"

import { featureFlags } from "@/lib/feature-flags"

export async function GET(request: NextRequest) {
  try {
    // 检查 Stripe 功能是否启用
    if (!featureFlags.stripe.enabled) {
      return NextResponse.json(
        {
          error: "Payment functionality is not enabled",
          status: "disabled",
        },
        { status: 400 },
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id parameter" }, { status: 400 })
    }

    // 初始化 Stripe 客户端
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    try {
      // 从 Stripe 获取会话信息
      const session = await stripe.checkout.sessions.retrieve(sessionId)

      if (!session) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 })
      }

      // 检查支付状态
      if (session.payment_status === "paid") {
        // 从 client_reference_id 获取项目 ID
        const projectId = session.client_reference_id

        if (!projectId) {
          return NextResponse.json({ error: "Project ID not found in session" }, { status: 400 })
        }

        // 查找项目
        const [projectData] = await db
          .select({
            id: project.id,
            slug: project.slug,
            name: project.name,
            launchStatus: project.launchStatus,
          })
          .from(project)
          .where(eq(project.id, projectId))
          .limit(1)

        if (!projectData) {
          return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }

        return NextResponse.json({
          status: "complete",
          projectId: projectData.id,
          projectSlug: projectData.slug,
          projectName: projectData.name,
          launchStatus: projectData.launchStatus,
        })
      } else if (session.payment_status === "unpaid") {
        return NextResponse.json({
          status: "pending",
          message: "Payment is still being processed",
        })
      } else {
        return NextResponse.json({
          status: "failed",
          message: "Payment was not successful",
        })
      }
    } catch (stripeError) {
      console.error("Stripe API error:", stripeError)
      return NextResponse.json({ error: "Failed to verify payment with Stripe" }, { status: 500 })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
