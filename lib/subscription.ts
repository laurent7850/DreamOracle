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
    advancedBiorhythm: boolean;
    monthlyReport: boolean;
    dreamCoach: boolean;
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
    dreams: -1, // unlimited journal
    interpretations: 3,
    transcriptions: 0, // transcription reserved for paid tiers
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
      advancedBiorhythm: false,
      monthlyReport: false,
      dreamCoach: false,
    },
  },
  ESSENTIAL: {
    dreams: -1, // unlimited
    interpretations: 10,
    transcriptions: -1, // unlimited for paid tiers
    exports: 10,
    features: {
      calendar: true,
      basicStats: true,
      advancedStats: true,
      notifications: true,
      themes: false,
      symbolDictionary: false,
      patternAnalysis: true,
      prioritySupport: false,
      cloudBackup: false,
      advancedBiorhythm: true,
      monthlyReport: false,
      dreamCoach: false,
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
      advancedBiorhythm: true,
      monthlyReport: true,
      dreamCoach: true,
    },
  },
};

// Tier information for display
export const TIERS: Record<SubscriptionTier, TierInfo> = {
  FREE: {
    name: 'FREE',
    displayName: 'Rêveur',
    description: 'Votre journal de rêves personnel',
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyDiscount: 0,
    limits: TIER_LIMITS.FREE,
    features: [
      'Journal de rêves illimité',
      '3 interprétations Oracle par mois',
      'Calendrier des rêves',
      'Statistiques de base',
      'Biorythme de base',
      'Tags et émotions',
    ],
  },
  ESSENTIAL: {
    name: 'ESSENTIAL',
    displayName: 'Explorateur',
    description: 'Explorez vos rêves en profondeur',
    monthlyPrice: 799, // 7.99€
    yearlyPrice: 5988, // 59.88€ (4.99€/mois - 37% discount)
    yearlyDiscount: 37,
    limits: TIER_LIMITS.ESSENTIAL,
    highlighted: true,
    features: [
      'Tout de Rêveur +',
      '10 interprétations Oracle par mois',
      '🎙️ Transcription vocale',
      'Détection des patterns récurrents',
      'Statistiques avancées',
      'Biorythme détaillé',
      'Notifications de rappel',
      'Export PDF (10/mois)',
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_ESSENTIAL_MONTHLY,
    stripePriceIdYearly: process.env.STRIPE_PRICE_ESSENTIAL_YEARLY,
  },
  PREMIUM: {
    name: 'PREMIUM',
    displayName: 'Oracle+',
    description: 'L\'expérience ultime avec Dream Coach',
    monthlyPrice: 1399, // 13.99€
    yearlyPrice: 10788, // 109.88€ (9.16€/mois - 35% discount)
    yearlyDiscount: 35,
    limits: TIER_LIMITS.PREMIUM,
    features: [
      'Tout de Explorateur +',
      'Interprétations illimitées',
      '🎙️ Transcription vocale illimitée',
      '🧠 Dream Coach personnalisé',
      'Dictionnaire de symboles personnel',
      'Rapport mensuel personnalisé',
      'Thèmes personnalisés',
      'Export PDF illimité',
      'Sauvegarde cloud',
      'Support prioritaire',
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

// Check if user has access to a feature (async - fetches user tier from DB)
export async function hasFeatureAccess(
  userId: string,
  feature: keyof TierLimits['features']
): Promise<boolean> {
  // Import prisma here to avoid circular dependencies
  const { prisma } = await import('@/lib/db');

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true },
  });

  if (!user) return false;

  const tier = user.subscriptionTier as SubscriptionTier;
  return hasFeature(tier, feature);
}
