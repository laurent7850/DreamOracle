"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Crown,
  Zap,
} from "lucide-react";
import { SubscriptionTier, TIERS } from "@/lib/subscription";

interface UsageStat {
  used: number;
  limit: number;
  remaining: number;
  isUnlimited: boolean;
}

interface UsageData {
  tier: SubscriptionTier;
  tierInfo: {
    name: string;
    displayName: string;
    description: string;
  };
  usage: {
    dreams: UsageStat;
    interpretations: UsageStat;
    transcriptions: UsageStat;
    exports: UsageStat;
    resetDate: string;
  };
}

export function DashboardUsage() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const response = await fetch("/api/usage");
      if (response.ok) {
        const usageData = await response.json();
        setData(usageData);
      }
    } catch (error) {
      console.error("Error fetching usage:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card border-mystic-700/30 rounded-xl p-6 animate-pulse">
        <div className="h-4 bg-mystic-800 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-2 bg-mystic-800 rounded w-full"></div>
          <div className="h-2 bg-mystic-800 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const tierColors = {
    FREE: { bg: "bg-slate-500/20", text: "text-slate-400", border: "border-slate-500/30" },
    ESSENTIAL: { bg: "bg-indigo-500/20", text: "text-indigo-400", border: "border-indigo-500/30" },
    PREMIUM: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" },
  };

  const tierStyle = tierColors[data.tier];

  const resetDate = new Date(data.usage.resetDate);
  const daysUntilReset = Math.ceil(
    (resetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  // Calculate percentage for key metrics
  const interpretationPercentage = data.usage.interpretations.isUnlimited
    ? 0
    : data.usage.interpretations.limit > 0
    ? (data.usage.interpretations.used / data.usage.interpretations.limit) * 100
    : 0;

  const dreamPercentage = data.usage.dreams.isUnlimited
    ? 0
    : data.usage.dreams.limit > 0
    ? (data.usage.dreams.used / data.usage.dreams.limit) * 100
    : 0;

  const showUpgradePrompt = data.tier !== "PREMIUM" && (
    interpretationPercentage >= 70 || dreamPercentage >= 70
  );

  return (
    <div className={`glass-card rounded-xl p-6 ${showUpgradePrompt ? 'border-amber-500/30' : 'border-mystic-700/30'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 ${tierStyle.bg} ${tierStyle.text} rounded-full text-sm font-medium flex items-center gap-1.5`}>
            {data.tier === "PREMIUM" ? (
              <Crown className="w-3.5 h-3.5" />
            ) : data.tier === "ESSENTIAL" ? (
              <Sparkles className="w-3.5 h-3.5" />
            ) : null}
            {data.tierInfo.displayName}
          </span>
          <span className="text-sm text-mystic-500">
            Renouvellement dans {daysUntilReset} jours
          </span>
        </div>
      </div>

      {/* Usage bars */}
      <div className="space-y-3 mb-4">
        {/* Interpretations */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-mystic-400">Interprétations</span>
            <span className="text-mystic-300">
              {data.usage.interpretations.isUnlimited ? (
                <span className="text-green-400">Illimité</span>
              ) : (
                `${data.usage.interpretations.used}/${data.usage.interpretations.limit}`
              )}
            </span>
          </div>
          {!data.usage.interpretations.isUnlimited && data.usage.interpretations.limit > 0 && (
            <div className="h-2 bg-mystic-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  interpretationPercentage >= 90 ? 'bg-red-500' :
                  interpretationPercentage >= 70 ? 'bg-amber-500' :
                  'bg-indigo-500'
                }`}
                style={{ width: `${Math.min(100, interpretationPercentage)}%` }}
              />
            </div>
          )}
        </div>

        {/* Dreams */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-mystic-400">Rêves ce mois</span>
            <span className="text-mystic-300">
              {data.usage.dreams.isUnlimited ? (
                <span className="text-green-400">Illimité</span>
              ) : (
                `${data.usage.dreams.used}/${data.usage.dreams.limit}`
              )}
            </span>
          </div>
          {!data.usage.dreams.isUnlimited && data.usage.dreams.limit > 0 && (
            <div className="h-2 bg-mystic-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  dreamPercentage >= 90 ? 'bg-red-500' :
                  dreamPercentage >= 70 ? 'bg-amber-500' :
                  'bg-purple-500'
                }`}
                style={{ width: `${Math.min(100, dreamPercentage)}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Upgrade prompt */}
      {showUpgradePrompt && (
        <Link href="/pricing">
          <div className="mt-4 p-3 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-lg hover:border-indigo-500/50 transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-white">
                  {interpretationPercentage >= 90 || dreamPercentage >= 90
                    ? "Vous approchez de votre limite !"
                    : "Débloquez plus de fonctionnalités"}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      )}

      {/* Link to full usage */}
      {data.tier !== "FREE" && (
        <Link
          href="/settings"
          className="block mt-3 text-xs text-mystic-500 hover:text-mystic-400 text-center transition-colors"
        >
          Gérer mon abonnement →
        </Link>
      )}
    </div>
  );
}
