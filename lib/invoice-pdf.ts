import PDFDocument from 'pdfkit';

interface InvoiceData {
  invoiceNumber: string;
  date: Date;
  customerName: string | null;
  customerEmail: string;
  description: string;
  amountTTC: number;   // in cents
  amountHT: number;    // in cents
  tvaAmount: number;   // in cents
  tvaRate: number;     // percentage (21)
}

// Company info
const COMPANY = {
  name: "Distr'action SPRL",
  address: 'Chaussée Brunehault 27',
  city: '7041 Givry (B)',
  tva: 'BE0462122648',
  email: 'divers@distr-action.com',
  website: 'dreamoracle.eu',
};

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('fr-BE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-BE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Generate a professional PDF invoice as a Buffer
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: `Facture ${data.invoiceNumber}`,
          Author: COMPANY.name,
          Subject: `Facture ${data.invoiceNumber} - DreamOracle`,
        },
      });

      const chunks: Uint8Array[] = [];
      doc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width - 100; // 50 margin each side

      // ===== HEADER =====
      // Purple gradient bar
      doc.rect(0, 0, doc.page.width, 8).fill('#6366f1');

      // Company name (top left)
      doc.fontSize(22).fillColor('#1a1a2e').font('Helvetica-Bold');
      doc.text('DreamOracle', 50, 30);

      doc.fontSize(9).fillColor('#64748b').font('Helvetica');
      doc.text(COMPANY.name, 50, 55);
      doc.text(COMPANY.address, 50, 67);
      doc.text(COMPANY.city, 50, 79);
      doc.text(`TVA : ${COMPANY.tva}`, 50, 91);
      doc.text(COMPANY.email, 50, 103);

      // FACTURE label (top right)
      doc.fontSize(28).fillColor('#6366f1').font('Helvetica-Bold');
      doc.text('FACTURE', 350, 30, { width: 195, align: 'right' });

      doc.fontSize(11).fillColor('#1a1a2e').font('Helvetica');
      doc.text(`N° ${data.invoiceNumber}`, 350, 65, { width: 195, align: 'right' });
      doc.text(`Date : ${formatDate(data.date)}`, 350, 82, { width: 195, align: 'right' });

      // ===== SEPARATOR =====
      doc.moveTo(50, 130).lineTo(545, 130).strokeColor('#e2e8f0').lineWidth(1).stroke();

      // ===== CLIENT INFO =====
      doc.fontSize(10).fillColor('#6366f1').font('Helvetica-Bold');
      doc.text('FACTURÉ À', 50, 150);

      doc.fontSize(11).fillColor('#1a1a2e').font('Helvetica-Bold');
      doc.text(data.customerName || data.customerEmail, 50, 168);

      doc.fontSize(10).fillColor('#64748b').font('Helvetica');
      if (data.customerName) {
        doc.text(data.customerEmail, 50, 184);
      }

      // ===== TABLE HEADER =====
      const tableTop = 230;
      const tableLeft = 50;
      const colWidths = {
        description: 280,
        quantity: 60,
        unitPrice: 80,
        total: 75,
      };

      // Header row background
      doc.rect(tableLeft, tableTop, pageWidth, 30).fill('#f1f5f9');

      doc.fontSize(9).fillColor('#475569').font('Helvetica-Bold');
      doc.text('DESCRIPTION', tableLeft + 10, tableTop + 10, { width: colWidths.description });
      doc.text('QTÉ', tableLeft + colWidths.description + 10, tableTop + 10, { width: colWidths.quantity, align: 'center' });
      doc.text('PRIX UNIT. HT', tableLeft + colWidths.description + colWidths.quantity + 5, tableTop + 10, { width: colWidths.unitPrice, align: 'right' });
      doc.text('TOTAL HT', tableLeft + colWidths.description + colWidths.quantity + colWidths.unitPrice + 10, tableTop + 10, { width: colWidths.total, align: 'right' });

      // ===== TABLE ROW =====
      const rowTop = tableTop + 35;

      doc.fontSize(10).fillColor('#1a1a2e').font('Helvetica');
      doc.text(data.description, tableLeft + 10, rowTop + 8, { width: colWidths.description });
      doc.text('1', tableLeft + colWidths.description + 10, rowTop + 8, { width: colWidths.quantity, align: 'center' });
      doc.text(formatCurrency(data.amountHT), tableLeft + colWidths.description + colWidths.quantity + 5, rowTop + 8, { width: colWidths.unitPrice, align: 'right' });
      doc.text(formatCurrency(data.amountHT), tableLeft + colWidths.description + colWidths.quantity + colWidths.unitPrice + 10, rowTop + 8, { width: colWidths.total, align: 'right' });

      // Row separator
      doc.moveTo(tableLeft, rowTop + 30).lineTo(tableLeft + pageWidth, rowTop + 30).strokeColor('#e2e8f0').lineWidth(0.5).stroke();

      // ===== TOTALS =====
      const totalsTop = rowTop + 50;
      const totalsLeft = 330;
      const totalsWidth = 215;

      // Sous-total HT
      doc.fontSize(10).fillColor('#64748b').font('Helvetica');
      doc.text('Sous-total HT', totalsLeft, totalsTop, { width: 120 });
      doc.text(formatCurrency(data.amountHT), totalsLeft + 120, totalsTop, { width: 95, align: 'right' });

      // TVA
      doc.text(`TVA (${data.tvaRate}%)`, totalsLeft, totalsTop + 22, { width: 120 });
      doc.text(formatCurrency(data.tvaAmount), totalsLeft + 120, totalsTop + 22, { width: 95, align: 'right' });

      // Total separator
      doc.moveTo(totalsLeft, totalsTop + 48).lineTo(totalsLeft + totalsWidth, totalsTop + 48).strokeColor('#6366f1').lineWidth(1.5).stroke();

      // Total TTC
      doc.fontSize(13).fillColor('#1a1a2e').font('Helvetica-Bold');
      doc.text('Total TTC', totalsLeft, totalsTop + 58, { width: 120 });
      doc.fontSize(13).fillColor('#6366f1');
      doc.text(formatCurrency(data.amountTTC), totalsLeft + 120, totalsTop + 58, { width: 95, align: 'right' });

      // ===== PAYMENT INFO =====
      const paymentTop = totalsTop + 110;

      doc.rect(50, paymentTop, pageWidth, 45).fill('#f0fdf4');
      doc.fontSize(10).fillColor('#16a34a').font('Helvetica-Bold');
      doc.text('✓ PAYÉE', 65, paymentTop + 10);
      doc.fontSize(9).fillColor('#15803d').font('Helvetica');
      doc.text(`Paiement reçu le ${formatDate(data.date)} par carte bancaire via Stripe`, 65, paymentTop + 27);

      // ===== FOOTER =====
      const footerTop = doc.page.height - 80;

      doc.moveTo(50, footerTop).lineTo(545, footerTop).strokeColor('#e2e8f0').lineWidth(0.5).stroke();

      doc.fontSize(8).fillColor('#94a3b8').font('Helvetica');
      doc.text(
        `${COMPANY.name} • ${COMPANY.address}, ${COMPANY.city} • TVA : ${COMPANY.tva}`,
        50, footerTop + 10,
        { width: pageWidth, align: 'center' }
      );
      doc.text(
        `${COMPANY.email} • ${COMPANY.website}`,
        50, footerTop + 22,
        { width: pageWidth, align: 'center' }
      );
      doc.text(
        'Facture générée automatiquement - DreamOracle',
        50, footerTop + 38,
        { width: pageWidth, align: 'center' }
      );

      // Finalize
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
