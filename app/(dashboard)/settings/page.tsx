import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Settings, User, Bell, Palette, Shield, Smartphone, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "./SettingsForm";
import { SubscriptionSection } from "./SubscriptionSection";
import { NotificationSettings } from "@/components/notifications/NotificationSettings";
import { InstallSection } from "@/components/pwa/InstallSection";
import { TIERS, type SubscriptionTier, getEffectiveTier } from "@/lib/subscription";
import TrackSubscription from "@/components/tracking/TrackSubscription";

export const metadata = {
  title: "Paramètres",
};

export default async function SettingsPage() {
  const session = await auth();

  let settings = await prisma.userSettings.findUnique({
    where: { userId: session?.user?.id },
  });

  // Create default settings if not exist
  if (!settings && session?.user?.id) {
    settings = await prisma.userSettings.create({
      data: { userId: session.user.id },
    });
  }

  // Fetch subscription info
  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          subscriptionTier: true,
          subscriptionStatus: true,
          subscriptionEnds: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          trialEndsAt: true,
        },
      })
    : null;

  const tier = user ? getEffectiveTier(user as { subscriptionTier: string; trialEndsAt: Date | null; stripeSubscriptionId: string | null }) : "FREE" as SubscriptionTier;
  const tierInfo = TIERS[tier];

  // Trial info
  const isTrialing = !!(
    user?.trialEndsAt &&
    new Date(user.trialEndsAt) > new Date() &&
    !user.stripeSubscriptionId
  );
  const trialEndsAt = isTrialing && user?.trialEndsAt ? user.trialEndsAt.toISOString() : null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 px-3 sm:px-4 md:px-0">
      <Suspense fallback={null}>
        <TrackSubscription tier={tier} />
      </Suspense>
      <div>
        <h1 className="font-display text-3xl text-lunar mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-mystic-400" />
          Paramètres
        </h1>
        <p className="text-mystic-400">
          Personnalisez votre expérience DreamOracle
        </p>
      </div>

      {/* Subscription Section */}
      <Card className="glass-card border-mystic-700/30 border-indigo-500/20 bg-gradient-to-br from-mystic-900/80 to-indigo-950/10">
        <CardHeader className="border-b border-mystic-700/30">
          <CardTitle className="font-display text-lg text-lunar flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            Abonnement
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <SubscriptionSection
            tier={tier}
            tierDisplayName={tierInfo.displayName}
            status={user?.subscriptionStatus || "active"}
            subscriptionEnds={user?.subscriptionEnds?.toISOString() || null}
            hasStripeCustomer={!!user?.stripeCustomerId}
            monthlyPrice={tierInfo.monthlyPrice}
            isTrialing={isTrialing}
            trialEndsAt={trialEndsAt}
          />
        </CardContent>
      </Card>

      {/* Profile Section */}
      <Card className="glass-card border-mystic-700/30">
        <CardHeader className="border-b border-mystic-700/30">
          <CardTitle className="font-display text-lg text-lunar flex items-center gap-2">
            <User className="w-5 h-5 text-mystic-400" />
            Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-mystic-500">Nom</label>
              <p className="text-lunar">{session?.user?.name || "Non défini"}</p>
            </div>
            <div>
              <label className="text-sm text-mystic-500">Email</label>
              <p className="text-lunar">{session?.user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card className="glass-card border-mystic-700/30">
        <CardHeader className="border-b border-mystic-700/30">
          <CardTitle className="font-display text-lg text-lunar flex items-center gap-2">
            <Palette className="w-5 h-5 text-mystic-400" />
            Préférences
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <SettingsForm
            initialSettings={{
              interpretationStyle: settings?.interpretationStyle || "balanced",
              language: settings?.language || "fr",
              notificationsEnabled: settings?.notificationsEnabled ?? true,
              theme: settings?.theme || "dark",
            }}
          />
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card className="glass-card border-mystic-700/30">
        <CardHeader className="border-b border-mystic-700/30">
          <CardTitle className="font-display text-lg text-lunar flex items-center gap-2">
            <Bell className="w-5 h-5 text-mystic-400" />
            Rappels Matinaux
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <NotificationSettings
            initialSettings={{
              notificationsEnabled: settings?.notificationsEnabled ?? true,
              reminderTime: settings?.reminderTime || null,
            }}
          />
        </CardContent>
      </Card>

      {/* Install App Section */}
      <Card id="install-app" className="glass-card border-mystic-700/30 border-gold/20 bg-gradient-to-br from-mystic-900/80 to-gold/5 scroll-mt-20">
        <CardHeader className="border-b border-mystic-700/30">
          <CardTitle className="font-display text-lg text-lunar flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-gold" />
            Application Mobile
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <InstallSection />
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="glass-card border-mystic-700/30">
        <CardHeader className="border-b border-mystic-700/30">
          <CardTitle className="font-display text-lg text-lunar flex items-center gap-2">
            <Shield className="w-5 h-5 text-mystic-400" />
            Sécurité & Confidentialité
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-mystic-400 text-sm">
            Vos rêves sont stockés de manière sécurisée et ne sont jamais partagés
            avec des tiers. Seul vous avez accès à vos données.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
