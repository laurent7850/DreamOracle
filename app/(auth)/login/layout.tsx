import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion à votre Journal de Rêves",
  description:
    "Connectez-vous à DreamOracle pour accéder à votre journal de rêves, vos interprétations par IA et votre suivi onirique complet.",
  alternates: {
    canonical: "https://dreamoracle.eu/login",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <noscript>
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
          <h1>Connexion à DreamOracle</h1>
          <p>
            Connectez-vous à votre compte DreamOracle pour accéder à votre journal de rêves personnel,
            vos interprétations par intelligence artificielle et votre suivi onirique complet. Retrouvez
            votre historique de rêves, vos symboles récurrents et les analyses de votre Dream Coach.
          </p>
          <p>
            DreamOracle vous accompagne chaque nuit dans l&apos;exploration de vos rêves. Enregistrez vos
            songes au réveil grâce à la transcription vocale, recevez des interprétations personnalisées
            et suivez votre évolution onirique au fil du temps grâce à des statistiques détaillées.
          </p>
          <nav>
            <a href="/register">Pas encore de compte ? S&apos;inscrire gratuitement</a> |{" "}
            <a href="/pricing">Tarifs</a> |{" "}
            <a href="/blog">Blog</a> |{" "}
            <a href="/">Accueil</a>
          </nav>
        </div>
      </noscript>
      {children}
    </>
  );
}
