import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion à votre Journal de Rêves",
  description:
    "Connectez-vous à DreamOracle pour accéder à votre journal de rêves, vos interprétations personnalisées par IA et votre suivi onirique complet. Essai gratuit 7 jours.",
  alternates: {
    canonical: "https://dreamoracle.eu/login",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
