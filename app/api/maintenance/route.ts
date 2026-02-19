import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/maintenance - Run database maintenance tasks
// Protected by CRON_SECRET
export async function POST(request: NextRequest) {
  // Verify CRON_SECRET
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = {
      timestamp: new Date().toISOString(),
      cleanedSessions: 0,
      cleanedTokens: 0,
      cleanedPushSubs: 0,
      expiredTrials: 0,
      stats: {
        users: 0,
        dreams: 0,
        sessions: 0,
        pushSubscriptions: 0,
      },
    };

    // 1. Clean expired sessions
    const expiredSessions = await prisma.session.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });
    results.cleanedSessions = expiredSessions.count;

    // 2. Clean expired verification tokens
    const expiredTokens = await prisma.verificationToken.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });
    results.cleanedTokens = expiredTokens.count;

    // 3. Clean stale push subscriptions (older than 90 days without update)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const stalePushSubs = await prisma.pushSubscription.deleteMany({
      where: {
        createdAt: {
          lt: ninetyDaysAgo,
        },
      },
    });
    results.cleanedPushSubs = stalePushSubs.count;

    // 4. Expire finished Oracle+ trials
    const expiredTrials = await prisma.user.updateMany({
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
    results.expiredTrials = expiredTrials.count;

    // 5. Get database stats
    const [users, dreams, sessions, pushSubscriptions] = await Promise.all([
      prisma.user.count(),
      prisma.dream.count(),
      prisma.session.count(),
      prisma.pushSubscription.count(),
    ]);

    results.stats = { users, dreams, sessions, pushSubscriptions };

    console.log("Database maintenance completed:", results);

    return NextResponse.json({
      success: true,
      message: "Maintenance completed successfully",
      ...results,
    });
  } catch (error) {
    console.error("Maintenance error:", error);
    return NextResponse.json(
      { error: "Maintenance failed", details: String(error) },
      { status: 500 }
    );
  }
}

// GET /api/maintenance - Get database health stats
export async function GET(request: NextRequest) {
  // Verify CRON_SECRET
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get counts
    const [users, dreams, sessions, pushSubscriptions, settings] =
      await Promise.all([
        prisma.user.count(),
        prisma.dream.count(),
        prisma.session.count(),
        prisma.pushSubscription.count(),
        prisma.userSettings.count({
          where: { notificationsEnabled: true },
        }),
      ]);

    // Get expired session count
    const expiredSessions = await prisma.session.count({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });

    // Calculate average dreams per user
    const avgDreamsPerUser = users > 0 ? (dreams / users).toFixed(2) : "0";

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      stats: {
        users,
        dreams,
        avgDreamsPerUser,
        activeSessions: sessions,
        expiredSessions,
        pushSubscriptions,
        usersWithNotifications: settings,
      },
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      { status: "unhealthy", error: String(error) },
      { status: 500 }
    );
  }
}
