import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendFunnelEmail } from '@/lib/funnel-emails';

// POST /api/emails/ghost-reengagement — Send win-back email to ghost users (0 dreams)
// Protected by CRON_SECRET — one-time use for existing ghost users
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find all users with 0 dreams who haven't received step 5 yet
    const ghostUsers = await prisma.user.findMany({
      where: {
        dreams: { none: {} },
        funnelEmails: { none: { step: 5 } },
        // Exclude admin accounts
        role: 'user',
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    let sent = 0;
    let errors = 0;

    for (const user of ghostUsers) {
      try {
        const success = await sendFunnelEmail(user.id, user.email, user.name, 5);
        if (success) sent++;
        // 1s delay between sends to avoid SMTP rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch {
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      totalGhostUsers: ghostUsers.length,
      sent,
      errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Ghost re-engagement error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
