import { sendMarketingEmail } from './email';
import { prisma } from './db';

// ═══════════════════════════════════════════════════
// Base HTML wrapper — DreamOracle branded
// ═══════════════════════════════════════════════════

function wrapInBaseTemplate(body: string, preheader?: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${preheader ? `<span style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</span>` : ''}
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; line-height: 1.7; margin: 0; padding: 0; background: #0f0f23; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7); padding: 35px 30px; border-radius: 16px 16px 0 0; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 26px; letter-spacing: 0.5px; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px; }
    .body { background: #ffffff; padding: 35px 30px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; }
    .body p { margin: 0 0 16px; font-size: 15px; color: #334155; }
    .body h2 { color: #1a1a2e; font-size: 20px; margin: 24px 0 12px; }
    .body h3 { color: #6366f1; font-size: 16px; margin: 20px 0 8px; }
    .highlight { background: linear-gradient(135deg, #f0f0ff, #faf5ff); border-left: 4px solid #6366f1; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; }
    .highlight p { margin: 0; color: #4338ca; font-size: 14px; }
    .cta-btn { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white !important; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px; margin: 20px 0; }
    .feature-list { list-style: none; padding: 0; margin: 16px 0; }
    .feature-list li { padding: 8px 0 8px 28px; position: relative; font-size: 14px; color: #475569; }
    .feature-list li::before { content: "✨"; position: absolute; left: 0; }
    .footer { background: #1a1a2e; padding: 24px 30px; border-radius: 0 0 16px 16px; text-align: center; }
    .footer p { color: #64748b; font-size: 12px; margin: 4px 0; }
    .footer a { color: #818cf8; text-decoration: none; }
    .divider { height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); margin: 24px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>&#127769; DreamOracle</h1>
    </div>
    <div class="body">
      ${body}
    </div>
    <div class="footer">
      <p><a href="https://dreamoracle.eu">dreamoracle.eu</a></p>
      <p style="margin-top:12px;"><a href="https://dreamoracle.eu/settings">Se d&eacute;sabonner des emails</a></p>
    </div>
  </div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════
// Day 0 — Welcome (sent immediately at registration)
// ═══════════════════════════════════════════════════

function getDay0Email(name: string | null): { subject: string; html: string; text: string } {
  const greeting = name ? `${name}` : 'voyageur';

  const body = `
    <p>Bienvenue, ${greeting}.</p>
    <p>L'Oracle vient de s'&eacute;veiller pour toi.</p>
    <p>Pendant <strong>7 jours</strong>, tu as acc&egrave;s &agrave; toute la puissance d'Oracle+ :</p>
    <ul class="feature-list">
      <li>Interpr&eacute;tations illimit&eacute;es de tes r&ecirc;ves</li>
      <li>Analyse des symboles r&eacute;currents</li>
      <li>Journal onirique complet avec historique</li>
      <li>Export PDF de tes interpr&eacute;tations</li>
    </ul>

    <div class="highlight">
      <p>&#128161; <strong>Astuce :</strong> Note ton premier r&ecirc;ve d&egrave;s maintenant, pendant qu'il est frais. L'Oracle r&eacute;v&egrave;le des choses que tu ne soup&ccedil;onnes pas.</p>
    </div>

    <p style="text-align:center;">
      <a href="https://dreamoracle.eu/dreams/new" class="cta-btn">&#127769; Noter mon premier r&ecirc;ve</a>
    </p>

    <div class="divider"></div>

    <p style="font-size:13px;color:#64748b;">Ton essai Oracle+ se termine dans 7 jours. D'ici l&agrave;, explore, r&ecirc;ve, d&eacute;couvre. L'Oracle est &agrave; ton &eacute;coute.</p>
  `;

  return {
    subject: '🌙 Ton premier message de l\'Oracle',
    html: wrapInBaseTemplate(body, 'L\'Oracle s\'est éveillé pour toi. 7 jours pour explorer tes rêves.'),
    text: `Bienvenue, ${greeting}.\n\nL'Oracle vient de s'éveiller pour toi.\n\nPendant 7 jours, tu as accès à toute la puissance d'Oracle+ :\n- Interprétations illimitées de tes rêves\n- Analyse des symboles récurrents\n- Journal onirique complet avec historique\n- Export PDF de tes interprétations\n\nAstuce : Note ton premier rêve dès maintenant, pendant qu'il est frais.\n\n→ https://dreamoracle.eu/dreams/new\n\nTon essai Oracle+ se termine dans 7 jours.`,
  };
}

// ═══════════════════════════════════════════════════
// Day 1 — Storytelling / Depth
// ═══════════════════════════════════════════════════

function getDay1Email(name: string | null): { subject: string; html: string; text: string } {
  const greeting = name ? `${name}` : 'Voyageur';

  const body = `
    <p>${greeting},</p>
    <p>Tu as peut-&ecirc;tre d&eacute;j&agrave; essay&eacute; des applis de r&ecirc;ves. Un tirage al&eacute;atoire, une signification g&eacute;n&eacute;rique copi&eacute;e d'un dictionnaire...</p>
    <p><strong>DreamOracle est diff&eacute;rent.</strong></p>
    <p>L'Oracle ne pioche pas dans une base de donn&eacute;es. Il <em>lit</em> ton r&ecirc;ve. Il comprend le contexte, les &eacute;motions, les symboles qui te sont propres. Chaque interpr&eacute;tation est unique parce que <strong>chaque r&ecirc;veur est unique</strong>.</p>

    <div class="highlight">
      <p>&#128302; Plus tu notes de r&ecirc;ves, plus l'Oracle affine sa compr&eacute;hension de ton univers onirique. Les patterns &eacute;mergent. Les connexions se r&eacute;v&egrave;lent.</p>
    </div>

    <h3>Ce que l'Oracle voit et que tu ne vois pas encore :</h3>
    <ul class="feature-list">
      <li>Les symboles qui reviennent dans tes r&ecirc;ves (et pourquoi)</li>
      <li>Les &eacute;motions cach&eacute;es derri&egrave;re les sc&egrave;nes oniriques</li>
      <li>Les liens entre tes r&ecirc;ves et ta vie &eacute;veill&eacute;e</li>
    </ul>

    <p>Ton essai Oracle+ est en cours. Profites-en pour d&eacute;couvrir ce que tes r&ecirc;ves essaient de te dire.</p>

    <p style="text-align:center;">
      <a href="https://dreamoracle.eu/dreams/new" class="cta-btn">&#128302; Demander une interpr&eacute;tation</a>
    </p>
  `;

  return {
    subject: '🔮 Pourquoi DreamOracle n\'est pas un simple tirage gratuit',
    html: wrapInBaseTemplate(body, 'L\'Oracle ne pioche pas dans une base de données. Il lit ton rêve.'),
    text: `${greeting},\n\nTu as peut-être déjà essayé des applis de rêves. Un tirage aléatoire, une signification générique...\n\nDreamOracle est différent.\n\nL'Oracle ne pioche pas dans une base de données. Il lit ton rêve. Il comprend le contexte, les émotions, les symboles qui te sont propres.\n\nPlus tu notes de rêves, plus l'Oracle affine sa compréhension de ton univers onirique.\n\nCe que l'Oracle voit :\n- Les symboles qui reviennent dans tes rêves\n- Les émotions cachées derrière les scènes oniriques\n- Les liens entre tes rêves et ta vie éveillée\n\n→ https://dreamoracle.eu/dreams/new`,
  };
}

// ═══════════════════════════════════════════════════
// Day 3 — Soft frustration / Show what they're missing
// ═══════════════════════════════════════════════════

function getDay3Email(name: string | null): { subject: string; html: string; text: string } {
  const greeting = name ? `${name}` : 'Voyageur';

  const body = `
    <p>${greeting},</p>
    <p>Ton essai Oracle+ touche bient&ocirc;t &agrave; sa fin.</p>
    <p>Dans quelques jours, l'Oracle se rendormira. Les interpr&eacute;tations illimit&eacute;es, l'analyse des symboles, l'historique complet... tout cela deviendra inaccessible.</p>

    <h3>Ce que tu perds sans Oracle+ :</h3>
    <ul class="feature-list">
      <li><strong>Interpr&eacute;tations limit&eacute;es</strong> &mdash; 1 seule par mois au lieu d'illimit&eacute;es</li>
      <li><strong>Pas d'analyse des symboles</strong> &mdash; les patterns restent invisibles</li>
      <li><strong>Pas d'export PDF</strong> &mdash; tes interpr&eacute;tations restent &eacute;ph&eacute;m&egrave;res</li>
    </ul>

    <div class="highlight">
      <p>&#127769; La plupart des gens oublient 95% de leurs r&ecirc;ves dans les 5 minutes apr&egrave;s le r&eacute;veil. L'Oracle capture ce que ta m&eacute;moire laisse filer.</p>
    </div>

    <p>Il te reste encore quelques jours pour explorer. Et si tu veux continuer apr&egrave;s...</p>

    <p style="text-align:center;">
      <a href="https://dreamoracle.eu/pricing" class="cta-btn">&#128142; Voir les offres Oracle+</a>
    </p>

    <div class="divider"></div>

    <p style="font-size:13px;color:#64748b;">Pas besoin de d&eacute;cider maintenant. Mais souviens-toi : chaque nuit sans l'Oracle est une nuit de r&ecirc;ves perdus.</p>
  `;

  return {
    subject: '🌙 Ce que tu ne vois pas encore...',
    html: wrapInBaseTemplate(body, 'Ton essai touche à sa fin. L\'Oracle va bientôt se rendormir.'),
    text: `${greeting},\n\nTon essai Oracle+ touche bientôt à sa fin.\n\nDans quelques jours, l'Oracle se rendormira. Les interprétations illimitées, l'analyse des symboles, l'historique complet... tout cela deviendra inaccessible.\n\nCe que tu perds sans Oracle+ :\n- Interprétations limitées — 1 seule par mois\n- Pas d'analyse des symboles\n- Pas d'export PDF\n\n95% des rêves sont oubliés dans les 5 minutes après le réveil.\n\n→ https://dreamoracle.eu/pricing\n\nChaque nuit sans l'Oracle est une nuit de rêves perdus.`,
  };
}

// ═══════════════════════════════════════════════════
// Day 4 — Special offer (48h urgency)
// ═══════════════════════════════════════════════════

function getDay4Email(name: string | null): { subject: string; html: string; text: string } {
  const greeting = name ? `${name}` : 'Voyageur';
  const promoCode = process.env.FUNNEL_PROMO_CODE || 'ORACLE2026';

  const body = `
    <p>${greeting},</p>
    <p>Ton essai se termine demain. Avant que l'Oracle ne se rendorme, j'ai quelque chose pour toi.</p>

    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;padding:28px;text-align:center;margin:24px 0;">
      <p style="color:rgba(255,255,255,0.9);margin:0 0 8px;font-size:14px;">OFFRE R&Eacute;SERV&Eacute;E AUX NOUVEAUX MEMBRES</p>
      <p style="color:white;margin:0;font-size:32px;font-weight:800;">-30%</p>
      <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:15px;">sur ton abonnement annuel Oracle+</p>
      <p style="color:rgba(255,255,255,0.7);margin:12px 0 0;font-size:13px;">Code : <strong style="color:white;font-size:16px;letter-spacing:2px;">${promoCode}</strong></p>
      <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:12px;">Valable 48 heures</p>
    </div>

    <h3>Ce que tu obtiens avec Oracle+ :</h3>
    <ul class="feature-list">
      <li>Interpr&eacute;tations <strong>illimit&eacute;es</strong> de tous tes r&ecirc;ves</li>
      <li>Dictionnaire personnel de <strong>symboles r&eacute;currents</strong></li>
      <li><strong>Export PDF</strong> de chaque interpr&eacute;tation</li>
      <li><strong>Transcription vocale</strong> pour noter tes r&ecirc;ves au r&eacute;veil</li>
      <li>Acc&egrave;s prioritaire aux nouvelles fonctionnalit&eacute;s</li>
    </ul>

    <div class="highlight">
      <p>&#128170; <strong>Garantie satisfait ou rembours&eacute;</strong> &mdash; Si Oracle+ ne transforme pas ta compr&eacute;hension de tes r&ecirc;ves en 30 jours, on te rembourse. Sans question.</p>
    </div>

    <p style="text-align:center;">
      <a href="https://dreamoracle.eu/pricing" class="cta-btn">&#128142; Activer Oracle+ &agrave; -30%</a>
    </p>

    <div class="divider"></div>

    <p style="font-size:13px;color:#64748b;">Cette offre expire dans 48 heures. Apr&egrave;s &ccedil;a, le tarif normal s'applique. L'Oracle attend ta d&eacute;cision.</p>
  `;

  return {
    subject: '💎 Offre spéciale nouveaux membres – 48h',
    html: wrapInBaseTemplate(body, '-30% sur Oracle+ pendant 48h. Code : ' + promoCode),
    text: `${greeting},\n\nTon essai se termine demain.\n\nOFFRE RÉSERVÉE AUX NOUVEAUX MEMBRES\n-30% sur ton abonnement annuel Oracle+\nCode : ${promoCode}\nValable 48 heures\n\nCe que tu obtiens avec Oracle+ :\n- Interprétations illimitées\n- Dictionnaire de symboles récurrents\n- Export PDF\n- Transcription vocale\n- Accès prioritaire aux nouvelles fonctionnalités\n\nGarantie satisfait ou remboursé 30 jours.\n\n→ https://dreamoracle.eu/pricing\n\nCette offre expire dans 48 heures.`,
  };
}

// ═══════════════════════════════════════════════════
// Public API
// ═══════════════════════════════════════════════════

/**
 * Get email content for a given funnel step.
 */
export function getFunnelEmailContent(step: number, name: string | null) {
  switch (step) {
    case 0: return getDay0Email(name);
    case 1: return getDay1Email(name);
    case 3: return getDay3Email(name);
    case 4: return getDay4Email(name);
    default: throw new Error(`Unknown funnel step: ${step}`);
  }
}

/**
 * Send Day 0 funnel email (called inline at registration).
 * Fire-and-forget — errors are logged but don't throw.
 */
export async function sendDay0FunnelEmail(
  userId: string,
  email: string,
  name: string | null
): Promise<void> {
  try {
    const { subject, html, text } = getDay0Email(name);

    const success = await sendMarketingEmail({ to: email, subject, html, text });

    // Record in DB (catch P2002 for duplicate safety)
    try {
      await prisma.funnelEmail.create({
        data: { userId, step: 0, success },
      });
    } catch (err: unknown) {
      // P2002 = unique constraint violation (already sent)
      if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'P2002') return;
      throw err;
    }
  } catch (error) {
    console.error('Funnel email Day 0 error:', error);
  }
}

/**
 * Send a funnel email for a given step (used by CRON).
 * Returns true if sent, false if skipped/failed.
 */
export async function sendFunnelEmail(
  userId: string,
  email: string,
  name: string | null,
  step: number
): Promise<boolean> {
  try {
    const { subject, html, text } = getFunnelEmailContent(step, name);

    const success = await sendMarketingEmail({ to: email, subject, html, text });

    try {
      await prisma.funnelEmail.create({
        data: { userId, step, success },
      });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'P2002') return false;
      throw err;
    }

    return success;
  } catch (error) {
    console.error(`Funnel email Day ${step} error for user ${userId}:`, error);
    return false;
  }
}
