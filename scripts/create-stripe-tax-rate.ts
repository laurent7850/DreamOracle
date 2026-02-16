/**
 * Script to create a Stripe Tax Rate for Belgian VAT (21%)
 * Run with: npx tsx scripts/create-stripe-tax-rate.ts
 *
 * This creates an inclusive tax rate that will be applied to subscription invoices.
 * The tax rate ID should be added to env as STRIPE_TAX_RATE_BELGIUM_21
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

async function createTaxRate() {
  console.log('Creating Belgian VAT tax rate...\n');

  // Check if a Belgian 21% tax rate already exists
  const existingRates = await stripe.taxRates.list({ limit: 100 });
  const existing = existingRates.data.find(
    (rate) =>
      rate.jurisdiction === 'BE' &&
      rate.percentage === 21 &&
      rate.inclusive === true &&
      rate.active === true
  );

  if (existing) {
    console.log(`Tax rate already exists: ${existing.id}`);
    console.log(`  Display name: ${existing.display_name}`);
    console.log(`  Percentage: ${existing.percentage}%`);
    console.log(`  Inclusive: ${existing.inclusive}`);
    console.log(`  Jurisdiction: ${existing.jurisdiction}\n`);
    console.log('='.repeat(60));
    console.log('Add this to your .env file:\n');
    console.log(`STRIPE_TAX_RATE_BELGIUM_21=${existing.id}`);
    console.log('\n' + '='.repeat(60));
    return;
  }

  const taxRate = await stripe.taxRates.create({
    display_name: 'TVA',
    description: 'TVA Belgique 21%',
    jurisdiction: 'BE',
    percentage: 21,
    inclusive: true, // Prices already include TVA
    country: 'BE',
    metadata: {
      app: 'dreamoracle',
    },
  });

  console.log(`✅ Tax rate created: ${taxRate.id}`);
  console.log(`  Display name: ${taxRate.display_name}`);
  console.log(`  Description: ${taxRate.description}`);
  console.log(`  Percentage: ${taxRate.percentage}%`);
  console.log(`  Inclusive: ${taxRate.inclusive}`);
  console.log(`  Jurisdiction: ${taxRate.jurisdiction}\n`);

  console.log('='.repeat(60));
  console.log('Add this to your .env file:\n');
  console.log(`STRIPE_TAX_RATE_BELGIUM_21=${taxRate.id}`);
  console.log('\n' + '='.repeat(60));
}

createTaxRate().catch((err) => {
  console.error('Error creating tax rate:', err);
  process.exit(1);
});
