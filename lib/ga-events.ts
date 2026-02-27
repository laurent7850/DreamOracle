/**
 * Google Analytics 4 - Helper d'événements pour DreamOracle
 *
 * Événements trackés :
 * - page_view           → automatique (GoogleAnalytics component)
 * - sign_up             → inscription (credentials ou Google OAuth)
 * - trial_start         → début essai Oracle+ 7j
 * - purchase            → abonnement payant confirmé
 * - dream_interpretation → interprétation d'un rêve par l'Oracle
 */

type GAPlan = "ESSENTIAL" | "PREMIUM";

const PLAN_PRICES: Record<GAPlan, number> = {
  ESSENTIAL: 7.99,
  PREMIUM: 13.99,
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

// ═══════════════════════════════════════
// Wrapper générique
// ═══════════════════════════════════════
export function trackGAEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  gtag("event", eventName, params);
}

// ═══════════════════════════════════════
// Inscription gratuite
// ═══════════════════════════════════════
export function trackGARegistration(
  method: "credentials" | "google" = "credentials"
) {
  trackGAEvent("sign_up", { method });
}

// ═══════════════════════════════════════
// Début d'essai gratuit (Oracle+ 7 jours)
// ═══════════════════════════════════════
export function trackGATrialStart(plan: GAPlan) {
  trackGAEvent("trial_start", {
    content_name: plan,
    currency: "EUR",
    value: PLAN_PRICES[plan],
  });
}

// ═══════════════════════════════════════
// Abonnement payant confirmé
// ═══════════════════════════════════════
export function trackGASubscription(plan: GAPlan) {
  trackGAEvent("purchase", {
    currency: "EUR",
    value: PLAN_PRICES[plan],
    items: [{ item_name: `Oracle+ ${plan}`, price: PLAN_PRICES[plan] }],
  });
}

// ═══════════════════════════════════════
// Interprétation d'un rêve
// ═══════════════════════════════════════
export function trackGAInterpretation(
  style: "spiritual" | "psychological" | "balanced"
) {
  trackGAEvent("dream_interpretation", { style });
}
