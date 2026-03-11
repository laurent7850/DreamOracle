import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description:
    "Mentions légales de DreamOracle, service d'interprétation de rêves par IA. Informations sur l'éditeur Distr'Action SPRL, hébergement, propriété intellectuelle et droit belge applicable.",
  alternates: {
    canonical: "https://dreamoracle.eu/mentions-legales",
  },
};

export default function MentionsLegalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
