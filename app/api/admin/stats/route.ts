import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

// GET - Get admin dashboard stats
export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // User stats
    const [
      totalUsers,
      newUsersToday,
      newUsersWeek,
      newUsersMonth,
      activeUsersToday,
      activeUsersWeek,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.user.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.user.count({ where: { lastLoginAt: { gte: startOfToday } } }),
      prisma.user.count({ where: { lastLoginAt: { gte: startOfWeek } } }),
    ]);

    // Subscription breakdown
    const subscriptionStats = await prisma.user.groupBy({
      by: ["subscriptionTier"],
      _count: true,
    });

    const subscriptionStatusStats = await prisma.user.groupBy({
      by: ["subscriptionStatus"],
      _count: true,
    });

    // Dream stats
    const [totalDreams, dreamsToday, dreamsWeek, dreamsMonth] = await Promise.all([
      prisma.dream.count(),
      prisma.dream.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.dream.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.dream.count({ where: { createdAt: { gte: startOfMonth } } }),
    ]);

    // Interpretation stats
    const [interpretationsTotal, interpretationsMonth] = await Promise.all([
      prisma.usageLog.count({ where: { action: "interpretation" } }),
      prisma.usageLog.count({
        where: { action: "interpretation", createdAt: { gte: startOfMonth } },
      }),
    ]);

    // Usage logs breakdown this month
    const usageBreakdown = await prisma.usageLog.groupBy({
      by: ["action"],
      where: { createdAt: { gte: startOfMonth } },
      _count: true,
    });

    // Recent signups
    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        subscriptionTier: true,
        _count: { select: { dreams: true } },
      },
    });

    // Daily signups for the last 30 days (for chart)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailySignups = await prisma.user.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: true,
    });

    // Process daily signups into a chart-friendly format
    const signupsByDay: Record<string, number> = {};
    dailySignups.forEach((entry) => {
      const date = new Date(entry.createdAt).toISOString().split("T")[0];
      signupsByDay[date] = (signupsByDay[date] || 0) + entry._count;
    });

    // === Revenue & Subscription Performance ===

    // MRR: count only users with actual Stripe subscriptions (excludes 7-day free trials)
    const paidSubscribers = await prisma.user.findMany({
      where: {
        subscriptionTier: { in: ["ESSENTIAL", "PREMIUM"] },
        subscriptionStatus: "active",
        stripeSubscriptionId: { not: null },
      },
      select: { subscriptionTier: true },
    });

    // MRR based on monthly prices (7.99€ ESSENTIAL, 13.99€ PREMIUM)
    const mrr = paidSubscribers.reduce((sum, u) => {
      return sum + (u.subscriptionTier === "ESSENTIAL" ? 799 : 1399);
    }, 0);

    // Conversion rate: paid users / total users
    const paidUsersCount = paidSubscribers.length;
    const conversionRate = totalUsers > 0 ? (paidUsersCount / totalUsers) * 100 : 0;

    // Churn: canceled this month
    const churnedThisMonth = await prisma.user.count({
      where: {
        subscriptionStatus: "canceled",
        updatedAt: { gte: startOfMonth },
        stripeCustomerId: { not: null },
      },
    });

    // === Trial Conversion Summary ===
    const [totalTrialists, trialConverted, activeTrials] = await Promise.all([
      prisma.user.count({ where: { trialUsed: true } }),
      prisma.user.count({ where: { trialUsed: true, trialConvertedAt: { not: null } } }),
      prisma.user.count({
        where: {
          trialUsed: true,
          subscriptionTier: "PREMIUM",
          stripeSubscriptionId: null,
          trialEndsAt: { gt: now },
        },
      }),
    ]);

    const trialExpired = await prisma.user.count({
      where: { trialUsed: true, trialExpiredAt: { not: null }, trialConvertedAt: null },
    });

    const completedTrials = trialConverted + trialExpired;
    const trialConversionRate = completedTrials > 0 ? (trialConverted / completedTrials) * 100 : 0;

    return NextResponse.json({
      users: {
        total: totalUsers,
        newToday: newUsersToday,
        newWeek: newUsersWeek,
        newMonth: newUsersMonth,
        activeToday: activeUsersToday,
        activeWeek: activeUsersWeek,
      },
      subscriptions: {
        byTier: subscriptionStats.reduce(
          (acc, s) => {
            acc[s.subscriptionTier] = s._count;
            return acc;
          },
          {} as Record<string, number>
        ),
        byStatus: subscriptionStatusStats.reduce(
          (acc, s) => {
            acc[s.subscriptionStatus] = s._count;
            return acc;
          },
          {} as Record<string, number>
        ),
      },
      dreams: {
        total: totalDreams,
        today: dreamsToday,
        week: dreamsWeek,
        month: dreamsMonth,
      },
      interpretations: {
        total: interpretationsTotal,
        month: interpretationsMonth,
      },
      usage: usageBreakdown.reduce(
        (acc, u) => {
          acc[u.action] = u._count;
          return acc;
        },
        {} as Record<string, number>
      ),
      recentUsers,
      signupsByDay,
      revenue: {
        mrr,
        conversionRate: Math.round(conversionRate * 10) / 10,
        paidUsers: paidUsersCount,
        churnedThisMonth,
      },
      trial: {
        totalTrialists,
        activeTrials,
        converted: trialConverted,
        expired: trialExpired,
        conversionRate: Math.round(trialConversionRate * 10) / 10,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
