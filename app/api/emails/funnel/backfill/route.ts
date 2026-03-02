import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendFunnelEmail, sendDay0FunnelEmail } from '@/lib/funnel-emails';

// POST /api/emails/funnel/backfill — Send funnel emails to all existing users based on registration date
// Protected by CRON_SECRET — one-time use
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const results: Record<string, { sent: number; skipped: number; errors: number }> = {
      day_0: { sent: 0, skipped: 0, errors: 0 },
      day_1: { sent: 0, skipped: 0, errors: 0 },
      day_3: { sent: 0, skipped: 0, errors: 0 },
      day_4: { sent: 0, skipped: 0, errors: 0 },
    };

    // Get all trial users who haven't converted yet
    const trialUsers = await prisma.user.findMany({
      where: {
        trialUsed: true,
        stripeSubscriptionId: null,
        trialConvertedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        funnelEmails: { select: { step: true } },
      },
    });

    for (const user of trialUsers) {
      const daysSinceRegistration = Math.floor(
        (now.getTime() - user.createdAt.getTime()) / (24 * 60 * 60 * 1000)
      );
      const sentSteps = new Set(user.funnelEmails.map((fe) => fe.step));

      // Determine which steps this user should receive based on their registration age
      const stepsToSend: number[] = [];

      // Day 0: everyone gets it
      if (!sentSteps.has(0)) stepsToSend.push(0);
      // Day 1: registered 1+ days ago
      if (daysSinceRegistration >= 1 && !sentSteps.has(1)) stepsToSend.push(1);
      // Day 3: registered 3+ days ago
      if (daysSinceRegistration >= 3 && !sentSteps.has(3)) stepsToSend.push(3);
      // Day 4: registered 4+ days ago
      if (daysSinceRegistration >= 4 && !sentSteps.has(4)) stepsToSend.push(4);

      for (const step of stepsToSend) {
        try {
          if (step === 0) {
            await sendDay0FunnelEmail(user.id, user.email, user.name);
            results.day_0.sent++;
          } else {
            const success = await sendFunnelEmail(user.id, user.email, user.name, step);
            if (success) {
              results[`day_${step}`].sent++;
            } else {
              results[`day_${step}`].skipped++;
            }
          }
          // Small delay between emails to avoid SMTP rate limits
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch {
          results[`day_${step}`].errors++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      totalUsers: trialUsers.length,
      results,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Backfill funnel email error:', error);
    return NextResponse.json({ error: 'Backfill failed' }, { status: 500 });
  }
}
