/**
 * Meta Pixel - Helper d'événements pour DreamOracle
 *
 * Événements trackés :
 * - PageView             → automatique (MetaPixel.tsx)
 * - CompleteRegistration  → inscription gratuite
 * - StartTrial           → début essai Explorateur
 * - Subscribe            → abonnement payant
 * - ViewContent          → visite page pricing
 * - Lead                 → soumission formulaire "Tester l'Oracle" (futur)
 * - FirstInterpretation  → custom event, première interprétation
 */

type MetaPlan = 'ESSENTIAL' | 'PREMIUM';

const PLAN_PRICES: Record<MetaPlan, number> = {
  ESSENTIAL: 7.99,
  PREMIUM: 13.99,
};

const PLAN_LTV: Record<MetaPlan, number> = {
  ESSENTIAL: 47.94,
  PREMIUM: 83.94,
};

function fbq(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args);
  }
}

// ═══════════════════════════════════════
// ÉVÉNEMENT PRINCIPAL : Inscription gratuite
// ═══════════════════════════════════════
export function trackRegistration(method: 'credentials' | 'google' = 'credentials') {
  fbq('track', 'CompleteRegistration', {
    content_name: 'free_account',
    status: true,
    currency: 'EUR',
    value: 0,
    method,
  });
}

// ═══════════════════════════════════════
// Début d'essai gratuit (Explorateur 7 jours)
// ═══════════════════════════════════════
export function trackStartTrial(plan: MetaPlan) {
  fbq('track', 'StartTrial', {
    content_name: plan,
    currency: 'EUR',
    value: PLAN_PRICES[plan],
    predicted_ltv: PLAN_LTV[plan],
  });
}

// ═══════════════════════════════════════
// Abonnement payant confirmé
// ═══════════════════════════════════════
export function trackSubscription(plan: MetaPlan) {
  fbq('track', 'Subscribe', {
    content_name: plan,
    currency: 'EUR',
    value: PLAN_PRICES[plan],
  });
}

// ═══════════════════════════════════════
// Visite page pricing (intent signal)
// ═══════════════════════════════════════
export function trackViewPricing() {
  fbq('track', 'ViewContent', {
    content_name: 'pricing_page',
    content_category: 'pricing',
  });
}

// ═══════════════════════════════════════
// Lead : formulaire "Tester l'Oracle" (futur)
// ═══════════════════════════════════════
export function trackLead(source: string = 'landing_test_oracle') {
  fbq('track', 'Lead', {
    content_name: source,
  });
}

// ═══════════════════════════════════════
// Première interprétation (activation)
// ═══════════════════════════════════════
export function trackFirstInterpretation() {
  fbq('trackCustom', 'FirstInterpretation', {
    content_name: 'dream_interpretation',
  });
}
