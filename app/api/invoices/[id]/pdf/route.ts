import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateInvoicePDF } from '@/lib/invoice-pdf';

/**
 * GET /api/invoices/[id]/pdf
 * Regenerate and download invoice PDF
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        userId: session.user.id, // Security: only owner can access
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Facture non trouvée' }, { status: 404 });
    }

    // Regenerate PDF
    const pdfBuffer = await generateInvoicePDF({
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.paidAt,
      customerName: invoice.customerName,
      customerEmail: invoice.customerEmail,
      description: invoice.description,
      amountTTC: invoice.amount,
      amountHT: invoice.amountHT,
      tvaAmount: invoice.tva,
      tvaRate: invoice.tvaRate,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`,
        'Content-Length': String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error('Invoice PDF error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
