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
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // MRR: count active paid subscribers and estimate revenue
    const paidSubscribers = await prisma.user.findMany({
      where: {
        subscriptionTier: { in: ["ESSENTIAL", "PREMIUM"] },
        subscriptionStatus: "active",
      },
      select: { subscriptionTier: true },
    });

    // MRR based on monthly prices (7.99€ ESSENTIAL, 13.99€ PREMIUM)
    const mrr = paidSubscribers.reduce((sum, u) => {
      return sum + (u.subscriptionTier === "ESSENTIAL" ? 799 : 1399);
    }, 0);

    // Invoice revenue stats
    const [
      revenueThisMonth,
      revenueLastMonth,
      revenueTotal,
      invoicesThisMonth,
      invoicesTotal,
    ] = await Promise.all([
      prisma.invoice.aggregate({
        where: { status: "paid", paidAt: { gte: startOfMonth } },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.invoice.aggregate({
        where: { status: "paid", paidAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
        _sum: { amount: true },
      }),
      prisma.invoice.aggregate({
        where: { status: "paid" },
        _sum: { amount: true },
      }),
      prisma.invoice.count({ where: { paidAt: { gte: startOfMonth } } }),
      prisma.invoice.count(),
    ]);

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

    // Recent invoices
    const recentInvoices = await prisma.invoice.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        invoiceNumber: true,
        amount: true,
        currency: true,
        description: true,
        status: true,
        paidAt: true,
        customerName: true,
        customerEmail: true,
      },
    });

    // Monthly revenue trend (last 6 months)
    const revenueByMonth: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const monthKey = monthStart.toISOString().slice(0, 7); // "2026-02"

      const monthRevenue = await prisma.invoice.aggregate({
        where: { status: "paid", paidAt: { gte: monthStart, lte: monthEnd } },
        _sum: { amount: true },
      });
      revenueByMonth[monthKey] = monthRevenue._sum.amount || 0;
    }

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
        thisMonth: revenueThisMonth._sum.amount || 0,
        lastMonth: revenueLastMonth._sum.amount || 0,
        total: revenueTotal._sum.amount || 0,
        invoicesThisMonth,
        invoicesTotal,
        conversionRate: Math.round(conversionRate * 10) / 10,
        paidUsers: paidUsersCount,
        churnedThisMonth,
        revenueByMonth,
        recentInvoices,
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
