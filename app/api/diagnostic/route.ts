import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/admin/diagnostic — Quick diagnostic stats (protected by CRON_SECRET)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();

  // All users with dream count
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      lastLoginAt: true,
      trialEndsAt: true,
      trialConvertedAt: true,
      trialExpiredAt: true,
      subscriptionTier: true,
      stripeSubscriptionId: true,
      acquisitionSource: true,
      _count: { select: { dreams: true, usageLogs: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalUsers = users.length;
  const usersWithDreams = users.filter(u => u._count.dreams > 0);
  const usersWithoutDreams = users.filter(u => u._count.dreams === 0);
  const paidUsers = users.filter(u => u.stripeSubscriptionId !== null);

  // Breakdown: users without dreams - when did they register?
  const noDreamsAgeBreakdown = {
    last24h: usersWithoutDreams.filter(u => now.getTime() - u.createdAt.getTime() < 24 * 60 * 60 * 1000).length,
    last3days: usersWithoutDreams.filter(u => {
      const age = now.getTime() - u.createdAt.getTime();
      return age >= 24 * 60 * 60 * 1000 && age < 3 * 24 * 60 * 60 * 1000;
    }).length,
    last7days: usersWithoutDreams.filter(u => {
      const age = now.getTime() - u.createdAt.getTime();
      return age >= 3 * 24 * 60 * 60 * 1000 && age < 7 * 24 * 60 * 60 * 1000;
    }).length,
    olderThan7days: usersWithoutDreams.filter(u => now.getTime() - u.createdAt.getTime() >= 7 * 24 * 60 * 60 * 1000).length,
  };

  // Did users without dreams ever log back in?
  const noDreamsNeverReturned = usersWithoutDreams.filter(u => {
    if (!u.lastLoginAt) return true;
    // If lastLogin is within 5 min of creation, they never returned
    return Math.abs(u.lastLoginAt.getTime() - u.createdAt.getTime()) < 5 * 60 * 1000;
  }).length;

  // Users with dreams: dream count distribution
  const dreamCountDistribution = {
    '1_dream': usersWithDreams.filter(u => u._count.dreams === 1).length,
    '2_3_dreams': usersWithDreams.filter(u => u._count.dreams >= 2 && u._count.dreams <= 3).length,
    '4_10_dreams': usersWithDreams.filter(u => u._count.dreams >= 4 && u._count.dreams <= 10).length,
    '10plus_dreams': usersWithDreams.filter(u => u._count.dreams > 10).length,
  };

  // Conversion by engagement level
  const conversionByDreamCount = {
    '0_dreams': {
      total: usersWithoutDreams.length,
      paid: usersWithoutDreams.filter(u => u.stripeSubscriptionId !== null).length,
    },
    '1_dream': {
      total: usersWithDreams.filter(u => u._count.dreams === 1).length,
      paid: usersWithDreams.filter(u => u._count.dreams === 1 && u.stripeSubscriptionId !== null).length,
    },
    '2_3_dreams': {
      total: usersWithDreams.filter(u => u._count.dreams >= 2 && u._count.dreams <= 3).length,
      paid: usersWithDreams.filter(u => u._count.dreams >= 2 && u._count.dreams <= 3 && u.stripeSubscriptionId !== null).length,
    },
    '4plus_dreams': {
      total: usersWithDreams.filter(u => u._count.dreams >= 4).length,
      paid: usersWithDreams.filter(u => u._count.dreams >= 4 && u.stripeSubscriptionId !== null).length,
    },
  };

  // Time to first dream (for users who have dreams)
  const firstDreamDelays = await prisma.dream.groupBy({
    by: ['userId'],
    _min: { createdAt: true },
  });

  const delays: number[] = [];
  for (const fd of firstDreamDelays) {
    const user = users.find(u => u.id === fd.userId);
    if (user && fd._min.createdAt) {
      const delayHours = (fd._min.createdAt.getTime() - user.createdAt.getTime()) / (60 * 60 * 1000);
      delays.push(delayHours);
    }
  }
  delays.sort((a, b) => a - b);

  const timeToFirstDream = delays.length > 0 ? {
    median_hours: Math.round(delays[Math.floor(delays.length / 2)] * 10) / 10,
    avg_hours: Math.round(delays.reduce((a, b) => a + b, 0) / delays.length * 10) / 10,
    within_1h: delays.filter(d => d <= 1).length,
    within_24h: delays.filter(d => d <= 24).length,
    after_24h: delays.filter(d => d > 24).length,
  } : null;

  // List of users without dreams (for review)
  const ghostUsers = usersWithoutDreams.map(u => ({
    email: u.email,
    name: u.name,
    registeredAt: u.createdAt.toISOString(),
    lastLogin: u.lastLoginAt?.toISOString() || null,
    daysSinceRegistration: Math.floor((now.getTime() - u.createdAt.getTime()) / (24 * 60 * 60 * 1000)),
    source: u.acquisitionSource,
    tier: u.subscriptionTier,
  }));

  return NextResponse.json({
    summary: {
      totalUsers,
      usersWithDreams: usersWithDreams.length,
      usersWithoutDreams: usersWithoutDreams.length,
      dropoutRate: Math.round((usersWithoutDreams.length / totalUsers) * 1000) / 10,
      paidUsers: paidUsers.length,
      conversionRate: Math.round((paidUsers.length / totalUsers) * 1000) / 10,
    },
    noDreamsAnalysis: {
      ageBreakdown: noDreamsAgeBreakdown,
      neverReturnedAfterSignup: noDreamsNeverReturned,
      neverReturnedPercent: Math.round((noDreamsNeverReturned / usersWithoutDreams.length) * 1000) / 10,
    },
    dreamCountDistribution,
    conversionByDreamCount,
    timeToFirstDream,
    ghostUsers,
  });
}
