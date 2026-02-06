"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Database, Lock, Eye, Trash2, Mail } from "lucide-react";
import { StarField } from "@/components/shared/StarField";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen relative">
      <StarField count={50} />

      {/* Header */}
      <header className="relative z-10 border-b border-primary/20 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80">
            <ArrowLeft className="h-5 w-5" />
            <span>Retour</span>
          </Link>
          <h1 className="text-xl font-cinzel text-primary">DreamOracle</h1>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-cinzel text-foreground">
              Politique de Confidentialité
            </h1>
          </div>
          <p className="text-muted-foreground">Dernière mise à jour : 6 février 2026</p>
        </div>

        <div className="space-y-8 text-foreground/90">
          {/* Introduction */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4">Introduction</h2>
            <p className="leading-relaxed">
              Chez DreamOracle, nous accordons une importance primordiale à la protection de
              vos données personnelles. Cette politique de confidentialité explique comment
              nous collectons, utilisons et protégeons vos informations conformément au
              Règlement Général sur la Protection des Données (RGPD).
            </p>
          </section>

          {/* Responsable du traitement */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4">Responsable du traitement</h2>
            <div className="space-y-2">
              <p><strong>Société :</strong> Distr&apos;Action SRL</p>
              <p><strong>Adresse :</strong> Belgique</p>
              <p><strong>Email DPO :</strong> privacy@dreamoracle.eu</p>
            </div>
          </section>

          {/* Données collectées */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4 flex items-center gap-2">
              <Database className="h-5 w-5" />
              Données collectées
            </h2>
            <p className="mb-4">Nous collectons les données suivantes :</p>

            <h3 className="font-semibold mt-4 mb-2">Données d&apos;identification</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Photo de profil (optionnel, via OAuth)</li>
            </ul>

            <h3 className="font-semibold mt-4 mb-2">Données de contenu</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Textes de vos rêves</li>
              <li>Enregistrements vocaux (temporaires, pour transcription)</li>
              <li>Tags et catégories attribués</li>
              <li>Notes d&apos;émotion et de clarté</li>
            </ul>

            <h3 className="font-semibold mt-4 mb-2">Données techniques</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Adresse IP (anonymisée)</li>
              <li>Type de navigateur</li>
              <li>Données de navigation</li>
            </ul>
          </section>

          {/* Finalités */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Finalités du traitement
            </h2>
            <p className="mb-4">Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Fournir le service :</strong> Stockage et affichage de vos rêves,
                génération d&apos;interprétations par IA
              </li>
              <li>
                <strong>Gestion du compte :</strong> Authentification, gestion des abonnements
              </li>
              <li>
                <strong>Amélioration du service :</strong> Statistiques anonymisées d&apos;utilisation
              </li>
              <li>
                <strong>Communication :</strong> Notifications de rappel (avec votre consentement),
                emails de service
              </li>
            </ul>
          </section>

          {/* Base légale */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4">Base légale du traitement</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Exécution du contrat :</strong> Fourniture du service DreamOracle
              </li>
              <li>
                <strong>Consentement :</strong> Notifications push, communications marketing
              </li>
              <li>
                <strong>Intérêt légitime :</strong> Amélioration et sécurisation du service
              </li>
            </ul>
          </section>

          {/* Durée de conservation */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4">Durée de conservation</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Données de compte :</strong> Conservées tant que le compte est actif,
                puis 3 ans après suppression
              </li>
              <li>
                <strong>Rêves et interprétations :</strong> Conservés tant que le compte est actif
              </li>
              <li>
                <strong>Enregistrements vocaux :</strong> Supprimés immédiatement après transcription
              </li>
              <li>
                <strong>Données de paiement :</strong> Conservées par Stripe selon leur politique
              </li>
            </ul>
          </section>

          {/* Partage des données */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4">Partage des données</h2>
            <p className="mb-4">Vos données peuvent être partagées avec :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>OpenRouter/OpenAI :</strong> Pour l&apos;interprétation des rêves
                (textes uniquement, sans données d&apos;identification)
              </li>
              <li>
                <strong>ElevenLabs :</strong> Pour la transcription vocale
                (audio uniquement, supprimé après traitement)
              </li>
              <li>
                <strong>Stripe :</strong> Pour le traitement des paiements
              </li>
              <li>
                <strong>Hostinger :</strong> Hébergement des données (serveurs UE)
              </li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Nous ne vendons jamais vos données personnelles à des tiers.
            </p>
          </section>

          {/* Sécurité */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Sécurité des données
            </h2>
            <p className="mb-4">Nous mettons en œuvre les mesures de sécurité suivantes :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Chiffrement HTTPS pour toutes les communications</li>
              <li>Chiffrement des données sensibles en base de données</li>
              <li>Authentification sécurisée (OAuth 2.0, bcrypt)</li>
              <li>Sauvegardes régulières et chiffrées</li>
              <li>Accès restreint aux données (principe du moindre privilège)</li>
            </ul>
          </section>

          {/* Vos droits */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Vos droits RGPD
            </h2>
            <p className="mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Droit d&apos;accès :</strong> Obtenir une copie de vos données
              </li>
              <li>
                <strong>Droit de rectification :</strong> Corriger des données inexactes
              </li>
              <li>
                <strong>Droit à l&apos;effacement :</strong> Supprimer vos données
                (&quot;droit à l&apos;oubli&quot;)
              </li>
              <li>
                <strong>Droit à la portabilité :</strong> Recevoir vos données dans un format
                structuré (JSON)
              </li>
              <li>
                <strong>Droit d&apos;opposition :</strong> Refuser certains traitements
              </li>
              <li>
                <strong>Droit à la limitation :</strong> Restreindre le traitement
              </li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, rendez-vous dans{" "}
              <Link href="/settings" className="text-primary hover:underline">
                Paramètres &gt; Confidentialité
              </Link>{" "}
              ou contactez-nous à{" "}
              <a href="mailto:privacy@dreamoracle.eu" className="text-primary hover:underline">
                privacy@dreamoracle.eu
              </a>
            </p>
          </section>

          {/* Cookies */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4">Cookies</h2>
            <p className="mb-4">DreamOracle utilise uniquement des cookies essentiels :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Cookie de session :</strong> Maintien de votre connexion
              </li>
              <li>
                <strong>Cookie de préférences :</strong> Mémorisation de vos paramètres
              </li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Nous n&apos;utilisons pas de cookies publicitaires ou de tracking tiers.
            </p>
          </section>

          {/* Transferts internationaux */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4">Transferts internationaux</h2>
            <p>
              Vos données sont principalement stockées sur des serveurs situés dans l&apos;Union
              Européenne. Pour les services d&apos;IA (OpenRouter), des transferts vers les
              États-Unis peuvent avoir lieu, encadrés par les clauses contractuelles types
              de la Commission Européenne.
            </p>
          </section>

          {/* Modifications */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4">Modifications de cette politique</h2>
            <p>
              Nous pouvons mettre à jour cette politique de confidentialité. En cas de
              modification substantielle, vous serez informé par email ou notification
              dans l&apos;application. La date de dernière mise à jour figure en haut de ce document.
            </p>
          </section>

          {/* Réclamation */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4">Réclamation</h2>
            <p>
              Si vous estimez que le traitement de vos données personnelles constitue une
              violation du RGPD, vous avez le droit d&apos;introduire une réclamation auprès de
              l&apos;Autorité de Protection des Données belge :{" "}
              <a
                href="https://www.autoriteprotectiondonnees.be"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                www.autoriteprotectiondonnees.be
              </a>
            </p>
          </section>

          {/* Contact */}
          <section className="dream-card p-6 bg-primary/5">
            <h2 className="text-xl font-cinzel text-primary mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact
            </h2>
            <p className="mb-2">
              <strong>Questions générales :</strong>{" "}
              <a href="mailto:contact@dreamoracle.eu" className="text-primary hover:underline">
                contact@dreamoracle.eu
              </a>
            </p>
            <p>
              <strong>Protection des données (DPO) :</strong>{" "}
              <a href="mailto:privacy@dreamoracle.eu" className="text-primary hover:underline">
                privacy@dreamoracle.eu
              </a>
            </p>
          </section>
        </div>

        {/* Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
          <Link href="/terms" className="text-primary hover:underline">
            Conditions d&apos;utilisation
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/pricing" className="text-primary hover:underline">
            Tarifs
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/" className="text-primary hover:underline">
            Accueil
          </Link>
        </div>
      </main>
    </div>
  );
}
