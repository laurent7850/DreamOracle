import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription Gratuite | 7 jours d'essai Oracle+",
  description: "Créez votre compte DreamOracle et commencez votre essai gratuit de 7 jours Oracle+. Interprétation des rêves par IA, journal onirique et coaching personnalisé.",
  alternates: {
    canonical: "https://dreamoracle.eu/register",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <noscript>
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
          <h1>Créez votre compte DreamOracle</h1>
          <p>
            Inscrivez-vous gratuitement et commencez votre essai de 7 jours Oracle+, notre plan premium
            pour l&apos;interprétation des rêves par intelligence artificielle. Accédez à un journal de
            rêves complet, des interprétations illimitées, la transcription vocale, le Dream Coach
            personnel et le suivi de votre biorythme. Aucune carte bancaire requise pour l&apos;essai.
          </p>
          <p>
            DreamOracle analyse vos rêves grâce à l&apos;IA pour vous aider à comprendre vos émotions,
            décoder les symboles oniriques et mieux vous connaître. Rejoignez des milliers de rêveurs
            qui explorent leur monde onirique chaque nuit. Créez votre compte en quelques secondes
            avec votre email ou connectez-vous via Google.
          </p>
          <p>
            Après votre essai gratuit, choisissez le plan qui vous convient : Rêveur (gratuit),
            Explorateur (4,99€/mois) ou Oracle+ (9,99€/mois). Changez ou annulez à tout moment.
          </p>
          <nav>
            <a href="/login">Déjà un compte ? Se connecter</a> |{" "}
            <a href="/pricing">Voir les tarifs</a> |{" "}
            <a href="/blog">Blog</a> |{" "}
            <a href="/">Accueil</a> |{" "}
            <a href="/terms">CGU</a> |{" "}
            <a href="/privacy">Confidentialité</a>
          </nav>
        </div>
      </noscript>
      {children}
    </>
  );
}
