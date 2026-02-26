import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description:
    "Mentions légales de DreamOracle. Informations sur l'éditeur, l'hébergeur et les obligations légales.",
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
