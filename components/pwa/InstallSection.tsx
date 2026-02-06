"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Smartphone, Share, CheckCircle, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallSection() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSDialog, setShowIOSDialog] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const isInStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error - iOS Safari specific
      window.navigator.standalone === true;

    setIsStandalone(isInStandaloneMode);

    // Check if mobile device
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    setIsMobile(isMobileDevice);

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

  // Already installed
  if (isStandalone) {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
        <CheckCircle className="w-6 h-6 text-green-400" />
        <div>
          <p className="text-lunar font-medium">Application installée</p>
          <p className="text-sm text-mystic-400">
            Vous utilisez déjà DreamOracle en mode application
          </p>
        </div>
      </div>
    );
  }

  // Desktop view - show QR code
  if (!isMobile) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4 p-4 bg-mystic-800/30 rounded-lg border border-mystic-700/30">
          <Monitor className="w-6 h-6 text-mystic-400 flex-shrink-0 mt-1" />
          <div>
            <p className="text-lunar font-medium mb-1">Vous êtes sur ordinateur</p>
            <p className="text-sm text-mystic-400">
              Scannez le QR code avec votre téléphone pour installer l&apos;application
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white rounded-xl">
            <QRCodeSVG
              value="https://dreamoracle.eu"
              size={180}
              level="H"
              includeMargin={false}
              bgColor="#FFFFFF"
              fgColor="#0a0a1a"
            />
          </div>
          <p className="text-sm text-mystic-500 text-center">
            Scannez ce code avec l&apos;appareil photo de votre téléphone
          </p>
        </div>

        <div className="text-center text-mystic-500 text-sm">
          <p>Ou ouvrez directement :</p>
          <a
            href="https://dreamoracle.eu"
            className="text-gold hover:underline font-medium"
          >
            dreamoracle.eu
          </a>
        </div>
      </div>
    );
  }

  // Mobile view - show install button
  return (
    <div className="space-y-4">
      <p className="text-mystic-300">
        Installez DreamOracle sur votre téléphone pour noter vos rêves
        dès le réveil et recevoir des rappels.
      </p>

      {isIOS ? (
        <Button
          onClick={() => setShowIOSDialog(true)}
          className="w-full bg-gradient-to-r from-gold/90 to-gold hover:from-gold hover:to-gold/90 text-mystic-950 font-medium"
        >
          <Download className="w-5 h-5 mr-2" />
          Installer sur mon iPhone
        </Button>
      ) : installPrompt ? (
        <Button
          onClick={handleInstall}
          className="w-full bg-gradient-to-r from-gold/90 to-gold hover:from-gold hover:to-gold/90 text-mystic-950 font-medium"
        >
          <Download className="w-5 h-5 mr-2" />
          Installer l&apos;application
        </Button>
      ) : (
        <div className="p-4 bg-mystic-800/30 rounded-lg border border-mystic-700/30">
          <p className="text-sm text-mystic-400">
            Pour installer l&apos;application, ouvrez ce site dans Chrome (Android) ou Safari (iOS).
          </p>
        </div>
      )}

      <IOSInstallDialog open={showIOSDialog} onOpenChange={setShowIOSDialog} />
    </div>
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
