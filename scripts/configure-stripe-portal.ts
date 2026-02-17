/**
 * Configure Stripe Customer Portal and business settings
 * Run with: npx tsx scripts/configure-stripe-portal.ts
 */
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY environment variable is required');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover' as Stripe.LatestApiVersion,
});

async function configurePortal() {
  console.log('🔧 Configuring Stripe Customer Portal...\n');

  // 1. List existing portal configurations
  const existingConfigs = await stripe.billingPortal.configurations.list({ limit: 10 });
  console.log(`Found ${existingConfigs.data.length} existing portal configuration(s)`);

  // 2. Create or update portal configuration with invoice history enabled
  const portalConfig: Stripe.BillingPortal.ConfigurationCreateParams = {
    business_profile: {
      headline: 'DreamOracle - Gestion de votre abonnement',
    },
    features: {
      customer_update: {
        enabled: true,
        allowed_updates: ['email', 'name'],
      },
      invoice_history: {
        enabled: true,
      },
      payment_method_update: {
        enabled: true,
      },
      subscription_cancel: {
        enabled: true,
        mode: 'at_period_end',
      },
      subscription_update: {
        enabled: false,
      },
    },
    default_return_url: 'https://dreamoracle.eu/settings',
  };

  if (existingConfigs.data.length > 0) {
    // Update existing default configuration
    const defaultConfig = existingConfigs.data.find(c => c.is_default) || existingConfigs.data[0];
    console.log(`\nUpdating existing config: ${defaultConfig.id}`);

    const updated = await stripe.billingPortal.configurations.update(defaultConfig.id, {
      business_profile: portalConfig.business_profile,
      features: portalConfig.features,
      default_return_url: portalConfig.default_return_url,
    });

    console.log(`✅ Portal configuration updated: ${updated.id}`);
    console.log(`   - Invoice history: ${updated.features.invoice_history.enabled ? '✅ Enabled' : '❌ Disabled'}`);
    console.log(`   - Customer update: ${updated.features.customer_update.enabled ? '✅ Enabled' : '❌ Disabled'}`);
    console.log(`   - Payment method update: ${updated.features.payment_method_update.enabled ? '✅ Enabled' : '❌ Disabled'}`);
    console.log(`   - Subscription cancel: ${updated.features.subscription_cancel.enabled ? '✅ Enabled' : '❌ Disabled'}`);
  } else {
    console.log('\nCreating new portal configuration...');
    const created = await stripe.billingPortal.configurations.create(portalConfig);
    console.log(`✅ Portal configuration created: ${created.id}`);
    console.log(`   - Invoice history: ${created.features.invoice_history.enabled ? '✅ Enabled' : '❌ Disabled'}`);
  }
}

async function configureAccount() {
  console.log('\n🏢 Configuring Stripe account business details...\n');

  try {
    // Update account business profile
    const account = await stripe.accounts.update('self', {
      business_profile: {
        name: "Distr'action SPRL",
        support_email: 'factures@distr-action.com',
        support_url: 'https://dreamoracle.eu/help',
        url: 'https://dreamoracle.eu',
      },
      settings: {
        invoices: {
          default_account_tax_ids: [],
        },
      },
    });

    console.log('✅ Account business profile updated:');
    console.log(`   - Name: ${account.business_profile?.name}`);
    console.log(`   - Support email: ${account.business_profile?.support_email}`);
    console.log(`   - URL: ${account.business_profile?.url}`);
  } catch (error: unknown) {
    const stripeError = error as { type?: string; message?: string };
    if (stripeError.type === 'StripeInvalidRequestError') {
      console.log('⚠️  Cannot update account details via API (may need Dashboard for some fields)');
      console.log(`   Error: ${stripeError.message}`);
    } else {
      throw error;
    }
  }

  // Add Belgian VAT tax ID to account
  try {
    // Check existing tax IDs
    const existingTaxIds = await stripe.taxIds.list({ limit: 10 });
    const hasBelgianVat = existingTaxIds.data.some(
      t => t.type === 'eu_vat' && t.value === 'BE0462122648'
    );

    if (!hasBelgianVat) {
      const taxId = await stripe.taxIds.create({
        type: 'eu_vat',
        value: 'BE0462122648',
      });
      console.log(`\n✅ Belgian VAT tax ID added: ${taxId.value} (${taxId.id})`);
    } else {
      console.log('\n✅ Belgian VAT tax ID already configured: BE0462122648');
    }
  } catch (error: unknown) {
    const stripeError = error as { message?: string };
    console.log(`⚠️  Tax ID: ${stripeError.message}`);
  }
}

async function configureInvoiceSettings() {
  console.log('\n📄 Checking invoice rendering settings...\n');

  // List recent invoices to see their status
  const invoices = await stripe.invoices.list({ limit: 5 });

  if (invoices.data.length > 0) {
    console.log('Recent invoices:');
    for (const inv of invoices.data) {
      console.log(`   - ${inv.number || inv.id}: ${inv.status} | ${inv.amount_paid / 100}€ | PDF: ${inv.invoice_pdf ? '✅' : '❌'} | Hosted page: ${inv.hosted_invoice_url ? '✅' : '❌'}`);
    }
  } else {
    console.log('No invoices found yet.');
  }
}

async function main() {
  try {
    await configurePortal();
    await configureAccount();
    await configureInvoiceSettings();
    console.log('\n🎉 All Stripe configurations complete!');
    console.log('\n📋 Manual steps still needed in Dashboard:');
    console.log('   1. Settings > Branding: Upload DreamOracle logo');
    console.log('   2. Settings > Customer emails: Enable "Successful payments" and "Finalized invoices"');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
