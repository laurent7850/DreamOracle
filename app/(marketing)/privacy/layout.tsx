import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description:
    "Politique de confidentialité DreamOracle. Protection de vos données personnelles et rêves conformément au RGPD. Droits d'accès et rectification.",
  alternates: {
    canonical: "https://dreamoracle.eu/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
