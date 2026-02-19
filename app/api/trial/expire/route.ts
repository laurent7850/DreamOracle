import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/trial/expire - Expire finished Oracle+ trials
// Protected by CRON_SECRET — should be called daily
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find all users with expired trials who are still PREMIUM without a Stripe subscription
    const result = await prisma.user.updateMany({
      where: {
        trialEndsAt: { lt: new Date() },
        subscriptionTier: "PREMIUM",
        stripeSubscriptionId: null,
      },
      data: {
        subscriptionTier: "FREE",
        creditsResetAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      expired: result.count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Trial expiration error:", error);
    return NextResponse.json(
      { error: "Trial expiration failed" },
      { status: 500 }
    );
  }
}
