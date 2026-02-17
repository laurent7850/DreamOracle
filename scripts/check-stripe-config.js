const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-01-28.clover' });

async function run() {
  // Check portal config
  const configs = await stripe.billingPortal.configurations.list({ limit: 5 });
  console.log('Portal configs:');
  for (const c of configs.data) {
    console.log('  ' + c.id + ' (default: ' + c.is_default + ') invoice_history: ' + c.features.invoice_history.enabled);
  }

  // Add Belgian VAT tax ID
  try {
    const taxIds = await stripe.taxIds.list({ limit: 10 });
    const found = taxIds.data.find(function(t) { return t.type === 'eu_vat' && t.value === 'BE0462122648'; });
    if (found) {
      console.log('\nTax ID already exists: BE0462122648 (' + found.id + ')');
    } else {
      const taxId = await stripe.taxIds.create({ type: 'eu_vat', value: 'BE0462122648' });
      console.log('\nTax ID created: ' + taxId.value + ' (' + taxId.id + ')');
    }
  } catch(e) { console.log('Tax ID error: ' + e.message); }

  // Check recent invoices
  const invoices = await stripe.invoices.list({ limit: 5 });
  console.log('\nRecent invoices:');
  for (const inv of invoices.data) {
    console.log('  ' + (inv.number || inv.id) + ': status=' + inv.status + ' amount=' + (inv.amount_paid/100) + 'EUR pdf=' + (inv.invoice_pdf ? 'YES' : 'NO') + ' hosted=' + (inv.hosted_invoice_url ? 'YES' : 'NO'));
  }
}
run().catch(function(e) { console.error(e); });
