import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paramètres du Compte",
  description:
    "Gérez vos paramètres de compte DreamOracle : profil, notifications, abonnement et préférences de votre journal de rêves.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
