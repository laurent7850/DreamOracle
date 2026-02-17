"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Crown,
  CreditCard,
  ExternalLink,
  Loader2,
  ArrowUpRight,
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SubscriptionSectionProps {
  tier: string;
  tierDisplayName: string;
  status: string;
  subscriptionEnds: string | null;
  hasStripeCustomer: boolean;
  monthlyPrice: number;
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  active: {
    label: "Actif",
    color: "text-emerald-400",
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  },
  canceled: {
    label: "Annulé",
    color: "text-red-400",
    icon: <AlertCircle className="w-4 h-4 text-red-400" />,
  },
  past_due: {
    label: "Paiement en retard",
    color: "text-amber-400",
    icon: <Clock className="w-4 h-4 text-amber-400" />,
  },
};

const TIER_COLORS: Record<string, string> = {
  FREE: "text-mystic-400",
  ESSENTIAL: "text-indigo-400",
  PREMIUM: "text-amber-400",
};

const TIER_BADGES: Record<string, string> = {
  FREE: "bg-mystic-800/50 border-mystic-600/30",
  ESSENTIAL: "bg-indigo-900/30 border-indigo-500/30",
  PREMIUM: "bg-amber-900/20 border-amber-500/30",
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

function formatPrice(cents: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function SubscriptionSection({
  tier,
  tierDisplayName,
  status,
  subscriptionEnds,
  hasStripeCustomer,
  monthlyPrice,
}: SubscriptionSectionProps) {
  const [loadingPortal, setLoadingPortal] = useState(false);
  const statusInfo = STATUS_MAP[status] || STATUS_MAP.active;
  const isFree = tier === "FREE";
  const isCanceled = status === "canceled" && subscriptionEnds;

  const handleManageSubscription = async () => {
    setLoadingPortal(true);
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur");
      }

      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Impossible d'ouvrir le portail de facturation");
    } finally {
      setLoadingPortal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${TIER_BADGES[tier] || TIER_BADGES.FREE}`}
            >
              {tier === "PREMIUM" && <Crown className="w-3.5 h-3.5 text-amber-400" />}
              <span className={TIER_COLORS[tier] || "text-mystic-400"}>
                {tierDisplayName}
              </span>
            </span>
            {!isFree && (
              <span className="flex items-center gap-1 text-sm">
                {statusInfo.icon}
                <span className={statusInfo.color}>{statusInfo.label}</span>
              </span>
            )}
          </div>

          {!isFree && (
            <p className="text-sm text-mystic-500">
              {formatPrice(monthlyPrice)}/mois
            </p>
          )}

          {isCanceled && subscriptionEnds && (
            <div className="flex items-center gap-1.5 text-sm text-amber-400 mt-1">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>
                Accès maintenu jusqu&apos;au {formatDate(subscriptionEnds)}
              </span>
            </div>
          )}

          {!isFree && !isCanceled && subscriptionEnds && (
            <div className="flex items-center gap-1.5 text-sm text-mystic-500 mt-1">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Prochain renouvellement : {formatDate(subscriptionEnds)}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {isFree ? (
            <Link href="/pricing">
              <Button
                variant="default"
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
              >
                <ArrowUpRight className="w-4 h-4" />
                Passer à un plan payant
              </Button>
            </Link>
          ) : (
            <>
              {hasStripeCustomer && (
                <Button
                  variant="outline"
                  onClick={handleManageSubscription}
                  disabled={loadingPortal}
                  className="border-mystic-600/50 text-mystic-300 hover:bg-mystic-800/50 gap-1.5"
                >
                  {loadingPortal ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4" />
                  )}
                  Gérer l&apos;abonnement
                </Button>
              )}
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="border-mystic-600/50 text-mystic-300 hover:bg-mystic-800/50 gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  Changer de plan
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* What's included */}
      {isFree && (
        <div className="rounded-lg border border-mystic-700/30 p-4 bg-mystic-900/20">
          <p className="text-sm text-mystic-400 mb-2 font-medium">
            Plan Rêveur — inclus :
          </p>
          <ul className="text-sm text-mystic-500 space-y-1">
            <li>• Journal de rêves illimité</li>
            <li>• 3 interprétations Oracle par mois</li>
            <li>• Calendrier & statistiques de base</li>
          </ul>
        </div>
      )}

      {/* Portal info */}
      {hasStripeCustomer && !isFree && (
        <p className="text-xs text-mystic-600">
          Le bouton &quot;Gérer l&apos;abonnement&quot; ouvre le portail Stripe sécurisé.
          Vous pourrez y modifier votre plan, mettre à jour votre moyen de paiement
          ou annuler votre abonnement.
        </p>
      )}

    </div>
  );
}
