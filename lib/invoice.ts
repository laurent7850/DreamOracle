import { prisma } from '@/lib/db';
import { generateInvoicePDF } from '@/lib/invoice-pdf';
import { sendInvoiceEmail } from '@/lib/email';

/**
 * Generate the next sequential invoice number: DO-YYYY-NNNN
 */
export async function getNextInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `DO-${year}-`;

  // Find the latest invoice number for this year
  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      invoiceNumber: { startsWith: prefix },
    },
    orderBy: { invoiceNumber: 'desc' },
    select: { invoiceNumber: true },
  });

  let nextNum = 1;
  if (lastInvoice) {
    const lastNumStr = lastInvoice.invoiceNumber.replace(prefix, '');
    nextNum = parseInt(lastNumStr, 10) + 1;
  }

  return `${prefix}${String(nextNum).padStart(4, '0')}`;
}

/**
 * Calculate HT and TVA from TTC amount
 * TVA rate: 21% (Belgium)
 * TTC = HT * (1 + TVA/100)
 * HT = TTC / 1.21
 */
export function calculateTVA(amountTTC: number, tvaRate: number = 21): {
  amountHT: number;
  tvaAmount: number;
} {
  const amountHT = Math.round(amountTTC / (1 + tvaRate / 100));
  const tvaAmount = amountTTC - amountHT;
  return { amountHT, tvaAmount };
}

/**
 * Get a human-readable description for a subscription
 */
export function getInvoiceDescription(
  tierName: string,
  interval: string
): string {
  const tierDisplay: Record<string, string> = {
    ESSENTIAL: 'Explorateur',
    PREMIUM: 'Oracle+',
  };

  const intervalDisplay: Record<string, string> = {
    month: 'Mensuel',
    year: 'Annuel',
  };

  const tier = tierDisplay[tierName] || tierName;
  const period = intervalDisplay[interval] || interval;

  return `Abonnement ${tier} - ${period}`;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('fr-BE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

interface CreateInvoiceParams {
  userId: string;
  stripeInvoiceId: string;
  amountTTC: number; // in cents
  description: string;
  customerName: string | null;
  customerEmail: string;
}

/**
 * Create invoice record, generate PDF, and send emails
 */
export async function createAndSendInvoice(
  params: CreateInvoiceParams
): Promise<{ invoiceNumber: string; success: boolean }> {
  const { userId, stripeInvoiceId, amountTTC, description, customerName, customerEmail } = params;

  try {
    // Check if we already processed this Stripe invoice
    const existing = await prisma.invoice.findFirst({
      where: { stripeInvoiceId },
    });
    if (existing) {
      console.log(`Invoice already exists for Stripe invoice ${stripeInvoiceId}: ${existing.invoiceNumber}`);
      return { invoiceNumber: existing.invoiceNumber, success: true };
    }

    // Generate invoice number
    const invoiceNumber = await getNextInvoiceNumber();

    // Calculate TVA
    const { amountHT, tvaAmount } = calculateTVA(amountTTC);

    // Save to database
    const invoice = await prisma.invoice.create({
      data: {
        userId,
        invoiceNumber,
        stripeInvoiceId,
        amount: amountTTC,
        amountHT,
        tva: tvaAmount,
        tvaRate: 21.0,
        currency: 'EUR',
        description,
        customerName,
        customerEmail,
        status: 'paid',
        paidAt: new Date(),
      },
    });

    console.log(`Invoice ${invoiceNumber} created for user ${userId}`);

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF({
      invoiceNumber,
      date: invoice.paidAt,
      customerName,
      customerEmail,
      description,
      amountTTC,
      amountHT,
      tvaAmount,
      tvaRate: 21,
    });

    console.log(`PDF generated for ${invoiceNumber} (${pdfBuffer.length} bytes)`);

    // Send email with PDF to customer (+ BCC to factures@)
    const emailSent = await sendInvoiceEmail(
      customerEmail,
      customerName,
      invoiceNumber,
      description,
      formatCurrency(amountTTC),
      pdfBuffer
    );

    if (!emailSent) {
      console.error(`Failed to send invoice email for ${invoiceNumber}`);
    }

    return { invoiceNumber, success: emailSent };
  } catch (error) {
    console.error('Error creating invoice:', error);
    return { invoiceNumber: '', success: false };
  }
}
