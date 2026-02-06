// Subscription tiers and limits configuration

export type SubscriptionTier = 'FREE' | 'ESSENTIAL' | 'PREMIUM';

export type CreditAction = 'dream' | 'interpretation' | 'transcription' | 'export';

export interface TierLimits {
  dreams: number;           // per month
  interpretations: number;  // per month
  transcriptions: number;   // per month
  exports: number;          // per month
  features: {
    calendar: boolean;
    basicStats: boolean;
    advancedStats: boolean;
    notifications: boolean;
    themes: boolean;
    symbolDictionary: boolean;
    patternAnalysis: boolean;
    prioritySupport: boolean;
    cloudBackup: boolean;
  };
}

export interface TierInfo {
  name: string;
  displayName: string;
  description: string;
  monthlyPrice: number;     // in cents
  yearlyPrice: number;      // in cents
  yearlyDiscount: number;   // percentage
  limits: TierLimits;
  features: string[];
  highlighted?: boolean;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
}

// Limits configuration by tier
export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  FREE: {
    dreams: 5,
    interpretations: 2,
    transcriptions: 0,
    exports: 0,
    features: {
      calendar: true,
      basicStats: true,
      advancedStats: false,
      notifications: false,
      themes: false,
      symbolDictionary: false,
      patternAnalysis: false,
      prioritySupport: false,
      cloudBackup: false,
    },
  },
  ESSENTIAL: {
    dreams: -1, // unlimited
    interpretations: 15,
    transcriptions: 10,
    exports: 5,
    features: {
      calendar: true,
      basicStats: true,
      advancedStats: true,
      notifications: true,
      themes: false,
      symbolDictionary: false,
      patternAnalysis: false,
      prioritySupport: false,
      cloudBackup: false,
    },
  },
  PREMIUM: {
    dreams: -1, // unlimited
    interpretations: -1, // unlimited
    transcriptions: -1, // unlimited
    exports: -1, // unlimited
    features: {
      calendar: true,
      basicStats: true,
      advancedStats: true,
      notifications: true,
      themes: true,
      symbolDictionary: true,
      patternAnalysis: true,
      prioritySupport: true,
      cloudBackup: true,
    },
  },
};

// Tier information for display
export const TIERS: Record<SubscriptionTier, TierInfo> = {
  FREE: {
    name: 'FREE',
    displayName: 'Rêveur',
    description: 'Parfait pour découvrir DreamOracle',
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyDiscount: 0,
    limits: TIER_LIMITS.FREE,
    features: [
      '5 rêves par mois',
      '2 interprétations IA par mois',
      'Calendrier des rêves',
      'Statistiques de base (streak)',
    ],
  },
  ESSENTIAL: {
    name: 'ESSENTIAL',
    displayName: 'Explorateur',
    description: 'Pour les explorateurs de rêves réguliers',
    monthlyPrice: 499, // 4.99€
    yearlyPrice: 3999, // 39.99€ (33% discount)
    yearlyDiscount: 33,
    limits: TIER_LIMITS.ESSENTIAL,
    highlighted: true,
    features: [
      'Rêves illimités',
      '15 interprétations IA par mois',
      '10 transcriptions vocales par mois',
      'Statistiques complètes',
      'Notifications de rappel',
      '5 exports PDF par mois',
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_ESSENTIAL_MONTHLY,
    stripePriceIdYearly: process.env.STRIPE_PRICE_ESSENTIAL_YEARLY,
  },
  PREMIUM: {
    name: 'PREMIUM',
    displayName: 'Oracle',
    description: 'L\'expérience ultime d\'exploration onirique',
    monthlyPrice: 999, // 9.99€
    yearlyPrice: 7999, // 79.99€ (33% discount)
    yearlyDiscount: 33,
    limits: TIER_LIMITS.PREMIUM,
    features: [
      'Tout de Explorateur',
      'Interprétations illimitées',
      'Transcriptions illimitées',
      'Exports PDF illimités',
      'Analyse des patterns récurrents',
      'Dictionnaire de symboles personnel',
      'Thèmes personnalisés',
      'Sauvegarde cloud',
      'Support prioritaire',
      'Accès anticipé aux nouveautés',
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
    stripePriceIdYearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY,
  },
};

// Helper to format price
export function formatPrice(cents: number): string {
  if (cents === 0) return 'Gratuit';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

// Helper to get tier display name
export function getTierDisplayName(tier: SubscriptionTier): string {
  return TIERS[tier].displayName;
}

// Check if a feature is available for a tier
export function hasFeature(tier: SubscriptionTier, feature: keyof TierLimits['features']): boolean {
  return TIER_LIMITS[tier].features[feature];
}

// Get limit for an action
export function getLimit(tier: SubscriptionTier, action: CreditAction): number {
  const actionMap: Record<CreditAction, keyof Omit<TierLimits, 'features'>> = {
    dream: 'dreams',
    interpretation: 'interpretations',
    transcription: 'transcriptions',
    export: 'exports',
  };
  return TIER_LIMITS[tier][actionMap[action]];
}

// Check if limit is unlimited (-1)
export function isUnlimited(tier: SubscriptionTier, action: CreditAction): boolean {
  return getLimit(tier, action) === -1;
}

// Action display names (French)
export const ACTION_NAMES: Record<CreditAction, string> = {
  dream: 'rêve',
  interpretation: 'interprétation',
  transcription: 'transcription',
  export: 'export',
};

// Get upgrade recommendation based on action
export function getUpgradeRecommendation(
  currentTier: SubscriptionTier,
  action: CreditAction
): SubscriptionTier | null {
  if (currentTier === 'PREMIUM') return null;

  const essentialLimit = getLimit('ESSENTIAL', action);
  const premiumLimit = getLimit('PREMIUM', action);

  if (currentTier === 'FREE') {
    // If ESSENTIAL has this feature (limit > 0 or unlimited)
    if (essentialLimit !== 0) return 'ESSENTIAL';
    return 'PREMIUM';
  }

  // currentTier is ESSENTIAL
  if (essentialLimit !== -1 && premiumLimit === -1) {
    return 'PREMIUM';
  }

  return null;
}
