import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUsageStats } from '@/lib/credits';
import { prisma } from '@/lib/db';
import { TIERS, SubscriptionTier } from '@/lib/subscription';

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
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const stats = await getUsageStats(session.user.id);

    if (!stats) {
      return NextResponse.json({ error: 'Impossible de récupérer les statistiques' }, { status: 500 });
    }

    // Get effective tier
    let effectiveTier = user.subscriptionTier as SubscriptionTier;
    if (user.subscriptionStatus !== 'active' ||
        (user.subscriptionEnds && new Date() > user.subscriptionEnds)) {
      effectiveTier = 'FREE';
    }

    const tierInfo = TIERS[effectiveTier];

    return NextResponse.json({
      tier: effectiveTier,
      tierInfo: {
        name: tierInfo.name,
        displayName: tierInfo.displayName,
        description: tierInfo.description,
      },
      subscriptionStatus: user.subscriptionStatus,
      subscriptionEnds: user.subscriptionEnds,
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
