import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suppression des Données | DreamOracle",
  description:
    "Instructions pour la suppression de vos données personnelles sur DreamOracle. Exercez votre droit à l'effacement conformément au RGPD.",
  alternates: {
    canonical: "https://dreamoracle.eu/data-deletion",
  },
};

export default function DataDeletionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
