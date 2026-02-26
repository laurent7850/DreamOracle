import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description:
    "Politique de confidentialité de DreamOracle. Découvrez comment nous protégeons vos données personnelles et vos rêves.",
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
