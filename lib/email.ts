import nodemailer from 'nodemailer';

// SMTP transporter for Hostinger
let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true, // SSL on port 465
      auth: {
        user: process.env.SMTP_USER || 'factures@distr-action.com',
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return _transporter;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
  bcc?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  try {
    const transporter = getTransporter();
    const fromEmail = process.env.SMTP_USER || 'factures@distr-action.com';

    await transporter.sendMail({
      from: `"DreamOracle - Distr'action" <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      bcc: options.bcc,
      attachments: options.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType || 'application/pdf',
      })),
    });

    console.log(`Email sent to ${options.to}: ${options.subject}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Send invoice email to customer with PDF attached + BCC to factures@
 */
export async function sendInvoiceEmail(
  customerEmail: string,
  customerName: string | null,
  invoiceNumber: string,
  description: string,
  amountTTC: string,
  pdfBuffer: Buffer
): Promise<boolean> {
  const greeting = customerName ? `Bonjour ${customerName}` : 'Bonjour';

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .header p { color: rgba(255,255,255,0.8); margin: 5px 0 0; }
    .body { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
    .invoice-box { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0; }
    .invoice-box .label { color: #64748b; font-size: 13px; margin-bottom: 4px; }
    .invoice-box .value { font-size: 16px; font-weight: 600; }
    .amount { color: #6366f1; font-size: 24px; font-weight: 700; }
    .footer { background: #1a1a2e; padding: 20px 30px; border-radius: 0 0 12px 12px; color: #94a3b8; font-size: 12px; text-align: center; }
    .footer a { color: #818cf8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌙 DreamOracle</h1>
      <p>Votre facture</p>
    </div>
    <div class="body">
      <p>${greeting},</p>
      <p>Merci pour votre confiance ! Veuillez trouver ci-joint votre facture.</p>

      <div class="invoice-box">
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:15px;">
          <div>
            <div class="label">Facture N°</div>
            <div class="value">${invoiceNumber}</div>
          </div>
          <div>
            <div class="label">Description</div>
            <div class="value">${description}</div>
          </div>
          <div>
            <div class="label">Montant TTC</div>
            <div class="amount">${amountTTC}</div>
          </div>
        </div>
      </div>

      <p style="color:#64748b;font-size:13px;">
        La facture au format PDF est jointe à cet email.
        Vous pouvez également consulter vos factures dans votre espace client sur
        <a href="https://dreamoracle.eu/settings" style="color:#6366f1;">dreamoracle.eu</a>.
      </p>
    </div>
    <div class="footer">
      <p>Distr'action SPRL &bull; Chaussée Brunehault 27, 7041 Givry (B)</p>
      <p>TVA : BE0462122648 &bull; <a href="mailto:divers@distr-action.com">divers@distr-action.com</a></p>
    </div>
  </div>
</body>
</html>`;

  const text = `${greeting},

Merci pour votre confiance ! Veuillez trouver ci-joint votre facture ${invoiceNumber}.

Description : ${description}
Montant TTC : ${amountTTC}

Distr'action SPRL - Chaussée Brunehault 27, 7041 Givry (B)
TVA : BE0462122648`;

  return sendEmail({
    to: customerEmail,
    subject: `Facture ${invoiceNumber} - DreamOracle`,
    html,
    text,
    attachments: [
      {
        filename: `${invoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
    bcc: 'factures@distr-action.com',
  });
}

/**
 * Notify admin of a new user registration
 */
export async function sendNewRegistrationEmail(
  userName: string | null,
  userEmail: string,
  method: 'credentials' | 'Google OAuth'
): Promise<boolean> {
  const now = new Date().toLocaleString('fr-BE', { timeZone: 'Europe/Brussels' });

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .header p { color: rgba(255,255,255,0.8); margin: 5px 0 0; }
    .body { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
    .info-box { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
    .info-row:last-child { border-bottom: none; }
    .label { color: #64748b; font-size: 13px; }
    .value { font-weight: 600; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .badge-credentials { background: #dbeafe; color: #1d4ed8; }
    .badge-google { background: #fef3c7; color: #b45309; }
    .footer { background: #1a1a2e; padding: 20px 30px; border-radius: 0 0 12px 12px; color: #94a3b8; font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌙 DreamOracle</h1>
      <p>Nouvelle inscription</p>
    </div>
    <div class="body">
      <p>Un nouvel utilisateur vient de s'inscrire sur DreamOracle !</p>
      <div class="info-box">
        <div class="info-row">
          <span class="label">Nom</span>
          <span class="value">${userName || 'Non renseigné'}</span>
        </div>
        <div class="info-row">
          <span class="label">Email</span>
          <span class="value">${userEmail}</span>
        </div>
        <div class="info-row">
          <span class="label">Méthode</span>
          <span class="value"><span class="badge ${method === 'Google OAuth' ? 'badge-google' : 'badge-credentials'}">${method}</span></span>
        </div>
        <div class="info-row">
          <span class="label">Date</span>
          <span class="value">${now}</span>
        </div>
      </div>
      <p style="color:#64748b;font-size:13px;">
        Essai Oracle+ 7 jours activé automatiquement.
        <a href="https://dreamoracle.eu/admin" style="color:#6366f1;">Voir le CRM</a>
      </p>
    </div>
    <div class="footer">
      <p>DreamOracle Admin Notification</p>
    </div>
  </div>
</body>
</html>`;

  const text = `Nouvelle inscription DreamOracle\n\nNom: ${userName || 'Non renseigné'}\nEmail: ${userEmail}\nMéthode: ${method}\nDate: ${now}\n\nEssai Oracle+ 7 jours activé.`;

  return sendEmail({
    to: 'divers@distr-action.com',
    subject: `🌙 Nouvel inscrit : ${userName || userEmail}`,
    html,
    text,
  });
}
