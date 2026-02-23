import type { Metadata, Viewport } from "next";
import { Cinzel, Raleway, Philosopher } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import MetaPixel from "@/components/tracking/MetaPixel";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

const philosopher = Philosopher({
  variable: "--font-philosopher",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dreamoracle.eu"),
  title: {
    default: "DreamOracle - Interprète de Rêves",
    template: "%s | DreamOracle",
  },
  description:
    "Explorez les mystères de vos rêves avec DreamOracle. Enregistrez, analysez et interprétez vos rêves grâce à l'Oracle.",
  keywords: [
    "rêves",
    "interprétation",
    "oracle",
    "symbolisme",
    "journal de rêves",
    "analyse onirique",
  ],
  authors: [{ name: "DreamOracle" }],
  creator: "DreamOracle",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DreamOracle",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "DreamOracle",
    title: "DreamOracle - Interprète de Rêves",
    description: "Explorez les mystères de vos rêves avec l'Oracle",
  },
};

export const viewport: Viewport = {
  themeColor: "#d4af37",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${cinzel.variable} ${raleway.variable} ${philosopher.variable} antialiased min-h-screen`}
      >
        <MetaPixel />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(18, 18, 42, 0.9)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              color: "#e8e8f0",
            },
          }}
        />
      </body>
    </html>
  );
}
