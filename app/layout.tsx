import type { Metadata, Viewport } from "next";
import { Cinzel, Raleway, Philosopher } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
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
  title: {
    default: "DreamOracle - Interprète de Rêves",
    template: "%s | DreamOracle",
  },
  description:
    "Explorez les mystères de vos rêves avec DreamOracle. Enregistrez, analysez et interprétez vos rêves grâce à l'intelligence artificielle.",
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
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#8b5cf6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
