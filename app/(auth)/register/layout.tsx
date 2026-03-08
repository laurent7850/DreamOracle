import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription Gratuite | 7 jours d'essai Oracle+",
  description: "Créez votre compte DreamOracle et commencez votre essai gratuit de 7 jours Oracle+. Interprétation des rêves par IA, journal onirique et coaching personnalisé.",
  alternates: {
    canonical: "https://dreamoracle.eu/register",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
