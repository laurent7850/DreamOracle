import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendFunnelEmail } from '@/lib/funnel-emails';

// Funnel steps and how many days after registration they fire
const FUNNEL_STEPS = [
  { step: 1, daysAfter: 1 },
  { step: 3, daysAfter: 3 },
  { step: 4, daysAfter: 4 },
] as const;

// POST /api/emails/funnel — Send funnel emails to trial users
// Protected by CRON_SECRET — should be called daily
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results: Record<string, number> = {};
    const now = new Date();

    for (const { step, daysAfter } of FUNNEL_STEPS) {
      // Window: users who registered between daysAfter-1 and daysAfter days ago
      // e.g., for Day 1: registered between 24h and 48h ago
      const windowStart = new Date(now.getTime() - (daysAfter + 1) * 24 * 60 * 60 * 1000);
      const windowEnd = new Date(now.getTime() - daysAfter * 24 * 60 * 60 * 1000);

      // Find eligible users:
      // - Registered in the right window
      // - In trial (trialUsed: true)
      // - Not yet converted to paid
      // - Haven't received this step yet
      const eligibleUsers = await prisma.user.findMany({
        where: {
          createdAt: { gte: windowStart, lt: windowEnd },
          trialUsed: true,
          stripeSubscriptionId: null,
          trialConvertedAt: null,
          funnelEmails: { none: { step } },
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      let sent = 0;
      for (const user of eligibleUsers) {
        const success = await sendFunnelEmail(user.id, user.email, user.name, step);
        if (success) sent++;
      }

      results[`day_${step}`] = sent;
    }

    return NextResponse.json({
      success: true,
      sent: results,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Funnel email CRON error:', error);
    return NextResponse.json(
      { error: 'Funnel email processing failed' },
      { status: 500 }
    );
  }
}
