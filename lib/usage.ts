import { prisma } from "@/lib/db";
import { CreditAction, getLimit, isUnlimited, SubscriptionTier } from "@/lib/subscription";

interface UsageCheckResult {
  allowed: boolean;
  limit: number;
  used: number;
  remaining: number;
}

// Get start of current billing period (beginning of current month)
function getCreditsResetDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

// Check if user has remaining credits for an action
export async function checkUsageLimit(
  userId: string,
  action: CreditAction
): Promise<UsageCheckResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
      creditsResetAt: true,
    },
  });

  if (!user) {
    return { allowed: false, limit: 0, used: 0, remaining: 0 };
  }

  const tier = user.subscriptionTier as SubscriptionTier;
  const limit = getLimit(tier, action);

  // If unlimited, always allow
  if (isUnlimited(tier, action)) {
    return { allowed: true, limit: -1, used: 0, remaining: -1 };
  }

  // If limit is 0, never allow
  if (limit === 0) {
    return { allowed: false, limit: 0, used: 0, remaining: 0 };
  }

  // Count usage since credits reset
  const resetDate = user.creditsResetAt || getCreditsResetDate();

  const used = await prisma.usageLog.count({
    where: {
      userId,
      action,
      createdAt: { gte: resetDate },
    },
  });

  const remaining = Math.max(0, limit - used);

  return {
    allowed: used < limit,
    limit,
    used,
    remaining,
  };
}

// Increment usage counter for an action
export async function incrementUsage(
  userId: string,
  action: CreditAction,
  metadata?: string
): Promise<void> {
  await prisma.usageLog.create({
    data: {
      userId,
      action,
      metadata,
    },
  });
}

// Get current usage for all actions
export async function getUserUsage(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
      creditsResetAt: true,
    },
  });

  if (!user) {
    return null;
  }

  const tier = user.subscriptionTier as SubscriptionTier;
  const resetDate = user.creditsResetAt || getCreditsResetDate();

  const actions: CreditAction[] = ["dream", "interpretation", "transcription", "export"];
  const usage: Record<CreditAction, UsageCheckResult> = {} as Record<CreditAction, UsageCheckResult>;

  for (const action of actions) {
    const limit = getLimit(tier, action);

    if (isUnlimited(tier, action)) {
      usage[action] = { allowed: true, limit: -1, used: 0, remaining: -1 };
      continue;
    }

    const used = await prisma.usageLog.count({
      where: {
        userId,
        action,
        createdAt: { gte: resetDate },
      },
    });

    const remaining = Math.max(0, limit - used);
    usage[action] = {
      allowed: used < limit || limit === -1,
      limit,
      used,
      remaining,
    };
  }

  return {
    tier,
    resetDate,
    usage,
  };
}

// Reset credits for a user (called at start of billing period)
export async function resetUserCredits(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { creditsResetAt: new Date() },
  });
}
