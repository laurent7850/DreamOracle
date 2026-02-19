import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUsageStats } from '@/lib/credits';
import { prisma } from '@/lib/db';
import { TIERS, SubscriptionTier, getEffectiveTier } from '@/lib/subscription';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
        subscriptionEnds: true,
        trialEndsAt: true,
        stripeSubscriptionId: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const stats = await getUsageStats(session.user.id);

    if (!stats) {
      return NextResponse.json({ error: 'Impossible de récupérer les statistiques' }, { status: 500 });
    }

    // Get effective tier (handles trial expiration)
    const effectiveTier = getEffectiveTier(user);

    const tierInfo = TIERS[effectiveTier];

    // Trial info
    const isTrialing = !!(
      user.trialEndsAt &&
      new Date(user.trialEndsAt) > new Date() &&
      !user.stripeSubscriptionId
    );

    return NextResponse.json({
      tier: effectiveTier,
      tierInfo: {
        name: tierInfo.name,
        displayName: tierInfo.displayName,
        description: tierInfo.description,
      },
      subscriptionStatus: user.subscriptionStatus,
      subscriptionEnds: user.subscriptionEnds,
      isTrialing,
      trialEndsAt: isTrialing ? user.trialEndsAt : null,
      usage: stats,
      features: tierInfo.limits.features,
    });
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
