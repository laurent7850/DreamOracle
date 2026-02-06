"use client";

import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const isInStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error - iOS Safari specific
      window.navigator.standalone === true;

    setIsStandalone(isInStandaloneMode);

    if (isInStandaloneMode) return;

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Check if we've already dismissed the prompt
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    const dismissedDate = dismissed ? new Date(dismissed) : null;
    const daysSinceDismissed = dismissedDate
      ? (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      : Infinity;

    // Show again after 7 days
    if (daysSinceDismissed < 7) return;

    // For iOS, show custom instructions after a delay
    if (isIOSDevice) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }

    // For Android/Desktop, listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setIsVisible(true), 2000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setIsVisible(false);
      setInstallPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("pwa-install-dismissed", new Date().toISOString());
  };

  // Don't show if already installed
  if (isStandalone) return null;

  // Don't show if not visible
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96",
        "bg-gradient-to-br from-mystic-900/95 to-mystic-950/95",
        "border border-gold/30 rounded-xl shadow-xl shadow-gold/10",
        "backdrop-blur-lg p-4 z-50",
        "animate-in slide-in-from-bottom-4 duration-500"
      )}
    >
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 text-mystic-400 hover:text-mystic-200 transition-colors"
        aria-label="Fermer"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-start gap-3">
        <div className="p-2 bg-gold/20 rounded-lg">
          <Smartphone className="w-8 h-8 text-gold" />
        </div>

        <div className="flex-1 pr-6">
          <h3 className="font-display text-lunar font-semibold mb-1">
            Installer DreamOracle
          </h3>

          {isIOS ? (
            <div className="text-sm text-mystic-300 space-y-2">
              <p>Ajoutez DreamOracle à votre écran d&apos;accueil :</p>
              <ol className="list-decimal list-inside space-y-1 text-mystic-400">
                <li>
                  Appuyez sur{" "}
                  <span className="inline-flex items-center px-1.5 py-0.5 bg-mystic-800 rounded text-mystic-200">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15 8a1 1 0 01-1 1h-3v3a1 1 0 11-2 0V9H6a1 1 0 110-2h3V4a1 1 0 112 0v3h3a1 1 0 011 1z" />
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                    </svg>
                  </span>{" "}
                  Partager
                </li>
                <li>Puis &quot;Sur l&apos;écran d&apos;accueil&quot;</li>
              </ol>
            </div>
          ) : (
            <p className="text-sm text-mystic-300 mb-3">
              Accédez rapidement à vos rêves depuis votre écran d&apos;accueil.
            </p>
          )}

          {!isIOS && installPrompt && (
            <Button
              onClick={handleInstall}
              className="w-full bg-gold hover:bg-gold/90 text-mystic-950 font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Installer l&apos;application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
