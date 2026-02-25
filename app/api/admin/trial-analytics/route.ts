import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

// GET - Get trial conversion analytics
export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // === Core Trial Metrics ===

    // Total users who had a trial
    const totalTrialists = await prisma.user.count({
      where: { trialUsed: true },
    });

    // Trial users who converted (have a stripe subscription)
    const trialConverted = await prisma.user.count({
      where: {
        trialUsed: true,
        trialConvertedAt: { not: null },
      },
    });

    // Trial users who expired without converting
    const trialExpired = await prisma.user.count({
      where: {
        trialUsed: true,
        trialExpiredAt: { not: null },
        trialConvertedAt: null,
      },
    });

    // Currently in trial (active trial users)
    const activeTrials = await prisma.user.count({
      where: {
        trialUsed: true,
        subscriptionTier: "PREMIUM",
        stripeSubscriptionId: null,
        trialEndsAt: { gt: now },
      },
    });

    // Trial conversion rate
    const completedTrials = trialConverted + trialExpired;
    const trialConversionRate =
      completedTrials > 0 ? (trialConverted / completedTrials) * 100 : 0;

    // === This Month Metrics ===

    const newTrialistsMonth = await prisma.user.count({
      where: {
        trialUsed: true,
        createdAt: { gte: startOfMonth },
      },
    });

    const conversionsMonth = await prisma.user.count({
      where: {
        trialConvertedAt: { gte: startOfMonth },
      },
    });

    const expiredMonth = await prisma.user.count({
      where: {
        trialExpiredAt: { gte: startOfMonth },
      },
    });

    // === Acquisition Source Breakdown ===

    const sourceBreakdown = await prisma.user.groupBy({
      by: ["acquisitionSource"],
      where: { trialUsed: true },
      _count: true,
    });

    // Conversion rate by source
    const sourceConversions = await prisma.user.groupBy({
      by: ["acquisitionSource"],
      where: {
        trialUsed: true,
        trialConvertedAt: { not: null },
      },
      _count: true,
    });

    const conversionsBySource = sourceBreakdown.map((source) => {
      const sourceTotal = source._count;
      const converted =
        sourceConversions.find(
          (s) => s.acquisitionSource === source.acquisitionSource
        )?._count || 0;
      return {
        source: source.acquisitionSource || "organic",
        total: sourceTotal,
        converted,
        conversionRate:
          sourceTotal > 0
            ? Math.round((converted / sourceTotal) * 1000) / 10
            : 0,
      };
    });

    // === Campaign Performance ===

    const campaignBreakdown = await prisma.user.groupBy({
      by: ["acquisitionCampaign"],
      where: {
        trialUsed: true,
        acquisitionCampaign: { not: null },
      },
      _count: true,
    });

    const campaignConversions = await prisma.user.groupBy({
      by: ["acquisitionCampaign"],
      where: {
        trialUsed: true,
        trialConvertedAt: { not: null },
        acquisitionCampaign: { not: null },
      },
      _count: true,
    });

    const conversionsByCampaign = campaignBreakdown.map((campaign) => {
      const total = campaign._count;
      const converted =
        campaignConversions.find(
          (c) => c.acquisitionCampaign === campaign.acquisitionCampaign
        )?._count || 0;
      return {
        campaign: campaign.acquisitionCampaign,
        total,
        converted,
        conversionRate:
          total > 0 ? Math.round((converted / total) * 1000) / 10 : 0,
      };
    });

    // === Feature Usage During Trial (users who used features and converted vs didn't) ===

    // Average usage for converted vs expired trial users
    const convertedUsers = await prisma.user.findMany({
      where: { trialUsed: true, trialConvertedAt: { not: null } },
      select: {
        id: true,
        _count: { select: { dreams: true, usageLogs: true } },
      },
    });

    const expiredUsers = await prisma.user.findMany({
      where: {
        trialUsed: true,
        trialExpiredAt: { not: null },
        trialConvertedAt: null,
      },
      select: {
        id: true,
        _count: { select: { dreams: true, usageLogs: true } },
      },
    });

    const avgDreamsConverted =
      convertedUsers.length > 0
        ? convertedUsers.reduce((sum, u) => sum + u._count.dreams, 0) /
          convertedUsers.length
        : 0;

    const avgDreamsExpired =
      expiredUsers.length > 0
        ? expiredUsers.reduce((sum, u) => sum + u._count.dreams, 0) /
          expiredUsers.length
        : 0;

    const avgActionsConverted =
      convertedUsers.length > 0
        ? convertedUsers.reduce((sum, u) => sum + u._count.usageLogs, 0) /
          convertedUsers.length
        : 0;

    const avgActionsExpired =
      expiredUsers.length > 0
        ? expiredUsers.reduce((sum, u) => sum + u._count.usageLogs, 0) /
          expiredUsers.length
        : 0;

    // === Daily trial events for chart (last 30 days) ===

    const trialEvents = await prisma.trialEvent.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { event: true, createdAt: true },
    });

    const dailyEvents: Record<string, { started: number; converted: number; expired: number }> = {};
    trialEvents.forEach((ev) => {
      const date = ev.createdAt.toISOString().split("T")[0];
      if (!dailyEvents[date]) {
        dailyEvents[date] = { started: 0, converted: 0, expired: 0 };
      }
      if (ev.event === "trial_started") dailyEvents[date].started++;
      if (ev.event === "trial_converted") dailyEvents[date].converted++;
      if (ev.event === "trial_expired") dailyEvents[date].expired++;
    });

    // === Recent trial users with status ===

    const recentTrialUsers = await prisma.user.findMany({
      where: { trialUsed: true },
      take: 15,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        trialEndsAt: true,
        trialConvertedAt: true,
        trialExpiredAt: true,
        subscriptionTier: true,
        acquisitionSource: true,
        acquisitionCampaign: true,
        _count: { select: { dreams: true, usageLogs: true } },
      },
    });

    const recentTrials = recentTrialUsers.map((user) => ({
      ...user,
      status: user.trialConvertedAt
        ? "converted"
        : user.trialExpiredAt
          ? "expired"
          : user.trialEndsAt && user.trialEndsAt > now
            ? "active"
            : "expiring_soon",
    }));

    return NextResponse.json({
      overview: {
        totalTrialists,
        activeTrials,
        trialConverted,
        trialExpired,
        trialConversionRate: Math.round(trialConversionRate * 10) / 10,
      },
      thisMonth: {
        newTrialists: newTrialistsMonth,
        conversions: conversionsMonth,
        expired: expiredMonth,
      },
      acquisition: {
        bySource: conversionsBySource,
        byCampaign: conversionsByCampaign,
      },
      engagement: {
        converted: {
          avgDreams: Math.round(avgDreamsConverted * 10) / 10,
          avgActions: Math.round(avgActionsConverted * 10) / 10,
        },
        expired: {
          avgDreams: Math.round(avgDreamsExpired * 10) / 10,
          avgActions: Math.round(avgActionsExpired * 10) / 10,
        },
      },
      dailyEvents,
      recentTrials,
    });
  } catch (error) {
    console.error("Trial analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trial analytics" },
      { status: 500 }
    );
  }
}
