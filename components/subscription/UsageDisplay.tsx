"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Sparkles,
  Mic,
  FileText,
  Calendar,
  TrendingUp,
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
  subscriptionStatus: string;
  subscriptionEnds: string | null;
  usage: {
    dreams: UsageStat;
    interpretations: UsageStat;
    transcriptions: UsageStat;
    exports: UsageStat;
    resetDate: string;
  };
  features: Record<string, boolean>;
}

interface UsageDisplayProps {
  variant?: "full" | "compact" | "minimal";
  showUpgradePrompt?: boolean;
}

export function UsageDisplay({
  variant = "full",
  showUpgradePrompt = true,
}: UsageDisplayProps) {
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
      <div className="animate-pulse bg-slate-800/50 rounded-lg p-4">
        <div className="h-4 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-700 rounded w-full"></div>
          <div className="h-3 bg-slate-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const usageItems = [
    {
      icon: BookOpen,
      label: "Rêves",
      stat: data.usage.dreams,
      color: "indigo",
    },
    {
      icon: Sparkles,
      label: "Interprétations",
      stat: data.usage.interpretations,
      color: "purple",
    },
    {
      icon: Mic,
      label: "Transcriptions",
      stat: data.usage.transcriptions,
      color: "blue",
    },
    {
      icon: FileText,
      label: "Exports",
      stat: data.usage.exports,
      color: "green",
    },
  ];

  const resetDate = new Date(data.usage.resetDate);
  const daysUntilReset = Math.ceil(
    (resetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const tierColors = {
    FREE: "slate",
    ESSENTIAL: "indigo",
    PREMIUM: "amber",
  };

  const tierColor = tierColors[data.tier];

  if (variant === "minimal") {
    return (
      <div className="flex items-center gap-4 text-sm">
        <span
          className={`px-2 py-1 bg-${tierColor}-500/20 text-${tierColor}-400 rounded-full text-xs font-medium`}
        >
          {data.tierInfo.displayName}
        </span>
        {data.tier !== "PREMIUM" && (
          <span className="text-slate-400">
            {data.usage.interpretations.remaining} interprétations restantes
          </span>
        )}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="bg-slate-800/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 bg-${tierColor}-500/20 text-${tierColor}-400 rounded-full text-xs font-medium`}
            >
              {data.tierInfo.displayName}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Réinitialisation dans {daysUntilReset} jours
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {usageItems.slice(0, 2).map((item) => (
            <UsageBar key={item.label} {...item} compact />
          ))}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-white">
              Votre utilisation
            </h3>
            <span
              className={`px-2 py-1 bg-${tierColor}-500/20 text-${tierColor}-400 rounded-full text-xs font-medium`}
            >
              {data.tierInfo.displayName}
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Réinitialisation dans {daysUntilReset} jours
          </p>
        </div>

        {data.tier !== "PREMIUM" && showUpgradePrompt && (
          <a
            href="/pricing"
            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <TrendingUp className="h-4 w-4" />
            Améliorer
          </a>
        )}
      </div>

      {/* Usage bars */}
      <div className="space-y-4">
        {usageItems.map((item) => (
          <UsageBar key={item.label} {...item} />
        ))}
      </div>

      {/* Subscription info */}
      {data.subscriptionEnds && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-sm text-slate-400">
            {data.subscriptionStatus === "canceled"
              ? `Abonnement se termine le ${new Date(data.subscriptionEnds).toLocaleDateString("fr-FR")}`
              : `Prochain renouvellement le ${new Date(data.subscriptionEnds).toLocaleDateString("fr-FR")}`}
          </p>
        </div>
      )}
    </div>
  );
}

interface UsageBarProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  stat: UsageStat;
  color: string;
  compact?: boolean;
}

function UsageBar({ icon: Icon, label, stat, color, compact }: UsageBarProps) {
  const percentage = stat.isUnlimited
    ? 100
    : stat.limit > 0
    ? Math.min(100, (stat.used / stat.limit) * 100)
    : 0;

  const isNearLimit = !stat.isUnlimited && stat.limit > 0 && percentage >= 80;
  const isAtLimit = !stat.isUnlimited && stat.limit > 0 && stat.remaining === 0;

  const barColor = isAtLimit
    ? "bg-red-500"
    : isNearLimit
    ? "bg-amber-500"
    : `bg-${color}-500`;

  if (compact) {
    return (
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-400">{label}</span>
          <span className="text-slate-300">
            {stat.isUnlimited ? "∞" : `${stat.used}/${stat.limit}`}
          </span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} rounded-full transition-all`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 text-${color}-400`} />
          <span className="text-sm text-slate-300">{label}</span>
        </div>
        <span className="text-sm text-slate-400">
          {stat.isUnlimited ? (
            <span className="text-green-400">Illimité</span>
          ) : stat.limit === 0 ? (
            <span className="text-slate-500">Non disponible</span>
          ) : (
            <>
              <span className={isAtLimit ? "text-red-400" : "text-white"}>
                {stat.used}
              </span>
              /{stat.limit}
            </>
          )}
        </span>
      </div>

      {stat.limit > 0 && (
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
