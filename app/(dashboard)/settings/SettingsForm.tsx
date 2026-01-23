"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
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

interface SettingsFormProps {
  initialSettings: {
    interpretationStyle: string;
    language: string;
    notificationsEnabled: boolean;
    theme: string;
  };
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState(initialSettings);

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
        <Label className="text-lunar">Thème visuel</Label>
        <Select
          value={settings.theme}
          onValueChange={(value) =>
            setSettings({ ...settings, theme: value })
          }
        >
          <SelectTrigger className="bg-mystic-900/30 border-mystic-600/30 text-lunar">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-night-light border-mystic-700">
            <SelectItem value="dark" className="text-lunar hover:bg-mystic-800">
              Nuit Étoilée (par défaut)
            </SelectItem>
            <SelectItem value="midnight" className="text-lunar hover:bg-mystic-800">
              Minuit Profond
            </SelectItem>
            <SelectItem value="aurora" className="text-lunar hover:bg-mystic-800">
              Aurore Boréale
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-lunar">Rappels quotidiens</Label>
          <p className="text-sm text-mystic-500">
            Recevoir un rappel pour noter vos rêves
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setSettings({
              ...settings,
              notificationsEnabled: !settings.notificationsEnabled,
            })
          }
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.notificationsEnabled ? "bg-mystic-500" : "bg-mystic-800"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.notificationsEnabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
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
