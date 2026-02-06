"use client";

import { useState, useEffect } from "react";
import { Download, Smartphone, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallButtonProps {
  variant?: "default" | "sidebar" | "compact";
  className?: string;
}

export function InstallButton({ variant = "default", className }: InstallButtonProps) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSDialog, setShowIOSDialog] = useState(false);

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

    // For Android/Desktop, listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSDialog(true);
      return;
    }

    if (!installPrompt) return;

    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  // Don't show if already installed
  if (isStandalone) return null;

  // Don't show on desktop if no install prompt available (except for showing it's a PWA)
  if (!isIOS && !installPrompt) return null;

  if (variant === "sidebar") {
    return (
      <>
        <button
          onClick={handleInstall}
          className={cn(
            "flex items-center gap-3 px-4 py-3 w-full rounded-lg",
            "text-gold hover:bg-gold/10 transition-all",
            "border border-gold/30 hover:border-gold/50",
            className
          )}
        >
          <Smartphone className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">Installer l&apos;app</span>
        </button>

        <IOSInstallDialog open={showIOSDialog} onOpenChange={setShowIOSDialog} />
      </>
    );
  }

  if (variant === "compact") {
    return (
      <>
        <Button
          onClick={handleInstall}
          size="sm"
          className={cn(
            "bg-gold/20 hover:bg-gold/30 text-gold border border-gold/30",
            className
          )}
        >
          <Download className="w-4 h-4 mr-2" />
          Installer
        </Button>

        <IOSInstallDialog open={showIOSDialog} onOpenChange={setShowIOSDialog} />
      </>
    );
  }

  // Default variant
  return (
    <>
      <Button
        onClick={handleInstall}
        className={cn(
          "bg-gradient-to-r from-gold/90 to-gold hover:from-gold hover:to-gold/90",
          "text-mystic-950 font-medium shadow-lg shadow-gold/20",
          className
        )}
      >
        <Download className="w-5 h-5 mr-2" />
        Installer sur mon téléphone
      </Button>

      <IOSInstallDialog open={showIOSDialog} onOpenChange={setShowIOSDialog} />
    </>
  );
}

function IOSInstallDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-mystic-900 border-mystic-700 text-lunar max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-gold" />
            Installer DreamOracle
          </DialogTitle>
          <DialogDescription className="text-mystic-400">
            Suivez ces étapes pour ajouter l&apos;application à votre écran d&apos;accueil
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex items-start gap-4 p-4 bg-mystic-800/50 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/20 text-gold font-bold text-sm">
              1
            </div>
            <div>
              <p className="text-lunar font-medium mb-1">
                Appuyez sur le bouton Partager
              </p>
              <div className="flex items-center gap-2 text-mystic-400 text-sm">
                <Share className="w-5 h-5" />
                <span>en bas de votre écran Safari</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-mystic-800/50 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/20 text-gold font-bold text-sm">
              2
            </div>
            <div>
              <p className="text-lunar font-medium mb-1">
                Faites défiler et appuyez sur
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-mystic-700 rounded-lg text-sm">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Sur l&apos;écran d&apos;accueil</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-mystic-800/50 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/20 text-gold font-bold text-sm">
              3
            </div>
            <div>
              <p className="text-lunar font-medium">
                Confirmez en appuyant sur &quot;Ajouter&quot;
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-mystic-500 text-sm mt-4">
          L&apos;icône DreamOracle apparaîtra sur votre écran d&apos;accueil 🌙
        </p>
      </DialogContent>
    </Dialog>
  );
}
