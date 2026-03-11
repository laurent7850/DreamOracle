import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description:
    "CGV DreamOracle. Abonnements, tarifs, modalités de paiement, droit de rétractation et garanties du service d'interprétation de rêves.",
  alternates: {
    canonical: "https://dreamoracle.eu/cgv",
  },
};

export default function CGVLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
