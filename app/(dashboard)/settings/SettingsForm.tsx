"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Save, Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INTERPRETATION_STYLES } from "@/types";
import Link from "next/link";

// Theme definitions
const THEMES = [
  { value: "dark", label: "Nuit Étoilée", premium: false, emoji: "🌙" },
  { value: "midnight", label: "Minuit Profond", premium: false, emoji: "🌑" },
  { value: "aurora", label: "Aurore Boréale", premium: true, emoji: "🌌" },
  { value: "cosmic", label: "Cosmos Violet", premium: true, emoji: "💜" },
  { value: "ocean", label: "Océan Profond", premium: true, emoji: "🌊" },
  { value: "sunset", label: "Crépuscule Doré", premium: true, emoji: "🌅" },
];

interface SettingsFormProps {
  initialSettings: {
    interpretationStyle: string;
    language: string;
    notificationsEnabled: boolean;
    theme: string;
  };
  isPremium?: boolean;
}

export function SettingsForm({ initialSettings, isPremium = false }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState(initialSettings);
  const [userTier, setUserTier] = useState<string>("FREE");

  // Check user tier on mount
  useEffect(() => {
    const checkTier = async () => {
      try {
        const res = await fetch("/api/usage");
        const data = await res.json();
        setUserTier(data.tier || "FREE");
      } catch {
        // Ignore
      }
    };
    checkTier();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      toast.success("Paramètres sauvegardés");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Interpretation Style */}
      <div className="space-y-2">
        <Label className="text-lunar">Style d&apos;interprétation par défaut</Label>
        <Select
          value={settings.interpretationStyle}
          onValueChange={(value) =>
            setSettings({ ...settings, interpretationStyle: value })
          }
        >
          <SelectTrigger className="bg-mystic-900/30 border-mystic-600/30 text-lunar">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-night-light border-mystic-700">
            {INTERPRETATION_STYLES.map((style) => (
              <SelectItem
                key={style.value}
                value={style.value}
                className="text-lunar hover:bg-mystic-800"
              >
                <div>
                  <span className="font-medium">{style.label}</span>
                  <p className="text-xs text-mystic-400">{style.description}</p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Language */}
      <div className="space-y-2">
        <Label className="text-lunar">Langue</Label>
        <Select
          value={settings.language}
          onValueChange={(value) =>
            setSettings({ ...settings, language: value })
          }
        >
          <SelectTrigger className="bg-mystic-900/30 border-mystic-600/30 text-lunar">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-night-light border-mystic-700">
            <SelectItem value="fr" className="text-lunar hover:bg-mystic-800">
              Français
            </SelectItem>
            <SelectItem value="en" className="text-lunar hover:bg-mystic-800">
              English
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Theme */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-lunar">Thème visuel</Label>
          {userTier !== "PREMIUM" && (
            <Link href="/pricing" className="text-xs text-gold flex items-center gap-1 hover:underline">
              <Crown className="w-3 h-3" />
              Plus de thèmes
            </Link>
          )}
        </div>
        <Select
          value={settings.theme}
          onValueChange={(value) => {
            const theme = THEMES.find(t => t.value === value);
            if (theme?.premium && userTier !== "PREMIUM") {
              toast.error("Ce thème est réservé aux abonnés Oracle+");
              return;
            }
            setSettings({ ...settings, theme: value });
          }}
        >
          <SelectTrigger className="bg-mystic-900/30 border-mystic-600/30 text-lunar">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-night-light border-mystic-700">
            {THEMES.map((theme) => (
              <SelectItem
                key={theme.value}
                value={theme.value}
                className="text-lunar hover:bg-mystic-800"
                disabled={theme.premium && userTier !== "PREMIUM"}
              >
                <div className="flex items-center gap-2">
                  <span>{theme.emoji}</span>
                  <span>{theme.label}</span>
                  {theme.premium && userTier !== "PREMIUM" && (
                    <Lock className="w-3 h-3 text-mystic-500 ml-auto" />
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={isLoading}
        className="w-full btn-mystic"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Sauvegarde...
          </>
        ) : (
          <>
            <Save className="w-5 h-5 mr-2" />
            Sauvegarder les paramètres
          </>
        )}
      </Button>
    </div>
  );
}
