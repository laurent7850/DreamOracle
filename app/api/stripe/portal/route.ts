import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createPortalSession } from '@/lib/stripe';

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Get user's Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Aucun abonnement trouvé' },
        { status: 400 }
      );
    }

    // Create portal session
    const baseUrl = process.env.NEXTAUTH_URL || 'https://dreamoracle.eu';
    const portalSession = await createPortalSession(
      user.stripeCustomerId,
      `${baseUrl}/settings`
    );

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du portail de facturation' },
      { status: 500 }
    );
  }
}
