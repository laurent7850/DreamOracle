import { sendMarketingEmail } from './email';
import { prisma } from './db';

// ═══════════════════════════════════════════════════
// Base HTML wrapper — Dark mystical theme (matches dreamoracle.eu)
// ═══════════════════════════════════════════════════

function wrapInBaseTemplate(body: string, preheader?: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${preheader ? `<span style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</span>` : ''}
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background: #0a0a1a; color: #c8cdf3; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(180deg, #13132d 0%, #1a1a3e 100%); padding: 40px 30px 30px; border-radius: 16px 16px 0 0; text-align: center; border-bottom: 1px solid rgba(139,92,246,0.2); }
    .moon { font-size: 42px; margin-bottom: 12px; display: block; }
    .brand { color: #e2e4f0; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 1px; }
    .content { background: linear-gradient(180deg, #1a1a3e 0%, #161630 50%, #13132d 100%); padding: 35px 30px; }
    .content p { margin: 0 0 16px; font-size: 15px; color: #b0b5d4; line-height: 1.7; }
    .content strong { color: #e2e4f0; }
    .content em { color: #c4b5fd; font-style: italic; }
    .content h3 { color: #c4b5fd; font-size: 16px; margin: 24px 0 12px; font-weight: 600; }
    .highlight { background: rgba(139,92,246,0.08); border-left: 3px solid #8b5cf6; padding: 16px 20px; border-radius: 0 10px 10px 0; margin: 24px 0; }
    .highlight p { margin: 0 !important; color: #c4b5fd !important; font-size: 14px; }
    .cta-wrap { text-align: center; margin: 28px 0; }
    .cta-btn { display: inline-block; background: linear-gradient(135deg, #d4a843, #c49a38); color: #1a1a2e !important; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-weight: 700; font-size: 15px; letter-spacing: 0.3px; }
    .feature-list { list-style: none; padding: 0; margin: 16px 0; }
    .feature-list li { padding: 10px 0 10px 32px; position: relative; font-size: 14px; color: #b0b5d4; border-bottom: 1px solid rgba(139,92,246,0.08); }
    .feature-list li:last-child { border-bottom: none; }
    .feature-list li::before { content: "\\2728"; position: absolute; left: 4px; top: 10px; }
    .divider { height: 1px; background: linear-gradient(to right, transparent, rgba(139,92,246,0.25), transparent); margin: 28px 0; }
    .muted { font-size: 13px !important; color: #6b6f94 !important; }
    .footer { background: #0e0e22; padding: 24px 30px; border-radius: 0 0 16px 16px; text-align: center; border-top: 1px solid rgba(139,92,246,0.1); }
    .footer p { color: #4a4e6e; font-size: 12px; margin: 4px 0; }
    .footer a { color: #8b5cf6; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <span class="moon">&#127769;</span>
      <p class="brand">DreamOracle</p>
    </div>
    <div class="content">
      ${body}
    </div>
    <div class="footer">
      <p><a href="https://dreamoracle.eu">dreamoracle.eu</a></p>
      <p style="margin-top:12px;"><a href="https://dreamoracle.eu/settings">Se d&eacute;sabonner</a></p>
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
    <p>Bienvenue, <strong>${greeting}</strong>.</p>
    <p>L'Oracle vient de s'&eacute;veiller pour toi.</p>
    <p>Pendant <strong>7 jours</strong>, tu as acc&egrave;s &agrave; toute la puissance d'Oracle+ :</p>
    <ul class="feature-list">
      <li>Interpr&eacute;tations <strong>illimit&eacute;es</strong> de tes r&ecirc;ves</li>
      <li>Analyse des <strong>symboles r&eacute;currents</strong></li>
      <li>Journal onirique complet avec historique</li>
      <li>Export PDF de tes interpr&eacute;tations</li>
    </ul>

    <div class="highlight">
      <p>&#128161; <strong>Astuce :</strong> Note ton premier r&ecirc;ve d&egrave;s maintenant, pendant qu'il est frais. L'Oracle r&eacute;v&egrave;le des choses que tu ne soup&ccedil;onnes pas.</p>
    </div>

    <div class="cta-wrap">
      <a href="https://dreamoracle.eu/dreams/new" class="cta-btn">&#127769; Noter mon premier r&ecirc;ve</a>
    </div>

    <div class="divider"></div>

    <p class="muted">Ton essai Oracle+ se termine dans 7 jours. D'ici l&agrave;, explore, r&ecirc;ve, d&eacute;couvre. L'Oracle est &agrave; ton &eacute;coute.</p>
  `;

  return {
    subject: '🌙 Ton premier message de l\'Oracle',
    html: wrapInBaseTemplate(body, 'L\'Oracle s\'est éveillé pour toi. 7 jours pour explorer tes rêves.'),
    text: `Bienvenue, ${greeting}.\n\nL'Oracle vient de s'éveiller pour toi.\n\nPendant 7 jours, tu as accès à toute la puissance d'Oracle+ :\n- Interprétations illimitées de tes rêves\n- Analyse des symboles récurrents\n- Journal onirique complet avec historique\n- Export PDF de tes interprétations\n\nAstuce : Note ton premier rêve dès maintenant, pendant qu'il est frais.\n\n→ https://dreamoracle.eu/dreams/new\n\nTon essai Oracle+ se termine dans 7 jours.`,
  };
}

// ═══════════════════════════════════════════════════
// Day 0.5 (step 2) — Ghost user nudge
// Sent ~12-24h after registration to users with 0 dreams
// ═══════════════════════════════════════════════════

function getGhostNudgeEmail(name: string | null): { subject: string; html: string; text: string } {
  const greeting = name ? `${name}` : 'Voyageur';

  const body = `
    <p>${greeting},</p>
    <p>As-tu r&ecirc;v&eacute; cette nuit ?</p>
    <p>M&ecirc;me si tu ne t'en souviens que vaguement &mdash; un lieu, une sensation, un visage &mdash; c'est <strong>suffisant</strong> pour l'Oracle.</p>

    <div class="highlight">
      <p>&#128161; <strong>Le savais-tu ?</strong> Tu oublies 95% de tes r&ecirc;ves dans les 5 premi&egrave;res minutes apr&egrave;s le r&eacute;veil. Plus tu attends, plus les d&eacute;tails s'effacent.</p>
    </div>

    <p>Il te suffit de 30 secondes pour noter l'essentiel. L'Oracle fera le reste.</p>

    <h3>Pas besoin d'un r&ecirc;ve complet :</h3>
    <ul class="feature-list">
      <li><em>&laquo; J'&eacute;tais dans une for&ecirc;t sombre... &raquo;</em></li>
      <li><em>&laquo; Je volais au-dessus de l'eau... &raquo;</em></li>
      <li><em>&laquo; Mon chat me parlait... &raquo;</em></li>
    </ul>

    <p>Un fragment de r&ecirc;ve, c'est d&eacute;j&agrave; une porte ouverte vers ton inconscient. <strong>Essaie maintenant</strong> &mdash; tu seras surpris par ce que l'Oracle y d&eacute;couvre.</p>

    <div class="cta-wrap">
      <a href="https://dreamoracle.eu/dreams/new" class="cta-btn">&#127769; Raconter mon r&ecirc;ve (30 sec)</a>
    </div>

    <div class="divider"></div>

    <p class="muted">Tu peux aussi dicter ton r&ecirc;ve &agrave; voix haute gr&acirc;ce &agrave; la transcription vocale int&eacute;gr&eacute;e. Pratique au r&eacute;veil, les yeux encore ferm&eacute;s.</p>
  `;

  return {
    subject: '🌙 As-tu rêvé cette nuit ?',
    html: wrapInBaseTemplate(body, 'Un simple fragment suffit. L\'Oracle fera le reste.'),
    text: `${greeting},\n\nAs-tu rêvé cette nuit ?\n\nMême si tu ne t'en souviens que vaguement — un lieu, une sensation, un visage — c'est suffisant pour l'Oracle.\n\nLe savais-tu ? Tu oublies 95% de tes rêves dans les 5 premières minutes après le réveil.\n\nIl te suffit de 30 secondes pour noter l'essentiel. L'Oracle fera le reste.\n\nPas besoin d'un rêve complet :\n- « J'étais dans une forêt sombre... »\n- « Je volais au-dessus de l'eau... »\n- « Mon chat me parlait... »\n\n→ https://dreamoracle.eu/dreams/new\n\nTu peux aussi dicter ton rêve à voix haute grâce à la transcription vocale intégrée.`,
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

    <div class="cta-wrap">
      <a href="https://dreamoracle.eu/dreams/new" class="cta-btn">&#128302; Demander une interpr&eacute;tation</a>
    </div>
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
      <li><strong>Interpr&eacute;tations limit&eacute;es</strong> &mdash; 3 par mois au lieu d'illimit&eacute;es</li>
      <li><strong>Pas d'analyse des symboles</strong> &mdash; les patterns restent invisibles</li>
      <li><strong>Pas d'export PDF</strong> &mdash; tes interpr&eacute;tations restent &eacute;ph&eacute;m&egrave;res</li>
    </ul>

    <div class="highlight">
      <p>&#127769; La plupart des gens oublient 95% de leurs r&ecirc;ves dans les 5 minutes apr&egrave;s le r&eacute;veil. L'Oracle capture ce que ta m&eacute;moire laisse filer.</p>
    </div>

    <p>Il te reste encore quelques jours pour explorer. Et si tu veux continuer apr&egrave;s...</p>

    <div class="cta-wrap">
      <a href="https://dreamoracle.eu/pricing" class="cta-btn">&#128142; Voir les offres Oracle+</a>
    </div>

    <div class="divider"></div>

    <p class="muted">Pas besoin de d&eacute;cider maintenant. Mais souviens-toi : chaque nuit sans l'Oracle est une nuit de r&ecirc;ves perdus.</p>
  `;

  return {
    subject: '🌙 Ce que tu ne vois pas encore...',
    html: wrapInBaseTemplate(body, 'Ton essai touche à sa fin. L\'Oracle va bientôt se rendormir.'),
    text: `${greeting},\n\nTon essai Oracle+ touche bientôt à sa fin.\n\nDans quelques jours, l'Oracle se rendormira. Les interprétations illimitées, l'analyse des symboles, l'historique complet... tout cela deviendra inaccessible.\n\nCe que tu perds sans Oracle+ :\n- Interprétations limitées — 3 par mois\n- Pas d'analyse des symboles\n- Pas d'export PDF\n\n95% des rêves sont oubliés dans les 5 minutes après le réveil.\n\n→ https://dreamoracle.eu/pricing\n\nChaque nuit sans l'Oracle est une nuit de rêves perdus.`,
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

    <div style="background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(99,102,241,0.1));border:1px solid rgba(139,92,246,0.3);border-radius:12px;padding:28px;text-align:center;margin:24px 0;">
      <p style="color:#c4b5fd;margin:0 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Offre r&eacute;serv&eacute;e aux nouveaux membres</p>
      <p style="color:#d4a843;margin:0;font-size:36px;font-weight:800;">-30%</p>
      <p style="color:#b0b5d4;margin:8px 0 0;font-size:15px;">sur ton abonnement annuel Oracle+</p>
      <div style="margin:16px 0 0;padding:12px;background:rgba(0,0,0,0.2);border-radius:8px;display:inline-block;">
        <span style="color:#6b6f94;font-size:12px;">CODE :</span>
        <span style="color:#d4a843;font-size:18px;font-weight:700;letter-spacing:3px;margin-left:8px;">${promoCode}</span>
      </div>
      <p style="color:#6b6f94;margin:12px 0 0;font-size:12px;">Valable 48 heures</p>
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

    <div class="cta-wrap">
      <a href="https://dreamoracle.eu/pricing" class="cta-btn">&#128142; Activer Oracle+ &agrave; -30%</a>
    </div>

    <div class="divider"></div>

    <p class="muted">Cette offre expire dans 48 heures. Apr&egrave;s &ccedil;a, le tarif normal s'applique. L'Oracle attend ta d&eacute;cision.</p>
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
    case 2: return getGhostNudgeEmail(name);
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
