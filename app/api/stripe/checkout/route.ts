import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { stripe, getOrCreateStripeCustomer, createCheckoutSession, STRIPE_PRODUCTS } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { tier, billingPeriod } = body;

    // Validate tier
    if (!['ESSENTIAL', 'PREMIUM'].includes(tier)) {
      return NextResponse.json({ error: 'Tier invalide' }, { status: 400 });
    }

    // Validate billing period
    if (!['monthly', 'yearly'].includes(billingPeriod)) {
      return NextResponse.json({ error: 'Période de facturation invalide' }, { status: 400 });
    }

    // Get or create Stripe customer
    let customerId = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    }).then(user => user?.stripeCustomerId);

    if (!customerId) {
      customerId = await getOrCreateStripeCustomer(
        session.user.email,
        session.user.id,
        session.user.name || undefined
      );

      // Save customer ID to database
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Get price ID based on tier and billing period
    const product = STRIPE_PRODUCTS[tier as keyof typeof STRIPE_PRODUCTS];
    const priceId = billingPeriod === 'monthly'
      ? product.priceIdMonthly
      : product.priceIdYearly;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Configuration Stripe manquante pour ce plan' },
        { status: 500 }
      );
    }

    // Create checkout session
    const baseUrl = process.env.NEXTAUTH_URL || 'https://dreamoracle.eu';
    const checkoutSession = await createCheckoutSession(
      customerId,
      priceId,
      session.user.id,
      `${baseUrl}/settings?subscription=success`,
      `${baseUrl}/pricing?canceled=true`
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}
