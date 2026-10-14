"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  Scale,
  Shield,
  CreditCard,
  RefreshCw,
  AlertTriangle,
  Mail,
  Gavel,
} from "lucide-react";
import { StarField } from "@/components/shared/StarField";

export default function CGVPage() {
  return (
    <div className="min-h-screen relative">
      <StarField />

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
            <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-cinzel text-foreground leading-tight">
              Conditions Générales de Vente
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Dernière mise à jour : 17 février 2026
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6 md:space-y-8 text-foreground/90">
          {/* Préambule */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Préambule
            </h2>
            <p className="leading-relaxed text-sm sm:text-base">
              Les présentes Conditions Générales de Vente (CGV) s&apos;appliquent à toute
              souscription d&apos;un abonnement payant au service DreamOracle, une application
              web d&apos;enregistrement et d&apos;interprétation de rêves accessible à l&apos;adresse{" "}
              <a
                href="https://dreamoracle.eu"
                className="text-primary hover:underline break-all"
              >
                dreamoracle.eu
              </a>
              . En souscrivant à un abonnement, le client déclare avoir pris connaissance
              et accepté sans réserve les présentes CGV.
            </p>
          </section>

          {/* Article 1 - Vendeur */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Scale className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Article 1 - Identification du vendeur</span>
            </h2>
            <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <p className="break-words">
                <strong>Raison sociale :</strong> Distr&apos;Action SPRL
              </p>
              <p className="break-words">
                <strong>Siège social :</strong> Chaussée Brunehault 27, 7041 Givry, Belgique
              </p>
              <p className="break-words">
                <strong>Numéro d&apos;entreprise :</strong> 0462.122.648
              </p>
              <p>
                <strong>Numéro TVA :</strong> BE 0462.122.648
              </p>
              <p className="break-words">
                <strong>Email :</strong>{" "}
                <a
                  href="mailto:contact@dreamoracle.eu"
                  className="text-primary hover:underline"
                >
                  contact@dreamoracle.eu
                </a>
              </p>
            </div>
          </section>

          {/* Article 2 - Objet */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Article 2 - Objet
            </h2>
            <p className="text-sm sm:text-base mb-3">
              Les présentes CGV régissent la vente d&apos;abonnements au service en ligne
              DreamOracle, un logiciel accessible en mode SaaS (Software as a Service)
              proposant les fonctionnalités suivantes :
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Enregistrement et stockage sécurisé de rêves</li>
              <li>Interprétation des rêves par intelligence artificielle</li>
              <li>Transcription vocale des récits de rêves</li>
              <li>Calcul et analyse de biorythmes</li>
              <li>Coaching onirique personnalisé (Dream Coach)</li>
              <li>Dictionnaire des symboles et détection de patterns</li>
              <li>Statistiques et calendrier des rêves</li>
              <li>Export de données en PDF</li>
            </ul>
          </section>

          {/* Article 3 - Offres et tarifs */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Article 3 - Offres et tarifs</span>
            </h2>
            <p className="text-sm sm:text-base mb-4">
              DreamOracle propose trois formules d&apos;abonnement :
            </p>

            <div className="space-y-4">
              {/* Rêveur */}
              <div className="p-3 sm:p-4 rounded-lg bg-muted/30 border border-muted">
                <h3 className="font-semibold text-sm sm:text-base mb-1">
                  🌙 Rêveur — Gratuit
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Journal de rêves illimité, 3 interprétations Oracle par mois,
                  calendrier des rêves, statistiques de base, biorythme de base.
                </p>
              </div>

              {/* Explorateur */}
              <div className="p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h3 className="font-semibold text-sm sm:text-base mb-1">
                  🔭 Explorateur — 7,99 €/mois ou 59,88 €/an (4,99 €/mois)
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Tout de Rêveur + 10 interprétations Oracle par mois, transcription vocale illimitée,
                  détection des patterns récurrents, statistiques avancées, biorythme détaillé,
                  notifications de rappel, export PDF (10/mois).
                </p>
              </div>

              {/* Oracle+ */}
              <div className="p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h3 className="font-semibold text-sm sm:text-base mb-1">
                  ✨ Oracle+ — 13,99 €/mois ou 109,88 €/an (9,16 €/mois)
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Tout de Explorateur + interprétations illimitées, transcription vocale illimitée,
                  Dream Coach personnalisé, dictionnaire des symboles, rapport mensuel,
                  thèmes personnalisés, sauvegarde cloud, support prioritaire, export PDF illimité.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm sm:text-base">
              <p>
                Tous les prix sont indiqués en euros (€), <strong>toutes taxes comprises (TTC)</strong>,
                incluant la TVA belge au taux de 21%.
              </p>
              <p>
                Le vendeur se réserve le droit de modifier ses tarifs à tout moment. Les
                modifications tarifiques s&apos;appliqueront à compter du renouvellement suivant
                de l&apos;abonnement, avec un préavis de 30 jours notifié par email.
              </p>
              <p>
                Les tarifs en vigueur sont consultables à tout moment sur la page{" "}
                <Link href="/pricing" className="text-primary hover:underline">
                  Tarifs
                </Link>.
              </p>
            </div>
          </section>

          {/* Article 4 - Commande */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Article 4 - Processus de commande
            </h2>
            <p className="text-sm sm:text-base mb-3">
              La souscription à un abonnement payant s&apos;effectue selon les étapes suivantes :
            </p>
            <ol className="list-decimal pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Création d&apos;un compte utilisateur sur dreamoracle.eu</li>
              <li>Choix de la formule d&apos;abonnement (Explorateur ou Oracle+)</li>
              <li>Choix de la périodicité (mensuelle ou annuelle)</li>
              <li>Redirection vers la plateforme de paiement sécurisée Stripe</li>
              <li>Confirmation du paiement et activation immédiate de l&apos;abonnement</li>
            </ol>
            <p className="mt-3 text-sm sm:text-base">
              La validation du paiement vaut acceptation des présentes CGV. Un email de
              confirmation accompagné d&apos;une facture est envoyé au client après chaque paiement.
            </p>
          </section>

          {/* Article 5 - Paiement */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Article 5 - Modalités de paiement
            </h2>
            <p className="text-sm sm:text-base mb-3">
              Le paiement s&apos;effectue par carte bancaire (Visa, Mastercard, etc.) via la
              plateforme sécurisée Stripe. Les données de paiement sont directement traitées
              par Stripe et ne sont jamais stockées sur nos serveurs.
            </p>
            <p className="text-sm sm:text-base mb-3">
              Le paiement est exigible au moment de la souscription, puis à chaque date
              d&apos;anniversaire de l&apos;abonnement (mensuel ou annuel) en cas de renouvellement
              automatique.
            </p>
            <p className="text-sm sm:text-base">
              En cas d&apos;échec de paiement lors du renouvellement, l&apos;abonnement est suspendu.
              Le client dispose d&apos;un délai de 7 jours pour régulariser sa situation avant la
              résiliation automatique de l&apos;abonnement.
            </p>
          </section>

          {/* Article 6 - Facturation */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Article 6 - Facturation
            </h2>
            <p className="text-sm sm:text-base mb-3">
              Une facture conforme à la législation belge est générée automatiquement après
              chaque paiement réussi et envoyée au client par email. Chaque facture mentionne :
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1 text-sm sm:text-base">
              <li>Le numéro de facture séquentiel</li>
              <li>La date de facturation</li>
              <li>L&apos;identification du vendeur (raison sociale, adresse, numéro TVA)</li>
              <li>La description du service</li>
              <li>Le montant hors TVA, le taux de TVA (21%) et le montant TTC</li>
            </ul>
            <p className="mt-3 text-sm sm:text-base">
              Les factures sont également consultables et téléchargeables depuis l&apos;espace
              client dans la section{" "}
              <Link href="/settings" className="text-primary hover:underline">
                Paramètres
              </Link>.
            </p>
          </section>

          {/* Article 7 - Durée et renouvellement */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Article 7 - Durée, renouvellement et résiliation</span>
            </h2>

            <h3 className="font-semibold text-sm sm:text-base mt-3 mb-2">7.1 Durée</h3>
            <p className="text-sm sm:text-base mb-3">
              L&apos;abonnement est souscrit pour une durée d&apos;un mois ou d&apos;un an, selon le choix
              du client.
            </p>

            <h3 className="font-semibold text-sm sm:text-base mt-3 mb-2">7.2 Renouvellement automatique</h3>
            <p className="text-sm sm:text-base mb-3">
              Sauf résiliation par le client, l&apos;abonnement est renouvelé automatiquement
              à chaque échéance pour une durée identique. Le client est informé par email
              avant chaque renouvellement.
            </p>

            <h3 className="font-semibold text-sm sm:text-base mt-3 mb-2">7.3 Résiliation</h3>
            <p className="text-sm sm:text-base mb-3">
              Le client peut résilier son abonnement à tout moment depuis son espace de
              gestion (portail Stripe) ou en contactant le service client. La résiliation
              prend effet à la fin de la période en cours : le client conserve l&apos;accès à
              ses fonctionnalités payantes jusqu&apos;à l&apos;expiration de la période déjà payée.
            </p>
            <p className="text-sm sm:text-base">
              À l&apos;expiration, le compte est automatiquement rétrogradé vers la formule
              gratuite (Rêveur). Les données du client (rêves, interprétations) sont
              conservées et restent accessibles.
            </p>
          </section>

          {/* Article 8 - Droit de rétractation */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Article 8 - Droit de rétractation</span>
            </h2>
            <p className="text-sm sm:text-base mb-3">
              Conformément aux articles VI.47 et suivants du Code de droit économique belge
              et à la Directive européenne 2011/83/UE, le consommateur dispose d&apos;un délai de{" "}
              <strong>14 jours calendrier</strong> à compter de la date de souscription pour
              exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer
              de pénalités.
            </p>
            <p className="text-sm sm:text-base mb-3">
              Pour exercer ce droit, le client peut :
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1 text-sm sm:text-base mb-3">
              <li>
                Envoyer un email à{" "}
                <a
                  href="mailto:contact@dreamoracle.eu"
                  className="text-primary hover:underline"
                >
                  contact@dreamoracle.eu
                </a>{" "}
                en indiquant clairement sa volonté de se rétracter
              </li>
              <li>
                Utiliser le formulaire de rétractation type disponible en annexe
              </li>
            </ul>
            <p className="text-sm sm:text-base mb-3">
              En cas de rétractation, le vendeur rembourse le client dans un délai maximum
              de 14 jours à compter de la réception de la demande, en utilisant le même
              moyen de paiement que celui utilisé pour la transaction initiale.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground italic">
              <strong>Exception :</strong> Conformément à l&apos;article VI.53, 13° du Code de
              droit économique, le droit de rétractation ne peut être exercé si le client
              a expressément consenti au début de l&apos;exécution du service pendant le délai
              de rétractation et a reconnu perdre son droit de rétractation.
            </p>
          </section>

          {/* Article 9 - Accès au service */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Article 9 - Accès au service et disponibilité
            </h2>
            <p className="text-sm sm:text-base mb-3">
              Le service DreamOracle est accessible 24 heures sur 24, 7 jours sur 7, sous
              réserve des opérations de maintenance planifiées ou d&apos;urgence.
            </p>
            <p className="text-sm sm:text-base mb-3">
              Le vendeur s&apos;engage à mettre en œuvre tous les moyens raisonnables pour assurer
              la disponibilité et le bon fonctionnement du service. Toutefois, le service
              étant fourni via Internet, le vendeur ne peut garantir une disponibilité
              ininterrompue et ne saurait être tenu responsable des interruptions liées à :
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1 text-sm sm:text-base">
              <li>Des problèmes de connexion Internet du client</li>
              <li>Des opérations de maintenance nécessaires</li>
              <li>Des cas de force majeure (panne réseau, catastrophe naturelle, etc.)</li>
              <li>Des défaillances imputables à des prestataires tiers</li>
            </ul>
          </section>

          {/* Article 10 - Responsabilité */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Article 10 - Limitation de responsabilité</span>
            </h2>

            <h3 className="font-semibold text-sm sm:text-base mt-3 mb-2">10.1 Nature du service</h3>
            <p className="text-sm sm:text-base mb-3">
              Les interprétations de rêves et les analyses fournies par DreamOracle sont
              générées par intelligence artificielle à titre <strong>informatif et de
              divertissement uniquement</strong>. Elles ne constituent en aucun cas un avis
              médical, psychologique, thérapeutique ou professionnel. L&apos;utilisateur est
              invité à consulter un professionnel de santé qualifié pour toute problématique
              personnelle.
            </p>

            <h3 className="font-semibold text-sm sm:text-base mt-3 mb-2">10.2 Responsabilité du vendeur</h3>
            <p className="text-sm sm:text-base mb-3">
              La responsabilité du vendeur est limitée au montant des sommes effectivement
              perçues au titre de l&apos;abonnement au cours des 12 derniers mois. Le vendeur
              ne saurait être tenu responsable des dommages indirects, tels que perte de
              données, perte de profits ou préjudice moral, dans les limites autorisées
              par le droit belge.
            </p>

            <h3 className="font-semibold text-sm sm:text-base mt-3 mb-2">10.3 Obligations du client</h3>
            <p className="text-sm sm:text-base">
              Le client s&apos;engage à utiliser le service conformément à sa destination et
              aux présentes CGV. Il est seul responsable de la confidentialité de ses
              identifiants de connexion et de l&apos;utilisation qui est faite de son compte.
            </p>
          </section>

          {/* Article 11 - Propriété intellectuelle */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Article 11 - Propriété intellectuelle
            </h2>
            <p className="text-sm sm:text-base mb-3">
              L&apos;ensemble des éléments du service DreamOracle (logiciel, design, textes,
              images, logo, algorithmes) sont protégés par le droit d&apos;auteur et restent
              la propriété exclusive de Distr&apos;Action SPRL. Toute reproduction, représentation
              ou exploitation non autorisée est interdite.
            </p>
            <p className="text-sm sm:text-base">
              Les contenus créés par le client (textes de rêves, notes) restent sa propriété
              exclusive. Le vendeur ne revendique aucun droit de propriété intellectuelle
              sur ces contenus et ne les utilise pas à d&apos;autres fins que la fourniture du
              service.
            </p>
          </section>

          {/* Article 12 - Protection des données */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Article 12 - Protection des données personnelles</span>
            </h2>
            <p className="text-sm sm:text-base mb-3">
              Le traitement des données personnelles est effectué conformément au Règlement
              Général sur la Protection des Données (RGPD - Règlement UE 2016/679) et à
              la loi belge du 30 juillet 2018 relative à la protection des personnes
              physiques à l&apos;égard des traitements de données à caractère personnel.
            </p>
            <p className="text-sm sm:text-base">
              Pour plus de détails sur la collecte, le traitement et la protection de vos
              données, veuillez consulter notre{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Politique de Confidentialité
              </Link>.
            </p>
          </section>

          {/* Article 13 - Réclamation et médiation */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Article 13 - Réclamations et médiation
            </h2>
            <p className="text-sm sm:text-base mb-3">
              Pour toute réclamation relative à l&apos;utilisation du service ou à un
              abonnement, le client peut contacter le service client à l&apos;adresse{" "}
              <a
                href="mailto:contact@dreamoracle.eu"
                className="text-primary hover:underline"
              >
                contact@dreamoracle.eu
              </a>
              . Nous nous engageons à traiter toute réclamation dans un délai de 30 jours.
            </p>
            <p className="text-sm sm:text-base mb-3">
              Conformément aux articles XVI.1 et suivants du Code de droit économique,
              en cas de litige non résolu, le consommateur peut recourir gratuitement au
              Service de Médiation pour le Consommateur :
            </p>
            <div className="p-3 sm:p-4 rounded-lg bg-muted/30 border border-muted text-sm sm:text-base space-y-1">
              <p><strong>Service de Médiation pour le Consommateur</strong></p>
              <p>Boulevard du Roi Albert II 8, bte 1, 1000 Bruxelles</p>
              <p>
                Site web :{" "}
                <a
                  href="https://www.mediationconsommateur.be"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all"
                >
                  www.mediationconsommateur.be
                </a>
              </p>
            </div>
            <p className="mt-3 text-sm sm:text-base">
              Le consommateur peut également utiliser la plateforme européenne de Règlement
              en Ligne des Litiges (RLL) :{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
          </section>

          {/* Article 14 - Force majeure */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Article 14 - Force majeure
            </h2>
            <p className="text-sm sm:text-base">
              Le vendeur ne pourra être tenu responsable de l&apos;inexécution totale ou
              partielle de ses obligations si cette inexécution est provoquée par un
              événement de force majeure, incluant notamment : catastrophes naturelles,
              guerres, grèves, pannes de réseau Internet, décisions gouvernementales,
              pannes chez les prestataires d&apos;hébergement ou de paiement. En cas de force
              majeure, les obligations du vendeur sont suspendues pour toute la durée de
              l&apos;événement.
            </p>
          </section>

          {/* Article 15 - Modifications */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Article 15 - Modification des CGV
            </h2>
            <p className="text-sm sm:text-base">
              Le vendeur se réserve le droit de modifier les présentes CGV à tout moment.
              Les modifications seront notifiées au client par email et/ou par notification
              dans l&apos;application au moins 30 jours avant leur entrée en vigueur. Si le
              client n&apos;accepte pas les nouvelles conditions, il peut résilier son abonnement
              avant l&apos;entrée en vigueur des modifications. La poursuite de l&apos;utilisation du
              service après l&apos;entrée en vigueur des modifications vaut acceptation des
              nouvelles CGV.
            </p>
          </section>

          {/* Article 16 - Droit applicable */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Gavel className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Article 16 - Droit applicable et juridiction compétente</span>
            </h2>
            <p className="text-sm sm:text-base mb-3">
              Les présentes CGV sont régies par le droit belge, en particulier le Code de
              droit économique (Livre VI - Pratiques du marché et protection du consommateur)
              et le Code civil.
            </p>
            <p className="text-sm sm:text-base">
              En cas de litige, les parties s&apos;efforceront de trouver une solution amiable.
              À défaut, les tribunaux de l&apos;arrondissement judiciaire de Mons seront
              compétents, sans préjudice du droit du consommateur de saisir le tribunal
              de son domicile conformément aux règles européennes de compétence.
            </p>
          </section>

          {/* Annexe - Formulaire de rétractation */}
          <section className="dream-card p-4 sm:p-6 border-primary/20">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Annexe - Formulaire type de rétractation
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-3 italic">
              (Veuillez compléter et renvoyer le présent formulaire uniquement si vous
              souhaitez vous rétracter du contrat)
            </p>
            <div className="p-3 sm:p-4 rounded-lg bg-muted/30 border border-muted text-sm sm:text-base space-y-2">
              <p>
                À l&apos;attention de : Distr&apos;Action SPRL, Chaussée Brunehault 27, 7041 Givry,
                Belgique — contact@dreamoracle.eu
              </p>
              <p>
                Je vous notifie par la présente ma rétractation du contrat portant sur la
                prestation de service DreamOracle :
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Commandé le / reçu le : _______________</li>
                <li>Nom du consommateur : _______________</li>
                <li>Adresse email du compte : _______________</li>
                <li>Date : _______________</li>
                <li>Signature (en cas de formulaire papier) : _______________</li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="dream-card p-4 sm:p-6 bg-primary/5">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Contact</span>
            </h2>
            <div className="space-y-2 text-sm sm:text-base">
              <p className="break-words">
                <strong>Service client :</strong>{" "}
                <a
                  href="mailto:contact@dreamoracle.eu"
                  className="text-primary hover:underline"
                >
                  contact@dreamoracle.eu
                </a>
              </p>
              <p className="break-words">
                <strong>Facturation :</strong>{" "}
                <a
                  href="mailto:factures@distr-action.com"
                  className="text-primary hover:underline"
                >
                  factures@distr-action.com
                </a>
              </p>
              <p className="break-words">
                <strong>Protection des données :</strong>{" "}
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
          <Link href="/privacy" className="text-primary hover:underline px-2 py-1">
            Politique de confidentialité
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
