"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Globe,
  Server,
  Shield,
  Cookie,
  Scale,
  Mail,
  FileText,
} from "lucide-react";
import { StarField } from "@/components/shared/StarField";

export default function MentionsLegalesPage() {
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
          <h1 className="text-lg sm:text-xl font-cinzel text-primary">DreamOracle</h1>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-cinzel text-foreground leading-tight">
              Mentions Légales
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Dernière mise à jour : 17 février 2026
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6 md:space-y-8 text-foreground/90">
          {/* 1 - Éditeur du site */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>1. Éditeur du site</span>
            </h2>
            <p className="text-sm sm:text-base mb-3">
              Conformément à l&apos;article III.74 du Code de droit économique belge et à
              la loi pour la confiance dans l&apos;économie numérique, les informations
              suivantes sont portées à la connaissance des utilisateurs :
            </p>
            <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <p><strong>Raison sociale :</strong> Distr&apos;Action SPRL</p>
              <p><strong>Forme juridique :</strong> Société Privée à Responsabilité Limitée (SPRL)</p>
              <p><strong>Siège social :</strong> Chaussée Brunehault 27, 7041 Givry, Belgique</p>
              <p><strong>Numéro d&apos;entreprise (BCE) :</strong> 0462.122.648</p>
              <p><strong>Numéro TVA intracommunautaire :</strong> BE 0462.122.648</p>
              <p className="break-words">
                <strong>Email :</strong>{" "}
                <a href="mailto:contact@dreamoracle.eu" className="text-primary hover:underline">
                  contact@dreamoracle.eu
                </a>
              </p>
              <p className="break-words">
                <strong>Site web :</strong>{" "}
                <a href="https://dreamoracle.eu" className="text-primary hover:underline">
                  dreamoracle.eu
                </a>
              </p>
              <p><strong>Directeur de la publication :</strong> Laurent Duplat, gérant</p>
            </div>
          </section>

          {/* 2 - Hébergeur */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Server className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>2. Hébergement</span>
            </h2>
            <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <p><strong>Hébergeur :</strong> Hostinger International Ltd.</p>
              <p><strong>Adresse :</strong> 61 Lordou Vironos Street, 6023 Larnaca, Chypre</p>
              <p className="break-words">
                <strong>Site web :</strong>{" "}
                <a
                  href="https://www.hostinger.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  www.hostinger.com
                </a>
              </p>
              <p><strong>Localisation des serveurs :</strong> Union Européenne</p>
            </div>
          </section>

          {/* 3 - Activité */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>3. Nature de l&apos;activité</span>
            </h2>
            <p className="text-sm sm:text-base">
              DreamOracle est un service en ligne (SaaS) d&apos;enregistrement, d&apos;analyse et
              d&apos;interprétation de rêves, accessible à l&apos;adresse{" "}
              <a href="https://dreamoracle.eu" className="text-primary hover:underline break-all">
                dreamoracle.eu
              </a>
              . Le service propose des fonctionnalités gratuites et payantes (abonnements
              mensuels ou annuels). Les interprétations sont générées par intelligence
              artificielle à titre informatif et de divertissement uniquement.
            </p>
          </section>

          {/* 4 - Propriété intellectuelle */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              4. Propriété intellectuelle
            </h2>
            <p className="text-sm sm:text-base mb-3">
              L&apos;ensemble du contenu du site DreamOracle — incluant sans limitation les
              textes, images, graphismes, logos, icônes, sons, logiciels, code source,
              design et mise en page — est la propriété exclusive de Distr&apos;Action SPRL
              ou de ses partenaires et est protégé par les lois belges et internationales
              relatives à la propriété intellectuelle.
            </p>
            <p className="text-sm sm:text-base">
              Toute reproduction, représentation, modification, publication, adaptation,
              totale ou partielle, de ces éléments, quel que soit le moyen ou le procédé
              utilisé, est interdite sans autorisation écrite préalable de Distr&apos;Action SPRL.
              Les contenus créés par les utilisateurs (textes de rêves, notes personnelles)
              restent leur propriété exclusive.
            </p>
          </section>

          {/* 5 - RGPD */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>5. Protection des données personnelles (RGPD)</span>
            </h2>
            <p className="text-sm sm:text-base mb-3">
              Conformément au Règlement (UE) 2016/679 du Parlement européen et du Conseil
              du 27 avril 2016 (Règlement Général sur la Protection des Données — RGPD)
              et à la loi belge du 30 juillet 2018 relative à la protection des personnes
              physiques à l&apos;égard des traitements de données à caractère personnel :
            </p>

            <h3 className="font-semibold text-sm sm:text-base mt-4 mb-2">
              5.1 Responsable du traitement
            </h3>
            <div className="space-y-1 text-sm sm:text-base mb-3">
              <p>Distr&apos;Action SPRL</p>
              <p>Chaussée Brunehault 27, 7041 Givry, Belgique</p>
              <p className="break-words">
                Délégué à la protection des données (DPO) :{" "}
                <a href="mailto:privacy@dreamoracle.eu" className="text-primary hover:underline">
                  privacy@dreamoracle.eu
                </a>
              </p>
            </div>

            <h3 className="font-semibold text-sm sm:text-base mt-4 mb-2">
              5.2 Données collectées et finalités
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-muted">
                    <th className="text-left p-2 font-semibold">Donnée</th>
                    <th className="text-left p-2 font-semibold">Finalité</th>
                    <th className="text-left p-2 font-semibold">Base légale</th>
                    <th className="text-left p-2 font-semibold">Durée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/50">
                  <tr>
                    <td className="p-2">Nom, email</td>
                    <td className="p-2">Gestion du compte</td>
                    <td className="p-2">Contrat</td>
                    <td className="p-2">Durée du compte + 3 ans</td>
                  </tr>
                  <tr>
                    <td className="p-2">Textes de rêves</td>
                    <td className="p-2">Fourniture du service</td>
                    <td className="p-2">Contrat</td>
                    <td className="p-2">Durée du compte</td>
                  </tr>
                  <tr>
                    <td className="p-2">Audio (transcription)</td>
                    <td className="p-2">Transcription vocale</td>
                    <td className="p-2">Contrat</td>
                    <td className="p-2">Supprimé immédiatement</td>
                  </tr>
                  <tr>
                    <td className="p-2">Date de naissance</td>
                    <td className="p-2">Calcul biorythmes</td>
                    <td className="p-2">Consentement</td>
                    <td className="p-2">Durée du compte</td>
                  </tr>
                  <tr>
                    <td className="p-2">Données de paiement</td>
                    <td className="p-2">Traitement des paiements</td>
                    <td className="p-2">Contrat</td>
                    <td className="p-2">Gérées par Stripe</td>
                  </tr>
                  <tr>
                    <td className="p-2">IP (anonymisée), navigateur</td>
                    <td className="p-2">Sécurité, statistiques</td>
                    <td className="p-2">Intérêt légitime</td>
                    <td className="p-2">12 mois</td>
                  </tr>
                  <tr>
                    <td className="p-2">Push subscription</td>
                    <td className="p-2">Notifications de rappel</td>
                    <td className="p-2">Consentement</td>
                    <td className="p-2">Jusqu&apos;au retrait</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="font-semibold text-sm sm:text-base mt-4 mb-2">
              5.3 Sous-traitants et transferts de données
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-muted">
                    <th className="text-left p-2 font-semibold">Sous-traitant</th>
                    <th className="text-left p-2 font-semibold">Finalité</th>
                    <th className="text-left p-2 font-semibold">Localisation</th>
                    <th className="text-left p-2 font-semibold">Garanties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/50">
                  <tr>
                    <td className="p-2">Hostinger</td>
                    <td className="p-2">Hébergement</td>
                    <td className="p-2">UE</td>
                    <td className="p-2">Serveurs UE</td>
                  </tr>
                  <tr>
                    <td className="p-2">Stripe</td>
                    <td className="p-2">Paiements</td>
                    <td className="p-2">UE / États-Unis</td>
                    <td className="p-2">EU-US Data Privacy Framework</td>
                  </tr>
                  <tr>
                    <td className="p-2">OpenRouter / OpenAI</td>
                    <td className="p-2">Interprétation IA</td>
                    <td className="p-2">États-Unis</td>
                    <td className="p-2">Clauses contractuelles types (CCT)</td>
                  </tr>
                  <tr>
                    <td className="p-2">ElevenLabs</td>
                    <td className="p-2">Transcription vocale</td>
                    <td className="p-2">États-Unis</td>
                    <td className="p-2">CCT, données supprimées après traitement</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground">
              Nous ne vendons, ne louons et ne partageons jamais vos données personnelles
              à des fins commerciales ou publicitaires.
            </p>

            <h3 className="font-semibold text-sm sm:text-base mt-4 mb-2">
              5.4 Vos droits
            </h3>
            <p className="text-sm sm:text-base mb-3">
              Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-sm sm:text-base">
              <li>
                <strong>Droit d&apos;accès</strong> (art. 15) — Obtenir confirmation que vos
                données sont traitées et en recevoir une copie
              </li>
              <li>
                <strong>Droit de rectification</strong> (art. 16) — Corriger des données
                inexactes ou incomplètes
              </li>
              <li>
                <strong>Droit à l&apos;effacement</strong> (art. 17) — Obtenir la suppression
                de vos données (&laquo; droit à l&apos;oubli &raquo;)
              </li>
              <li>
                <strong>Droit à la limitation</strong> (art. 18) — Restreindre le traitement
                de vos données
              </li>
              <li>
                <strong>Droit à la portabilité</strong> (art. 20) — Recevoir vos données dans
                un format structuré (JSON) et les transmettre à un autre responsable de traitement
              </li>
              <li>
                <strong>Droit d&apos;opposition</strong> (art. 21) — Vous opposer au traitement
                fondé sur l&apos;intérêt légitime
              </li>
              <li>
                <strong>Droit de retrait du consentement</strong> (art. 7) — Retirer votre
                consentement à tout moment, sans affecter la licéité du traitement antérieur
              </li>
            </ul>
            <p className="mt-3 text-sm sm:text-base">
              Pour exercer ces droits, vous pouvez :
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1 text-sm sm:text-base mt-2">
              <li>
                Utiliser les fonctions de votre{" "}
                <Link href="/settings" className="text-primary hover:underline">
                  espace Paramètres
                </Link>{" "}
                (export de données, suppression de compte)
              </li>
              <li>
                Contacter notre DPO à{" "}
                <a href="mailto:privacy@dreamoracle.eu" className="text-primary hover:underline">
                  privacy@dreamoracle.eu
                </a>
              </li>
            </ul>
            <p className="mt-3 text-sm sm:text-base">
              Nous répondrons à votre demande dans un délai maximum de <strong>30 jours</strong> conformément
              à l&apos;article 12 du RGPD.
            </p>

            <h3 className="font-semibold text-sm sm:text-base mt-4 mb-2">
              5.5 Réclamation
            </h3>
            <p className="text-sm sm:text-base">
              Si vous estimez que le traitement de vos données personnelles constitue une
              violation du RGPD, vous avez le droit d&apos;introduire une réclamation auprès de
              l&apos;autorité de contrôle compétente :
            </p>
            <div className="mt-3 p-3 sm:p-4 rounded-lg bg-muted/30 border border-muted text-sm sm:text-base space-y-1">
              <p><strong>Autorité de Protection des Données (APD)</strong></p>
              <p>Rue de la Presse 35, 1000 Bruxelles</p>
              <p>
                Tél. : +32 (0)2 274 48 00
              </p>
              <p className="break-words">
                Email :{" "}
                <a
                  href="mailto:contact@apd-gba.be"
                  className="text-primary hover:underline"
                >
                  contact@apd-gba.be
                </a>
              </p>
              <p className="break-words">
                Site web :{" "}
                <a
                  href="https://www.autoriteprotectiondonnees.be"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  www.autoriteprotectiondonnees.be
                </a>
              </p>
            </div>
          </section>

          {/* 6 - Cookies */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Cookie className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>6. Politique de cookies</span>
            </h2>
            <p className="text-sm sm:text-base mb-3">
              Conformément à la Directive 2002/58/CE (ePrivacy) transposée en droit belge
              par la loi du 13 juin 2005 relative aux communications électroniques,
              nous vous informons que DreamOracle utilise <strong>uniquement des cookies
              strictement nécessaires</strong> au fonctionnement du service :
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-muted">
                    <th className="text-left p-2 font-semibold">Cookie</th>
                    <th className="text-left p-2 font-semibold">Finalité</th>
                    <th className="text-left p-2 font-semibold">Durée</th>
                    <th className="text-left p-2 font-semibold">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/50">
                  <tr>
                    <td className="p-2 font-mono text-xs">next-auth.session-token</td>
                    <td className="p-2">Authentification et session</td>
                    <td className="p-2">Session / 30 jours</td>
                    <td className="p-2">Essentiel</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono text-xs">next-auth.csrf-token</td>
                    <td className="p-2">Protection CSRF</td>
                    <td className="p-2">Session</td>
                    <td className="p-2">Essentiel</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono text-xs">next-auth.callback-url</td>
                    <td className="p-2">Redirection après connexion</td>
                    <td className="p-2">Session</td>
                    <td className="p-2">Essentiel</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm sm:text-base">
              Ces cookies étant strictement nécessaires au fonctionnement du service, ils
              ne requièrent pas votre consentement préalable conformément à l&apos;article 129
              de la loi du 13 juin 2005. <strong>Nous n&apos;utilisons aucun cookie publicitaire,
              analytique ou de traçage tiers.</strong>
            </p>
          </section>

          {/* 7 - Limitation de responsabilité */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Scale className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>7. Limitation de responsabilité</span>
            </h2>
            <p className="text-sm sm:text-base mb-3">
              Les informations fournies sur le site DreamOracle le sont à titre purement
              informatif et de divertissement. Les interprétations de rêves et analyses
              de biorythmes sont générées par intelligence artificielle et <strong>ne
              constituent en aucun cas un avis médical, psychologique, thérapeutique ou
              professionnel</strong>.
            </p>
            <p className="text-sm sm:text-base mb-3">
              L&apos;éditeur s&apos;efforce d&apos;assurer l&apos;exactitude des informations diffusées
              sur le site, mais ne saurait garantir l&apos;exhaustivité, l&apos;exactitude ou
              l&apos;actualité de ces informations.
            </p>
            <p className="text-sm sm:text-base">
              L&apos;éditeur ne pourra être tenu responsable des dommages directs ou indirects
              résultant de l&apos;utilisation du site ou de l&apos;impossibilité d&apos;y accéder.
            </p>
          </section>

          {/* 8 - Liens hypertextes */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              8. Liens hypertextes
            </h2>
            <p className="text-sm sm:text-base">
              Le site DreamOracle peut contenir des liens hypertextes vers d&apos;autres sites
              web. L&apos;éditeur n&apos;exerce aucun contrôle sur le contenu de ces sites tiers et
              décline toute responsabilité quant à leur contenu ou aux pratiques de
              protection des données de ces sites.
            </p>
          </section>

          {/* 9 - Droit applicable */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              9. Droit applicable
            </h2>
            <p className="text-sm sm:text-base">
              Les présentes mentions légales sont régies par le droit belge. Tout litige
              relatif à l&apos;utilisation du site sera soumis à la compétence exclusive des
              tribunaux de l&apos;arrondissement judiciaire de Mons, sans préjudice du droit du
              consommateur de saisir le tribunal de son domicile.
            </p>
          </section>

          {/* 10 - Documents légaux */}
          <section className="dream-card p-4 sm:p-6 bg-primary/5">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>10. Documents juridiques</span>
            </h2>
            <p className="text-sm sm:text-base mb-3">
              Pour une information complète, veuillez également consulter :
            </p>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <Link href="/terms" className="text-primary hover:underline inline-flex items-center gap-1.5">
                  → Conditions Générales d&apos;Utilisation (CGU)
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="text-primary hover:underline inline-flex items-center gap-1.5">
                  → Conditions Générales de Vente (CGV)
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-primary hover:underline inline-flex items-center gap-1.5">
                  → Politique de Confidentialité
                </Link>
              </li>
            </ul>
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
                <a href="mailto:contact@dreamoracle.eu" className="text-primary hover:underline">
                  contact@dreamoracle.eu
                </a>
              </p>
              <p className="break-words">
                <strong>Protection des données (DPO) :</strong>{" "}
                <a href="mailto:privacy@dreamoracle.eu" className="text-primary hover:underline">
                  privacy@dreamoracle.eu
                </a>
              </p>
              <p className="break-words">
                <strong>Facturation :</strong>{" "}
                <a href="mailto:factures@distr-action.com" className="text-primary hover:underline">
                  factures@distr-action.com
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Links */}
        <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-4 justify-center text-xs sm:text-sm">
          <Link href="/terms" className="text-primary hover:underline px-2 py-1">
            CGU
          </Link>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <Link href="/cgv" className="text-primary hover:underline px-2 py-1">
            CGV
          </Link>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <Link href="/privacy" className="text-primary hover:underline px-2 py-1">
            Confidentialité
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
