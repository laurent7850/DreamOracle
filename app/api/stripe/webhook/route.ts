import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe, getStripe, priceIdToTier, mapStripeStatus } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/email';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log(`Stripe webhook received: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    console.error('No userId in checkout session metadata');
    return;
  }

  // Update user with Stripe IDs
  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
    },
  });

  console.log(`Checkout completed for user ${userId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    // Try to find user by customer ID
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: subscription.customer as string },
    });

    if (!user) {
      console.error('Cannot find user for subscription', subscription.id);
      return;
    }

    await updateUserSubscription(user.id, subscription);
  } else {
    await updateUserSubscription(userId, subscription);
  }
}

async function updateUserSubscription(
  userId: string,
  subscription: Stripe.Subscription
) {
  const priceId = subscription.items.data[0]?.price.id;
  const tier = priceIdToTier(priceId);
  const status = mapStripeStatus(subscription.status);

  if (!tier) {
    console.error('Unknown price ID:', priceId);
    return;
  }

  // Get subscription end date from items or cancel_at
  const currentPeriodEnd = subscription.items?.data[0]?.current_period_end;
  const subscriptionEnds = subscription.cancel_at
    ? new Date(subscription.cancel_at * 1000)
    : currentPeriodEnd
      ? new Date(currentPeriodEnd * 1000)
      : null;

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: tier,
      subscriptionStatus: status,
      subscriptionEnds,
      stripeSubscriptionId: subscription.id,
      // Reset credits on new subscription
      creditsResetAt: new Date(),
    },
  });

  console.log(`Updated subscription for user ${userId}: ${tier} (${status})`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Find user by subscription ID
  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!user) {
    console.error('Cannot find user for deleted subscription', subscription.id);
    return;
  }

  // Downgrade to free tier
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionTier: 'FREE',
      subscriptionStatus: 'canceled',
      subscriptionEnds: null,
      stripeSubscriptionId: null,
    },
  });

  console.log(`Subscription deleted for user ${user.id}, downgraded to FREE`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error('Cannot find user for failed payment', customerId);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: 'past_due',
    },
  });

  console.log(`Payment failed for user ${user.id}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    return;
  }

  // If subscription was past_due, restore to active
  if (user.subscriptionStatus === 'past_due') {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'active',
      },
    });

    console.log(`Payment succeeded, restored active status for user ${user.id}`);
  }

  // Forward Stripe invoice PDF to factures@distr-action.com
  // Skip $0 invoices (free tier) and draft/void invoices
  const amountPaid = invoice.amount_paid ?? 0;
  if (amountPaid > 0 && invoice.status === 'paid') {
    try {
      await forwardStripeInvoice(invoice, user.name, user.email);
    } catch (error) {
      console.error('Invoice forwarding error:', error);
      // Don't fail the webhook - invoice forwarding is non-critical
    }
  }
}

/**
 * Download the Stripe-generated invoice PDF and forward it to factures@distr-action.com.
 * Stripe handles the customer-facing invoice email automatically.
 * This function only sends the internal copy for accounting.
 */
async function forwardStripeInvoice(
  invoice: Stripe.Invoice,
  customerName: string | null,
  customerEmail: string
) {
  const stripeInvoiceNumber = invoice.number || invoice.id;

  // Get the invoice PDF URL from Stripe
  // The invoice_pdf field contains a direct download URL
  let pdfUrl = invoice.invoice_pdf;

  if (!pdfUrl) {
    // If not on the webhook event, fetch the full invoice object
    const fullInvoice = await getStripe().invoices.retrieve(invoice.id);
    pdfUrl = fullInvoice.invoice_pdf;
  }

  if (!pdfUrl) {
    console.error(`No PDF URL for Stripe invoice ${invoice.id}`);
    return;
  }

  // Download the PDF
  const pdfResponse = await fetch(pdfUrl);
  if (!pdfResponse.ok) {
    console.error(`Failed to download invoice PDF: ${pdfResponse.status}`);
    return;
  }

  const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
  console.log(`Downloaded Stripe invoice PDF (${pdfBuffer.length} bytes) for ${stripeInvoiceNumber}`);

  // Format the amount
  const amountFormatted = new Intl.NumberFormat('fr-BE', {
    style: 'currency',
    currency: invoice.currency?.toUpperCase() || 'EUR',
  }).format((invoice.amount_paid ?? 0) / 100);

  // Send the copy to factures@distr-action.com
  const sent = await sendEmail({
    to: 'factures@distr-action.com',
    subject: `[Copie] Facture ${stripeInvoiceNumber} - ${customerName || customerEmail} - ${amountFormatted}`,
    html: `
      <div style="font-family: sans-serif; color: #333; max-width: 600px;">
        <h2 style="color: #6366f1;">📋 Copie de facture - DreamOracle</h2>
        <p>Une facture Stripe a été générée et envoyée au client.</p>
        <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Facture N°</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">${stripeInvoiceNumber}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Client</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${customerName || '-'} (${customerEmail})</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Montant TTC</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600; color: #6366f1;">${amountFormatted}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Stripe Invoice ID</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-family: monospace; font-size: 12px;">${invoice.id}</td></tr>
        </table>
        <p style="color: #666; font-size: 13px;">La facture PDF est jointe à cet email. Le client a reçu sa copie directement via Stripe.</p>
      </div>
    `,
    text: `Copie de facture DreamOracle\n\nFacture N°: ${stripeInvoiceNumber}\nClient: ${customerName || '-'} (${customerEmail})\nMontant TTC: ${amountFormatted}\nStripe ID: ${invoice.id}`,
    attachments: [
      {
        filename: `${stripeInvoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });

  if (sent) {
    console.log(`Invoice copy sent to factures@distr-action.com for ${stripeInvoiceNumber}`);
  } else {
    console.error(`Failed to send invoice copy for ${stripeInvoiceNumber}`);
  }
}
