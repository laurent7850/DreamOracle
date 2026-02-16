/**
 * Script to create Stripe products and prices for DreamOracle
 * Run with: npx tsx scripts/create-stripe-products.ts
 *
 * Products:
 * - Essential (Explorateur): 7.99€/month, 59.88€/year
 * - Premium (Oracle+): 13.99€/month, 109.88€/year
 *
 * All prices include 21% Belgian TVA
 */

import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY environment variable is required');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
});

async function createProducts() {
  console.log('Creating DreamOracle Stripe products...\n');

  // 1. Create Essential product
  const essentialProduct = await stripe.products.create({
    name: 'DreamOracle Explorateur',
    description: 'Explorez vos rêves en profondeur - 30 interprétations/mois, transcription vocale, statistiques avancées',
    metadata: {
      tier: 'ESSENTIAL',
      app: 'dreamoracle',
    },
  });
  console.log(`✅ Essential product created: ${essentialProduct.id}`);

  // Essential monthly price: 7.99€
  const essentialMonthly = await stripe.prices.create({
    product: essentialProduct.id,
    unit_amount: 799,
    currency: 'eur',
    recurring: { interval: 'month' },
    tax_behavior: 'inclusive', // TVA included in price
    metadata: { tier: 'ESSENTIAL', period: 'monthly' },
  });
  console.log(`  Monthly: ${essentialMonthly.id} (7.99€/mois)`);

  // Essential yearly price: 59.88€ (4.99€/month equivalent)
  const essentialYearly = await stripe.prices.create({
    product: essentialProduct.id,
    unit_amount: 5988,
    currency: 'eur',
    recurring: { interval: 'year' },
    tax_behavior: 'inclusive',
    metadata: { tier: 'ESSENTIAL', period: 'yearly' },
  });
  console.log(`  Yearly:  ${essentialYearly.id} (59.88€/an)\n`);

  // 2. Create Premium product
  const premiumProduct = await stripe.products.create({
    name: 'DreamOracle Oracle+',
    description: 'L\'expérience ultime - Interprétations illimitées, Dream Coach, dictionnaire de symboles, sauvegarde cloud',
    metadata: {
      tier: 'PREMIUM',
      app: 'dreamoracle',
    },
  });
  console.log(`✅ Premium product created: ${premiumProduct.id}`);

  // Premium monthly price: 13.99€
  const premiumMonthly = await stripe.prices.create({
    product: premiumProduct.id,
    unit_amount: 1399,
    currency: 'eur',
    recurring: { interval: 'month' },
    tax_behavior: 'inclusive',
    metadata: { tier: 'PREMIUM', period: 'monthly' },
  });
  console.log(`  Monthly: ${premiumMonthly.id} (13.99€/mois)`);

  // Premium yearly price: 109.88€ (9.16€/month equivalent)
  const premiumYearly = await stripe.prices.create({
    product: premiumProduct.id,
    unit_amount: 10988,
    currency: 'eur',
    recurring: { interval: 'year' },
    tax_behavior: 'inclusive',
    metadata: { tier: 'PREMIUM', period: 'yearly' },
  });
  console.log(`  Yearly:  ${premiumYearly.id} (109.88€/an)\n`);

  // Output environment variables
  console.log('='.repeat(60));
  console.log('Add these to your .env file:\n');
  console.log(`STRIPE_PRODUCT_ESSENTIAL=${essentialProduct.id}`);
  console.log(`STRIPE_PRODUCT_PREMIUM=${premiumProduct.id}`);
  console.log(`STRIPE_PRICE_ESSENTIAL_MONTHLY=${essentialMonthly.id}`);
  console.log(`STRIPE_PRICE_ESSENTIAL_YEARLY=${essentialYearly.id}`);
  console.log(`STRIPE_PRICE_PREMIUM_MONTHLY=${premiumMonthly.id}`);
  console.log(`STRIPE_PRICE_PREMIUM_YEARLY=${premiumYearly.id}`);
  console.log('\n' + '='.repeat(60));
}

createProducts().catch((err) => {
  console.error('Error creating products:', err);
  process.exit(1);
});
