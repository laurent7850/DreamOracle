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
    // First, find users to expire (we need their IDs for event logging)
    const usersToExpire = await prisma.user.findMany({
      where: {
        trialEndsAt: { lt: new Date() },
        subscriptionTier: "PREMIUM",
        stripeSubscriptionId: null,
      },
      select: {
        id: true,
        acquisitionSource: true,
        acquisitionCampaign: true,
        _count: { select: { dreams: true, usageLogs: true } },
      },
    });

    if (usersToExpire.length > 0) {
      // Batch update: downgrade all expired trials
      await prisma.user.updateMany({
        where: {
          id: { in: usersToExpire.map((u) => u.id) },
        },
        data: {
          subscriptionTier: "FREE",
          creditsResetAt: new Date(),
          trialExpiredAt: new Date(),
        },
      });

      // Log trial expiration events for each user
      await prisma.trialEvent.createMany({
        data: usersToExpire.map((user) => ({
          userId: user.id,
          event: "trial_expired",
          metadata: JSON.stringify({
            dreamsCreated: user._count.dreams,
            totalActions: user._count.usageLogs,
            source: user.acquisitionSource || "organic",
            campaign: user.acquisitionCampaign || null,
          }),
        })),
      });
    }

    return NextResponse.json({
      success: true,
      expired: usersToExpire.length,
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
