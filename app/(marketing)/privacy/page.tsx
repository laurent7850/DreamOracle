"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Database, Lock, Eye, Trash2, Mail } from "lucide-react";
import { StarField } from "@/components/shared/StarField";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen relative">
      <StarField count={50} />

      {/* Header */}
      <header className="relative z-10 border-b border-primary/20 bg-background/80 backdrop-blur-sm sticky top-0">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 text-primary hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Retour</span>
          </Link>
          <span className="text-lg sm:text-xl font-cinzel text-primary">DreamOracle</span>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-cinzel text-foreground leading-tight">
              Politique de Confidentialité
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Dernière mise à jour : 6 février 2026
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6 md:space-y-8 text-foreground/90">
          {/* Introduction */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Introduction
            </h2>
            <p className="leading-relaxed text-sm sm:text-base">
              Chez DreamOracle, nous accordons une importance primordiale à la protection de
              vos données personnelles. Cette politique de confidentialité explique comment
              nous collectons, utilisons et protégeons vos informations conformément au
              Règlement Général sur la Protection des Données (RGPD).
            </p>
          </section>

          {/* Responsable du traitement */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Responsable du traitement
            </h2>
            <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <p className="break-words">
                <strong>Société :</strong> Distr&apos;Action SPRL
              </p>
              <p className="break-words">
                <strong>Adresse :</strong> Chaussée Brunehault 27, 7041 Givry, Belgique
              </p>
              <p><strong>Numéro TVA :</strong> BE 0462.122.648</p>
              <p className="break-words">
                <strong>Email DPO :</strong>{" "}
                <a
                  href="mailto:privacy@dreamoracle.eu"
                  className="text-primary hover:underline"
                >
                  privacy@dreamoracle.eu
                </a>
              </p>
            </div>
          </section>

          {/* Données collectées */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Database className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Données collectées</span>
            </h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Nous collectons les données suivantes :
            </p>

            <h3 className="font-semibold mt-3 sm:mt-4 mb-2 text-sm sm:text-base">
              Données d&apos;identification
            </h3>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1 text-sm sm:text-base">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Photo de profil (optionnel, via OAuth)</li>
            </ul>

            <h3 className="font-semibold mt-3 sm:mt-4 mb-2 text-sm sm:text-base">
              Données de contenu
            </h3>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1 text-sm sm:text-base">
              <li>Textes de vos rêves</li>
              <li>Enregistrements vocaux (temporaires, pour transcription)</li>
              <li>Tags et catégories attribués</li>
              <li>Notes d&apos;émotion et de clarté</li>
            </ul>

            <h3 className="font-semibold mt-3 sm:mt-4 mb-2 text-sm sm:text-base">
              Données techniques
            </h3>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1 text-sm sm:text-base">
              <li>Adresse IP (anonymisée)</li>
              <li>Type de navigateur</li>
              <li>Données de navigation</li>
            </ul>
          </section>

          {/* Finalités */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Finalités du traitement</span>
            </h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base">
              <li>
                <strong>Fournir le service :</strong> Stockage et affichage de vos rêves,
                génération d&apos;interprétations Oracle
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
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Base légale du traitement
            </h2>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base">
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
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Durée de conservation
            </h2>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base">
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
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Partage des données
            </h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Vos données peuvent être partagées avec :
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base">
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
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
              Nous ne vendons jamais vos données personnelles à des tiers.
            </p>
          </section>

          {/* Sécurité */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Sécurité des données</span>
            </h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Nous mettons en œuvre les mesures de sécurité suivantes :
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Chiffrement HTTPS pour toutes les communications</li>
              <li>Chiffrement des données sensibles en base de données</li>
              <li>Authentification sécurisée (OAuth 2.0, bcrypt)</li>
              <li>Sauvegardes régulières et chiffrées</li>
              <li>Accès restreint aux données (principe du moindre privilège)</li>
            </ul>
          </section>

          {/* Vos droits */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Vos droits RGPD</span>
            </h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base">
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
            <p className="mt-3 sm:mt-4 text-sm sm:text-base">
              Pour exercer ces droits, rendez-vous dans{" "}
              <Link href="/settings" className="text-primary hover:underline">
                Paramètres &gt; Confidentialité
              </Link>{" "}
              ou contactez-nous à{" "}
              <a
                href="mailto:privacy@dreamoracle.eu"
                className="text-primary hover:underline break-all"
              >
                privacy@dreamoracle.eu
              </a>
            </p>
          </section>

          {/* Cookies */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Cookies
            </h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              DreamOracle utilise uniquement des cookies essentiels :
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base">
              <li>
                <strong>Cookie de session :</strong> Maintien de votre connexion
              </li>
              <li>
                <strong>Cookie de préférences :</strong> Mémorisation de vos paramètres
              </li>
            </ul>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
              Nous n&apos;utilisons pas de cookies publicitaires ou de tracking tiers.
            </p>
          </section>

          {/* Transferts internationaux */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Transferts internationaux
            </h2>
            <p className="text-sm sm:text-base">
              Vos données sont principalement stockées sur des serveurs situés dans l&apos;Union
              Européenne. Pour les services d&apos;IA (OpenRouter), des transferts vers les
              États-Unis peuvent avoir lieu, encadrés par les clauses contractuelles types
              de la Commission Européenne.
            </p>
          </section>

          {/* Modifications */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Modifications de cette politique
            </h2>
            <p className="text-sm sm:text-base">
              Nous pouvons mettre à jour cette politique de confidentialité. En cas de
              modification substantielle, vous serez informé par email ou notification
              dans l&apos;application. La date de dernière mise à jour figure en haut de ce document.
            </p>
          </section>

          {/* Réclamation */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Réclamation
            </h2>
            <p className="text-sm sm:text-base">
              Si vous estimez que le traitement de vos données personnelles constitue une
              violation du RGPD, vous avez le droit d&apos;introduire une réclamation auprès de
              l&apos;Autorité de Protection des Données belge :{" "}
              <a
                href="https://www.autoriteprotectiondonnees.be"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                www.autoriteprotectiondonnees.be
              </a>
            </p>
          </section>

          {/* Contact */}
          <section className="dream-card p-4 sm:p-6 bg-primary/5">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Contact</span>
            </h2>
            <div className="space-y-2 text-sm sm:text-base">
              <p className="break-words">
                <strong>Questions générales :</strong>{" "}
                <a
                  href="mailto:contact@dreamoracle.eu"
                  className="text-primary hover:underline"
                >
                  contact@dreamoracle.eu
                </a>
              </p>
              <p className="break-words">
                <strong>Protection des données (DPO) :</strong>{" "}
                <a
                  href="mailto:privacy@dreamoracle.eu"
                  className="text-primary hover:underline"
                >
                  privacy@dreamoracle.eu
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Links */}
        <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-4 justify-center text-xs sm:text-sm">
          <Link href="/terms" className="text-primary hover:underline px-2 py-1">
            Conditions d&apos;utilisation
          </Link>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <Link href="/cgv" className="text-primary hover:underline px-2 py-1">
            Conditions de vente
          </Link>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <Link href="/mentions-legales" className="text-primary hover:underline px-2 py-1">
            Mentions légales
          </Link>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <Link href="/pricing" className="text-primary hover:underline px-2 py-1">
            Tarifs
          </Link>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <Link href="/" className="text-primary hover:underline px-2 py-1">
            Accueil
          </Link>
        </div>
      </main>
    </div>
  );
}
