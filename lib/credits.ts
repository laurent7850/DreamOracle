import { prisma } from './db';
import {
  SubscriptionTier,
  CreditAction,
  getLimit,
  isUnlimited,
  ACTION_NAMES,
  getUpgradeRecommendation,
  getTierDisplayName
} from './subscription';

export interface CreditCheckResult {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  isUnlimited: boolean;
  tier: SubscriptionTier;
  upgradeRecommendation?: SubscriptionTier;
  message?: string;
}

export interface UsageStats {
  dreams: { used: number; limit: number; remaining: number; isUnlimited: boolean };
  interpretations: { used: number; limit: number; remaining: number; isUnlimited: boolean };
  transcriptions: { used: number; limit: number; remaining: number; isUnlimited: boolean };
  exports: { used: number; limit: number; remaining: number; isUnlimited: boolean };
  resetDate: Date;
}

// Get the start of the current billing period (monthly reset)
function getBillingPeriodStart(creditsResetAt: Date): Date {
  const now = new Date();
  const resetDay = creditsResetAt.getDate();

  const periodStart = new Date(now.getFullYear(), now.getMonth(), resetDay);

  // If we haven't reached the reset day this month, use last month
  if (now < periodStart) {
    periodStart.setMonth(periodStart.getMonth() - 1);
  }

  return periodStart;
}

// Get usage count for an action in the current billing period
async function getUsageCount(
  userId: string,
  action: CreditAction,
  periodStart: Date
): Promise<number> {
  const count = await prisma.usageLog.count({
    where: {
      userId,
      action,
      createdAt: {
        gte: periodStart,
      },
    },
  });
  return count;
}

// Check if user has credits for an action
export async function checkCredits(
  userId: string,
  action: CreditAction
): Promise<CreditCheckResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
      subscriptionStatus: true,
      subscriptionEnds: true,
      creditsResetAt: true,
    },
  });

  if (!user) {
    return {
      allowed: false,
      used: 0,
      limit: 0,
      remaining: 0,
      isUnlimited: false,
      tier: 'FREE',
      message: 'Utilisateur non trouvé',
    };
  }

  // Check if subscription is active
  let effectiveTier = user.subscriptionTier as SubscriptionTier;
  if (user.subscriptionStatus !== 'active' ||
      (user.subscriptionEnds && new Date() > user.subscriptionEnds)) {
    effectiveTier = 'FREE';
  }

  const limit = getLimit(effectiveTier, action);
  const unlimited = isUnlimited(effectiveTier, action);

  // If unlimited, always allow
  if (unlimited) {
    return {
      allowed: true,
      used: 0,
      limit: -1,
      remaining: -1,
      isUnlimited: true,
      tier: effectiveTier,
    };
  }

  // If limit is 0, feature not available
  if (limit === 0) {
    const upgradeRecommendation = getUpgradeRecommendation(effectiveTier, action);
    return {
      allowed: false,
      used: 0,
      limit: 0,
      remaining: 0,
      isUnlimited: false,
      tier: effectiveTier,
      upgradeRecommendation: upgradeRecommendation || undefined,
      message: `Les ${ACTION_NAMES[action]}s ne sont pas disponibles avec votre abonnement ${getTierDisplayName(effectiveTier)}`,
    };
  }

  // Check current usage
  const periodStart = getBillingPeriodStart(user.creditsResetAt);
  const used = await getUsageCount(userId, action, periodStart);
  const remaining = limit - used;

  if (remaining <= 0) {
    const upgradeRecommendation = getUpgradeRecommendation(effectiveTier, action);
    return {
      allowed: false,
      used,
      limit,
      remaining: 0,
      isUnlimited: false,
      tier: effectiveTier,
      upgradeRecommendation: upgradeRecommendation || undefined,
      message: `Vous avez atteint votre limite de ${limit} ${ACTION_NAMES[action]}s ce mois-ci`,
    };
  }

  return {
    allowed: true,
    used,
    limit,
    remaining,
    isUnlimited: false,
    tier: effectiveTier,
  };
}

// Log usage of an action
export async function logUsage(
  userId: string,
  action: CreditAction,
  metadata?: Record<string, unknown>
): Promise<void> {
  await prisma.usageLog.create({
    data: {
      userId,
      action,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
}

// Check and log in one operation (atomic)
export async function useCredit(
  userId: string,
  action: CreditAction,
  metadata?: Record<string, unknown>
): Promise<CreditCheckResult> {
  const check = await checkCredits(userId, action);

  if (check.allowed) {
    await logUsage(userId, action, metadata);
    // Update remaining after logging
    if (!check.isUnlimited) {
      check.used += 1;
      check.remaining -= 1;
    }
  }

  return check;
}

// Get full usage stats for a user
export async function getUsageStats(userId: string): Promise<UsageStats | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
      subscriptionStatus: true,
      subscriptionEnds: true,
      creditsResetAt: true,
    },
  });

  if (!user) return null;

  // Check effective tier
  let effectiveTier = user.subscriptionTier as SubscriptionTier;
  if (user.subscriptionStatus !== 'active' ||
      (user.subscriptionEnds && new Date() > user.subscriptionEnds)) {
    effectiveTier = 'FREE';
  }

  const periodStart = getBillingPeriodStart(user.creditsResetAt);

  // Calculate next reset date
  const nextReset = new Date(periodStart);
  nextReset.setMonth(nextReset.getMonth() + 1);

  const actions: CreditAction[] = ['dream', 'interpretation', 'transcription', 'export'];

  const stats: Record<string, { used: number; limit: number; remaining: number; isUnlimited: boolean }> = {};

  for (const action of actions) {
    const limit = getLimit(effectiveTier, action);
    const unlimited = isUnlimited(effectiveTier, action);
    const used = await getUsageCount(userId, action, periodStart);

    stats[`${action}s`] = {
      used,
      limit: unlimited ? -1 : limit,
      remaining: unlimited ? -1 : Math.max(0, limit - used),
      isUnlimited: unlimited,
    };
  }

  return {
    dreams: stats.dreams,
    interpretations: stats.interpretations,
    transcriptions: stats.transcriptions,
    exports: stats.exports,
    resetDate: nextReset,
  };
}

// Reset credits for a user (called when billing period resets or subscription changes)
export async function resetCredits(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      creditsResetAt: new Date(),
    },
  });
}

// Error class for credit-related errors
export class CreditsExhaustedError extends Error {
  action: CreditAction;
  tier: SubscriptionTier;
  upgradeRecommendation?: SubscriptionTier;

  constructor(result: CreditCheckResult, action: CreditAction) {
    super(result.message || `Limite de ${ACTION_NAMES[action]}s atteinte`);
    this.name = 'CreditsExhaustedError';
    this.action = action;
    this.tier = result.tier;
    this.upgradeRecommendation = result.upgradeRecommendation;
  }
}
