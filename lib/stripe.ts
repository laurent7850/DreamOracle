import Stripe from 'stripe';

// Server-side Stripe instance - lazy initialization
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    });
  }
  return _stripe;
}

// For backward compatibility
export const stripe = {
  get customers() { return getStripe().customers; },
  get checkout() { return getStripe().checkout; },
  get billingPortal() { return getStripe().billingPortal; },
  get subscriptions() { return getStripe().subscriptions; },
  get webhooks() { return getStripe().webhooks; },
};

// Product and Price IDs configuration
export const STRIPE_PRODUCTS = {
  ESSENTIAL: {
    productId: process.env.STRIPE_PRODUCT_ESSENTIAL,
    priceIdMonthly: process.env.STRIPE_PRICE_ESSENTIAL_MONTHLY,
    priceIdYearly: process.env.STRIPE_PRICE_ESSENTIAL_YEARLY,
  },
  PREMIUM: {
    productId: process.env.STRIPE_PRODUCT_PREMIUM,
    priceIdMonthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
    priceIdYearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY,
  },
};

// Get Stripe publishable key for client
export function getStripePublishableKey(): string {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
}

// Create or get Stripe customer
export async function getOrCreateStripeCustomer(
  email: string,
  userId: string,
  name?: string
): Promise<string> {
  // Check if customer already exists
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0].id;
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      userId,
    },
  });

  return customer.id;
}

// Belgian VAT tax rate (21% inclusive) - created via scripts/create-stripe-tax-rate.ts
const STRIPE_TAX_RATE_ID = process.env.STRIPE_TAX_RATE_BELGIUM_21;

// Create checkout session
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  const taxRates = STRIPE_TAX_RATE_ID ? [STRIPE_TAX_RATE_ID] : [];

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
        tax_rates: taxRates,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
      default_tax_rates: taxRates,
    },
    allow_promotion_codes: true,
  });

  return session;
}

// Create customer portal session
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

// Get subscription status
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch {
    return null;
  }
}

// Cancel subscription
export async function cancelSubscription(
  subscriptionId: string,
  immediately: boolean = false
): Promise<Stripe.Subscription> {
  if (immediately) {
    return await stripe.subscriptions.cancel(subscriptionId);
  }

  // Cancel at end of billing period
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

// Resume subscription (if canceled but not yet ended)
export async function resumeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

// Map Stripe price ID to subscription tier
export function priceIdToTier(priceId: string): 'ESSENTIAL' | 'PREMIUM' | null {
  if (
    priceId === STRIPE_PRODUCTS.ESSENTIAL.priceIdMonthly ||
    priceId === STRIPE_PRODUCTS.ESSENTIAL.priceIdYearly
  ) {
    return 'ESSENTIAL';
  }
  if (
    priceId === STRIPE_PRODUCTS.PREMIUM.priceIdMonthly ||
    priceId === STRIPE_PRODUCTS.PREMIUM.priceIdYearly
  ) {
    return 'PREMIUM';
  }
  return null;
}

// Map subscription status to our status
export function mapStripeStatus(
  stripeStatus: Stripe.Subscription.Status
): 'active' | 'canceled' | 'past_due' {
  switch (stripeStatus) {
    case 'active':
    case 'trialing':
      return 'active';
    case 'canceled':
    case 'unpaid':
    case 'incomplete_expired':
      return 'canceled';
    case 'past_due':
    case 'incomplete':
      return 'past_due';
    default:
      return 'canceled';
  }
}
