import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description:
    "Mentions légales DreamOracle. Éditeur Distr'Action SPRL, hébergement, propriété intellectuelle et droit belge applicable.",
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
