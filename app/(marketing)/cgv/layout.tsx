import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description:
    "Conditions générales de vente de DreamOracle. Informations sur les abonnements, paiements et remboursements.",
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
