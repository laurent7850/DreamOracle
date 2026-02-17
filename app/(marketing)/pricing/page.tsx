"use client";

import { useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Moon,
  Star,
  Crown,
  Check,
  X,
  Sparkles,
  Zap,
  ArrowRight,
  Loader2,
  Mic,
  Brain,
  Shield,
} from "lucide-react";
import { TIERS, formatPrice, SubscriptionTier } from "@/lib/subscription";

function PricingContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");

  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (tier === "FREE") {
      router.push("/register");
      return;
    }

    if (!session) {
      router.push("/login?callbackUrl=/pricing");
      return;
    }

    setLoadingTier(tier);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, billingPeriod }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Erreur lors de la création de la session de paiement");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Une erreur est survenue");
    } finally {
      setLoadingTier(null);
    }
  };

  const tierIcons = {
    FREE: Moon,
    ESSENTIAL: Star,
    PREMIUM: Crown,
  };

  const tierColors = {
    FREE: "from-slate-500 to-slate-600",
    ESSENTIAL: "from-indigo-500 to-purple-600",
    PREMIUM: "from-amber-400 to-orange-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 sm:py-6">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
            <Moon className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400" />
            <span className="text-lg sm:text-xl font-bold text-white">DreamOracle</span>
          </Link>
          {session ? (
            <Link
              href="/dashboard"
              className="text-sm sm:text-base text-slate-300 hover:text-white transition-colors"
            >
              Mon espace
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm sm:text-base text-slate-300 hover:text-white transition-colors"
            >
              Se connecter
            </Link>
          )}
        </nav>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        {/* Canceled banner */}
        {canceled && (
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8 p-3 sm:p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 text-center text-sm sm:text-base">
            Paiement annulé. Vous pouvez réessayer quand vous le souhaitez.
          </div>
        )}

        {/* Hero section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-500/10 rounded-full border border-indigo-500/30 mb-4 sm:mb-6">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-400" />
            <span className="text-indigo-300 text-xs sm:text-sm">
              Économisez 33% avec l&apos;abonnement annuel
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
            Choisissez votre{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              voyage onirique
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto px-2">
            Explorez vos rêves avec l&apos;Oracle.
            Commencez gratuitement et évoluez selon vos besoins.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-8 sm:mb-10 md:mb-12">
          <div className="bg-slate-800/50 p-1 rounded-full inline-flex">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-full transition-all ${
                billingPeriod === "monthly"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-full transition-all flex items-center gap-1.5 sm:gap-2 ${
                billingPeriod === "yearly"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Annuel
              <span className="text-[10px] sm:text-xs bg-green-500/20 text-green-400 px-1.5 sm:px-2 py-0.5 rounded-full">
                -33%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {(["FREE", "ESSENTIAL", "PREMIUM"] as SubscriptionTier[]).map(
            (tierKey) => {
              const tier = TIERS[tierKey];
              const Icon = tierIcons[tierKey];
              const isPopular = tier.highlighted;
              const price =
                billingPeriod === "yearly" ? tier.yearlyPrice : tier.monthlyPrice;
              const monthlyEquivalent =
                billingPeriod === "yearly" && tier.yearlyPrice > 0
                  ? Math.round(tier.yearlyPrice / 12)
                  : tier.monthlyPrice;

              return (
                <div
                  key={tierKey}
                  className={`relative rounded-2xl ${
                    isPopular
                      ? "bg-gradient-to-b from-indigo-600/20 to-purple-600/20 border-2 border-indigo-500"
                      : "bg-slate-800/50 border border-slate-700"
                  } p-8 flex flex-col`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium px-4 py-1 rounded-full flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Le plus populaire
                      </div>
                    </div>
                  )}

                  {tierKey === "PREMIUM" && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium px-4 py-1 rounded-full flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        Expérience complète
                      </div>
                    </div>
                  )}

                  {/* Tier icon and name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${tierColors[tierKey]}`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {tier.displayName}
                      </h3>
                      <p className="text-sm text-slate-400">{tier.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    {price === 0 ? (
                      <div className="text-4xl font-bold text-white">Gratuit</div>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-white">
                            {formatPrice(monthlyEquivalent)}
                          </span>
                          <span className="text-slate-400">/mois</span>
                        </div>
                        {billingPeriod === "yearly" && (
                          <p className="text-sm text-slate-400 mt-1">
                            Facturé {formatPrice(price)}/an
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-grow">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Trial badge for Essential */}
                  {tierKey === "ESSENTIAL" && (
                    <div className="mb-4 text-center">
                      <span className="inline-flex items-center gap-1.5 text-xs text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full">
                        <Shield className="h-3 w-3" />
                        7 jours d&apos;essai gratuit
                      </span>
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(tierKey)}
                    disabled={loadingTier === tierKey}
                    className={`w-full py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      isPopular
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                        : tierKey === "PREMIUM"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25"
                        : "bg-slate-700 hover:bg-slate-600 text-white"
                    }`}
                  >
                    {loadingTier === tierKey ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        {tierKey === "FREE" && "Commencer gratuitement"}
                        {tierKey === "ESSENTIAL" && "Essayer 7 jours gratuit"}
                        {tierKey === "PREMIUM" && "Débloquer l'Oracle"}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              );
            }
          )}
        </div>

        {/* Voice transcription highlight */}
        <div className="mt-12 sm:mt-16 md:mt-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Mic className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  🎙️ Dictez vos rêves au réveil
                </h3>
                <p className="text-slate-300 text-sm sm:text-base mb-3">
                  Capturez vos rêves instantanément avec la transcription vocale.
                  Plus besoin de taper — parlez et DreamOracle transcrit automatiquement.
                </p>
                <p className="text-indigo-300 text-sm">
                  Disponible dès le plan Explorateur
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature comparison */}
        <div className="mt-12 sm:mt-16 md:mt-20 max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-6 sm:mb-8">
            Comparaison détaillée
          </h2>

          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[500px] sm:min-w-0">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 sm:py-4 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm md:text-base">
                    Fonctionnalité
                  </th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm md:text-base">
                    Rêveur
                  </th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 text-indigo-400 font-medium text-xs sm:text-sm md:text-base">
                    Explorateur
                  </th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 text-amber-400 font-medium text-xs sm:text-sm md:text-base">
                    Oracle+
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm md:text-base">
                {/* Journal illimité */}
                <tr className="border-b border-slate-800">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-slate-300">Journal illimité</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto" />
                  </td>
                </tr>
                {/* Interprétations */}
                <tr className="border-b border-slate-800">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-slate-300">Interprétations</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-slate-400">3/mois</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-white">10/mois</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-white">Sans limite</td>
                </tr>
                {/* Transcription vocale */}
                <tr className="border-b border-slate-800 bg-indigo-500/5">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-slate-300 flex items-center gap-2">
                    <Mic className="h-4 w-4 text-indigo-400" />
                    Transcription vocale
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto" />
                  </td>
                </tr>
                {/* Stats avancées */}
                <tr className="border-b border-slate-800">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-slate-300">Stats avancées</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto" />
                  </td>
                </tr>
                {/* Patterns récurrents */}
                <tr className="border-b border-slate-800">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-slate-300">Patterns récurrents</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto" />
                  </td>
                </tr>
                {/* Biorythme de base */}
                <tr className="border-b border-slate-800">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-slate-300">Biorythme de base</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto" />
                  </td>
                </tr>
                {/* Biorythme détaillé */}
                <tr className="border-b border-slate-800">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-slate-300">Biorythme détaillé</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto" />
                  </td>
                </tr>
                {/* Dream Coach */}
                <tr className="border-b border-slate-800 bg-amber-500/5">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-slate-300 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-amber-400" />
                    Dream Coach
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto" />
                  </td>
                </tr>
                {/* Dictionnaire perso */}
                <tr className="border-b border-slate-800">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-slate-300">Dictionnaire perso</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto" />
                  </td>
                </tr>
                {/* Rapport mensuel */}
                <tr className="border-b border-slate-800">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-slate-300">Rapport mensuel</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 sm:mt-16 md:mt-20 max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-6 sm:mb-8">
            Questions fréquentes
          </h2>

          <div className="space-y-3 sm:space-y-4">
            <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <h3 className="text-sm sm:text-lg font-medium text-white mb-1.5 sm:mb-2">
                Comment fonctionne l&apos;essai gratuit de 7 jours ?
              </h3>
              <p className="text-slate-400 text-xs sm:text-base">
                En choisissant le plan Explorateur, vous bénéficiez de 7 jours d&apos;essai
                complet sans engagement. Vous ne serez facturé qu&apos;à la fin de la période
                d&apos;essai si vous décidez de continuer. Annulez à tout moment avant la fin
                des 7 jours et vous ne paierez rien.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <h3 className="text-sm sm:text-lg font-medium text-white mb-1.5 sm:mb-2">
                Comment fonctionne la transcription vocale ?
              </h3>
              <p className="text-slate-400 text-xs sm:text-base">
                La transcription vocale vous permet de dicter vos rêves au réveil.
                Appuyez sur le bouton micro, parlez naturellement, et DreamOracle
                convertit votre voix en texte automatiquement. Idéal pour capturer
                vos rêves avant qu&apos;ils ne s&apos;effacent !
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <h3 className="text-sm sm:text-lg font-medium text-white mb-1.5 sm:mb-2">
                Qu&apos;est-ce que le Dream Coach ?
              </h3>
              <p className="text-slate-400 text-xs sm:text-base">
                Le Dream Coach est votre guide personnel dans l&apos;exploration de vos rêves.
                Exclusif au plan Oracle+, il analyse l&apos;ensemble de votre journal pour
                identifier des patterns, des thèmes récurrents et vous offre des
                conseils personnalisés pour mieux comprendre votre monde onirique.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <h3 className="text-sm sm:text-lg font-medium text-white mb-1.5 sm:mb-2">
                Puis-je changer de plan à tout moment ?
              </h3>
              <p className="text-slate-400 text-xs sm:text-base">
                Oui, vous pouvez upgrader ou downgrader votre abonnement à tout
                moment. Les changements prennent effet immédiatement pour les
                upgrades, et à la fin de la période de facturation pour les
                downgrades.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <h3 className="text-sm sm:text-lg font-medium text-white mb-1.5 sm:mb-2">
                Que se passe-t-il si j&apos;atteins ma limite mensuelle ?
              </h3>
              <p className="text-slate-400 text-xs sm:text-base">
                Vous recevrez une notification et pourrez choisir de mettre à
                niveau votre plan ou d&apos;attendre le renouvellement mensuel de vos
                crédits. Vos rêves enregistrés restent toujours accessibles.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <h3 className="text-sm sm:text-lg font-medium text-white mb-1.5 sm:mb-2">
                Y a-t-il un engagement ?
              </h3>
              <p className="text-slate-400 text-xs sm:text-base">
                Non, aucun engagement ! Vous pouvez annuler votre abonnement à tout moment.
                Avec l&apos;abonnement annuel, vous bénéficiez d&apos;une réduction importante
                mais restez libre d&apos;annuler quand vous le souhaitez.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <h3 className="text-sm sm:text-lg font-medium text-white mb-1.5 sm:mb-2">
                Mes données sont-elles sécurisées ?
              </h3>
              <p className="text-slate-400 text-xs sm:text-base">
                Absolument. Vos rêves sont privés et sécurisés. Nous ne partageons
                jamais vos données avec des tiers et vous pouvez les exporter ou
                les supprimer à tout moment. Vos rêves vous appartiennent.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 sm:py-8 mt-8 sm:mt-12 border-t border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />
            <span className="text-slate-400 text-xs sm:text-sm">
              © {new Date().getFullYear()} DreamOracle
            </span>
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              CGU
            </Link>
            <Link href="/cgv" className="hover:text-white transition-colors">
              CGV
            </Link>
            <Link href="/mentions-legales" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Wrapper with Suspense for searchParams
export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}
