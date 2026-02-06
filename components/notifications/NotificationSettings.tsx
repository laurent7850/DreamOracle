"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Bell, BellOff, Clock, Loader2, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NotificationSettingsProps {
  initialSettings: {
    notificationsEnabled: boolean;
    reminderTime: string | null;
    reminderDays: string;
  };
}

const DAYS = [
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mer" },
  { value: 4, label: "Jeu" },
  { value: 5, label: "Ven" },
  { value: 6, label: "Sam" },
  { value: 0, label: "Dim" },
];

const HOURS = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 5; // 5:00 to 16:00
  return {
    value: `${hour.toString().padStart(2, "0")}:00`,
    label: `${hour}:00`,
  };
});

export function NotificationSettings({
  initialSettings,
}: NotificationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [settings, setSettings] = useState({
    notificationsEnabled: initialSettings.notificationsEnabled,
    reminderTime: initialSettings.reminderTime || "07:00",
    reminderDays: JSON.parse(initialSettings.reminderDays || "[0,1,2,3,4,5,6]") as number[],
  });

  // Check push notification support and subscription status
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setPushSupported(true);
      setPushPermission(Notification.permission);

      // Check if already subscribed
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          setIsSubscribed(!!subscription);
        });
      });
    }
  }, []);

  const registerServiceWorker = useCallback(async () => {
    if (!("serviceWorker" in navigator)) {
      throw new Error("Service Worker not supported");
    }

    // Register the push service worker
    const registration = await navigator.serviceWorker.register("/sw-push.js", {
      scope: "/",
    });

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;
    return registration;
  }, []);

  const subscribeToPush = async () => {
    setIsSubscribing(true);

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      setPushPermission(permission);

      if (permission !== "granted") {
        toast.error("Permission de notification refusée");
        setIsSubscribing(false);
        return;
      }

      // Register service worker
      const registration = await registerServiceWorker();

      // Get VAPID public key from server
      const vapidResponse = await fetch("/api/notifications/vapid-key");
      const { publicKey } = await vapidResponse.json();

      if (!publicKey) {
        throw new Error("VAPID key not available");
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // Send subscription to server
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });

      if (!response.ok) {
        throw new Error("Failed to save subscription");
      }

      setIsSubscribed(true);
      toast.success("Notifications activées !");
    } catch (error) {
      console.error("Error subscribing to push:", error);
      toast.error("Erreur lors de l'activation des notifications");
    } finally {
      setIsSubscribing(false);
    }
  };

  const unsubscribeFromPush = async () => {
    setIsSubscribing(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Unsubscribe from push
        await subscription.unsubscribe();

        // Remove subscription from server
        await fetch("/api/notifications/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
      }

      setIsSubscribed(false);
      toast.success("Notifications désactivées");
    } catch (error) {
      console.error("Error unsubscribing from push:", error);
      toast.error("Erreur lors de la désactivation");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notificationsEnabled: settings.notificationsEnabled,
          reminderTime: settings.reminderTime,
          reminderDays: JSON.stringify(settings.reminderDays),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      toast.success("Paramètres de rappel sauvegardés");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDay = (day: number) => {
    const newDays = settings.reminderDays.includes(day)
      ? settings.reminderDays.filter((d) => d !== day)
      : [...settings.reminderDays, day];
    setSettings({ ...settings, reminderDays: newDays });
  };

  if (!pushSupported) {
    return (
      <div className="text-center py-8 text-mystic-400">
        <BellOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Les notifications push ne sont pas supportées sur ce navigateur.</p>
        <p className="text-sm mt-2">
          Essayez d&apos;utiliser Chrome, Firefox ou Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Push Notification Status */}
      <div className="p-4 rounded-lg bg-mystic-900/30 border border-mystic-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isSubscribed ? (
              <div className="p-2 rounded-full bg-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            ) : (
              <div className="p-2 rounded-full bg-mystic-700/30">
                <Bell className="w-5 h-5 text-mystic-400" />
              </div>
            )}
            <div>
              <p className="text-lunar font-medium">
                {isSubscribed ? "Notifications activées" : "Notifications désactivées"}
              </p>
              <p className="text-sm text-mystic-500">
                {isSubscribed
                  ? "Vous recevrez des rappels sur cet appareil"
                  : "Activez les notifications pour recevoir des rappels"}
              </p>
            </div>
          </div>
          <Button
            onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
            disabled={isSubscribing}
            variant={isSubscribed ? "outline" : "default"}
            className={isSubscribed ? "border-mystic-600" : "btn-mystic"}
          >
            {isSubscribing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSubscribed ? (
              <>
                <BellOff className="w-4 h-4 mr-2" />
                Désactiver
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 mr-2" />
                Activer
              </>
            )}
          </Button>
        </div>
        {pushPermission === "denied" && (
          <p className="mt-3 text-sm text-red-400">
            ⚠️ Les notifications sont bloquées. Veuillez les autoriser dans les
            paramètres de votre navigateur.
          </p>
        )}
      </div>

      {/* Reminder Time Settings */}
      {isSubscribed && (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lunar flex items-center gap-2">
                <Clock className="w-4 h-4 text-mystic-400" />
                Heure du rappel
              </Label>
              <Select
                value={settings.reminderTime}
                onValueChange={(value) =>
                  setSettings({ ...settings, reminderTime: value })
                }
              >
                <SelectTrigger className="bg-mystic-900/30 border-mystic-600/30 text-lunar">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-night-light border-mystic-700">
                  {HOURS.map((hour) => (
                    <SelectItem
                      key={hour.value}
                      value={hour.value}
                      className="text-lunar hover:bg-mystic-800"
                    >
                      {hour.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-mystic-500">
                Choisissez l&apos;heure à laquelle vous souhaitez être rappelé(e)
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-lunar">Jours de rappel</Label>
              <div className="flex gap-2 flex-wrap">
                {DAYS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      settings.reminderDays.includes(day.value)
                        ? "bg-mystic-500 text-white"
                        : "bg-mystic-900/30 text-mystic-400 hover:bg-mystic-800/50"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-mystic-500">
                Sélectionnez les jours où vous souhaitez recevoir un rappel
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 btn-mystic"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                "Sauvegarder"
              )}
            </Button>
            <Button
              onClick={async () => {
                try {
                  const res = await fetch("/api/notifications/test", {
                    method: "POST",
                  });
                  if (res.ok) {
                    toast.success("Notification de test envoyée !");
                  } else {
                    toast.error("Erreur lors de l'envoi");
                  }
                } catch {
                  toast.error("Erreur réseau");
                }
              }}
              variant="outline"
              className="border-mystic-600"
            >
              <Send className="w-4 h-4 mr-2" />
              Tester
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray as Uint8Array<ArrayBuffer>;
}
