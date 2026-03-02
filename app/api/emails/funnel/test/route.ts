import { NextRequest, NextResponse } from 'next/server';
import { sendMarketingEmail } from '@/lib/email';
import { getFunnelEmailContent } from '@/lib/funnel-emails';

// POST /api/emails/funnel/test — Send a test funnel email
// Protected by CRON_SECRET
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { to, step = 0, name = 'Laurent' } = await request.json();

    if (!to) {
      return NextResponse.json({ error: 'Missing "to" email address' }, { status: 400 });
    }

    const { subject, html, text } = getFunnelEmailContent(step, name);
    const success = await sendMarketingEmail({ to, subject, html, text });

    return NextResponse.json({ success, step, to, subject });
  } catch (error) {
    console.error('Test funnel email error:', error);
    return NextResponse.json({ error: 'Failed to send test email' }, { status: 500 });
  }
}
