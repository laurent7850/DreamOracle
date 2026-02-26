import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description:
    "Conditions générales d'utilisation de DreamOracle. Règles d'utilisation du service d'interprétation de rêves par IA.",
  alternates: {
    canonical: "https://dreamoracle.eu/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
