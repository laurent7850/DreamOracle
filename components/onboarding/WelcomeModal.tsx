"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sparkles, BookOpen, Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeModalProps {
  userName: string;
  hasDreams: boolean;
}

export function WelcomeModal({ userName, hasDreams }: WelcomeModalProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Only show if user has no dreams and hasn't dismissed before
    if (hasDreams) return;

    const dismissed = localStorage.getItem("onboarding-dismissed");
    if (!dismissed) {
      // Small delay for smooth entry after page load
      const timer = setTimeout(() => setIsVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, [hasDreams]);

  const dismiss = () => {
    setIsVisible(false);
    localStorage.setItem("onboarding-dismissed", "true");
  };

  const goToNewDream = () => {
    localStorage.setItem("onboarding-dismissed", "true");
    router.push("/dreams/new");
  };

  if (!isVisible) return null;

  const firstName = userName?.split(" ")[0] || "Rêveur";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-night/90 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-mystic-600/20 via-gold/20 to-mystic-600/20 rounded-2xl blur-xl" />

        <div className="relative bg-gradient-to-b from-mystic-900/95 to-night/95 border border-mystic-700/40 rounded-2xl overflow-hidden">
          {/* Decorative stars */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          {step === 0 ? (
            /* Step 1: Welcome */
            <div className="relative p-6 sm:p-8 text-center">
              {/* Moon icon */}
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gold/20 to-mystic-600/20 flex items-center justify-center mb-5 sm:mb-6 ring-1 ring-gold/30">
                <Moon className="w-8 h-8 sm:w-10 sm:h-10 text-gold" />
              </div>

              <h2 className="font-display text-2xl sm:text-3xl text-lunar mb-2">
                Bienvenue, {firstName}
              </h2>
              <p className="text-mystic-300 font-mystical text-base sm:text-lg mb-6 sm:mb-8">
                L&apos;Oracle vous attendait...
              </p>

              {/* Value props */}
              <div className="space-y-3 sm:space-y-4 text-left mb-6 sm:mb-8">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-mystic-800/30 border border-mystic-700/20">
                  <div className="p-2 rounded-lg bg-gold/10 flex-shrink-0">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-lunar text-sm sm:text-base font-medium">Journal de rêves intelligent</p>
                    <p className="text-mystic-400 text-xs sm:text-sm">Enregistrez vos rêves et découvrez leurs significations cachées</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-mystic-800/30 border border-mystic-700/20">
                  <div className="p-2 rounded-lg bg-mystic-500/10 flex-shrink-0">
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-mystic-400" />
                  </div>
                  <div>
                    <p className="text-lunar text-sm sm:text-base font-medium">Interprétation par l&apos;IA</p>
                    <p className="text-mystic-400 text-xs sm:text-sm">Chaque rêve est analysé en profondeur par notre Oracle</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-mystic-800/30 border border-mystic-700/20">
                  <div className="p-2 rounded-lg bg-indigo-500/10 flex-shrink-0">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-lunar text-sm sm:text-base font-medium">7 jours Oracle+ offerts</p>
                    <p className="text-mystic-400 text-xs sm:text-sm">Profitez de toutes les fonctionnalités premium gratuitement</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep(1)}
                className="w-full btn-mystic btn-gold py-3 text-base sm:text-lg group"
              >
                Commencer l&apos;aventure
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <button
                onClick={dismiss}
                className="mt-3 text-mystic-500 hover:text-mystic-400 text-xs sm:text-sm transition-colors"
              >
                Explorer par moi-même
              </button>
            </div>
          ) : (
            /* Step 2: First Dream CTA */
            <div className="relative p-6 sm:p-8 text-center">
              {/* Sparkles icon */}
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-mystic-500/20 to-indigo-500/20 flex items-center justify-center mb-5 sm:mb-6 ring-1 ring-mystic-500/30">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-mystic-300" />
              </div>

              <h2 className="font-display text-xl sm:text-2xl text-lunar mb-2">
                Racontez votre premier rêve
              </h2>
              <p className="text-mystic-300 text-sm sm:text-base mb-6 sm:mb-8 max-w-sm mx-auto">
                Quel rêve vous a marqué récemment ? Même un fragment suffit — l&apos;Oracle saura en extraire le sens.
              </p>

              {/* Tips */}
              <div className="bg-mystic-800/30 border border-mystic-700/20 rounded-xl p-4 mb-6 sm:mb-8 text-left">
                <p className="text-gold text-xs sm:text-sm font-medium mb-2">
                  Astuce de l&apos;Oracle
                </p>
                <ul className="space-y-1.5 text-mystic-300 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-0.5">✦</span>
                    <span>Décrivez les lieux, personnages et émotions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-0.5">✦</span>
                    <span>Même un souvenir partiel a de la valeur</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-0.5">✦</span>
                    <span>Vous pouvez aussi dicter votre rêve à voix haute</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={goToNewDream}
                className="w-full btn-mystic btn-gold py-3 text-base sm:text-lg group"
              >
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Enregistrer mon premier rêve
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <button
                onClick={dismiss}
                className="mt-3 text-mystic-500 hover:text-mystic-400 text-xs sm:text-sm transition-colors"
              >
                Plus tard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
