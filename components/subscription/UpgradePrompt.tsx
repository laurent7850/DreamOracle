"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  X,
  ArrowRight,
  Zap,
  Star,
  Crown,
} from "lucide-react";
import { SubscriptionTier, TIERS, formatPrice, ACTION_NAMES, CreditAction } from "@/lib/subscription";

interface UpgradePromptProps {
  currentTier: SubscriptionTier;
  suggestedTier: SubscriptionTier;
  action?: CreditAction;
  used?: number;
  limit?: number;
  onClose?: () => void;
  variant?: "modal" | "banner" | "inline";
}

export function UpgradePrompt({
  currentTier,
  suggestedTier,
  action,
  used,
  limit,
  onClose,
  variant = "modal",
}: UpgradePromptProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const tierInfo = TIERS[suggestedTier];
  const currentTierInfo = TIERS[currentTier];

  const handleUpgrade = () => {
    router.push(`/pricing`);
  };

  const tierIcons = {
    FREE: Star,
    ESSENTIAL: Star,
    PREMIUM: Crown,
  };

  const TierIcon = tierIcons[suggestedTier];

  if (variant === "banner") {
    return (
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-lg p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-white font-medium">
                {action
                  ? `Vous avez utilisé ${used}/${limit} ${ACTION_NAMES[action]}s ce mois`
                  : `Passez à ${tierInfo.displayName}`}
              </p>
              <p className="text-sm text-slate-400">
                Débloquez plus de fonctionnalités avec {tierInfo.displayName}
              </p>
            </div>
          </div>
          <button
            onClick={handleUpgrade}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            Voir les plans
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <Zap className="h-5 w-5 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium mb-1">
              {action
                ? `Limite de ${ACTION_NAMES[action]}s atteinte`
                : "Fonctionnalité Premium"}
            </p>
            <p className="text-sm text-slate-400 mb-3">
              {action
                ? `Vous avez utilisé vos ${limit} ${ACTION_NAMES[action]}s mensuels. Passez à ${tierInfo.displayName} pour continuer.`
                : `Cette fonctionnalité est disponible avec ${tierInfo.displayName}.`}
            </p>
            <button
              onClick={handleUpgrade}
              className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              Voir les plans <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modal variant (default)
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <TierIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Passez à {tierInfo.displayName}
              </h2>
              <p className="text-white/80">{tierInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {action && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <Zap className="h-4 w-4" />
                <span className="font-medium">Limite atteinte</span>
              </div>
              <p className="text-slate-300 text-sm">
                Vous avez utilisé vos {limit} {ACTION_NAMES[action]}s mensuels
                avec votre plan {currentTierInfo.displayName}.
              </p>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <p className="text-slate-400 text-sm">
              Avec {tierInfo.displayName}, vous obtenez :
            </p>
            <ul className="space-y-2">
              {tierInfo.features.slice(0, 5).map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-slate-300">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-white">
              {formatPrice(tierInfo.monthlyPrice)}
              <span className="text-lg text-slate-400 font-normal">/mois</span>
            </div>
            <p className="text-sm text-slate-400">
              ou {formatPrice(tierInfo.yearlyPrice)}/an (économisez{" "}
              {tierInfo.yearlyDiscount}%)
            </p>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              Voir tous les plans
              <ArrowRight className="h-4 w-4" />
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="w-full py-2 text-slate-400 hover:text-white transition-colors text-sm"
              >
                Peut-être plus tard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
