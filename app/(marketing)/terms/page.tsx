"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Scale, Shield, Mail } from "lucide-react";
import { StarField } from "@/components/shared/StarField";

export default function TermsPage() {
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
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-cinzel text-foreground leading-tight">
              Conditions Générales d&apos;Utilisation
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Dernière mise à jour : 6 février 2026
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6 md:space-y-8 text-foreground/90">
          {/* Article 1 */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Scale className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Article 1 - Objet</span>
            </h2>
            <p className="leading-relaxed text-sm sm:text-base">
              Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;utilisation
              du service DreamOracle, une application web d&apos;enregistrement et d&apos;interprétation
              de rêves, accessible à l&apos;adresse{" "}
              <a
                href="https://dreamoracle.eu"
                className="text-primary hover:underline break-all"
              >
                dreamoracle.eu
              </a>.
            </p>
          </section>

          {/* Article 2 */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Article 2 - Éditeur du service
            </h2>
            <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <p className="break-words">
                <strong>Raison sociale :</strong> Distr&apos;Action SPRL
              </p>
              <p className="break-words">
                <strong>Siège social :</strong> Chaussée Brunehault 27, 7041 Givry, Belgique
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
              <p><strong>Numéro TVA :</strong> BE 0462.122.648</p>
            </div>
          </section>

          {/* Article 3 */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Article 3 - Description du service
            </h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              DreamOracle propose les fonctionnalités suivantes :
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Enregistrement et stockage sécurisé de vos rêves</li>
              <li>Interprétation des rêves par l&apos;Oracle</li>
              <li>Transcription vocale de vos récits de rêves</li>
              <li>Suivi statistique et calendrier de vos rêves</li>
              <li>Export de vos données personnelles</li>
            </ul>
          </section>

          {/* Article 4 */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Article 4 - Inscription et compte utilisateur
            </h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              L&apos;accès au service nécessite la création d&apos;un compte utilisateur.
              L&apos;utilisateur s&apos;engage à fournir des informations exactes et à maintenir
              la confidentialité de ses identifiants de connexion.
            </p>
            <p className="text-sm sm:text-base">
              L&apos;utilisateur est seul responsable de toute activité effectuée depuis son compte.
            </p>
          </section>

          {/* Article 5 */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Article 5 - Abonnements et tarification
            </h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              DreamOracle propose trois formules :
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-sm sm:text-base">
              <li>
                <strong>Rêveur (Gratuit) :</strong> 5 rêves/mois, 2 interprétations/mois
              </li>
              <li>
                <strong>Explorateur (4,99€/mois) :</strong> Rêves illimités, 15 interprétations/mois
              </li>
              <li>
                <strong>Oracle (9,99€/mois) :</strong> Toutes fonctionnalités illimitées
              </li>
            </ul>
            <p className="text-sm sm:text-base">
              Les prix sont indiqués en euros TTC. Les abonnements sont renouvelés automatiquement
              sauf résiliation par l&apos;utilisateur via son espace de gestion.
            </p>
          </section>

          {/* Article 6 */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Article 6 - Droit de rétractation
            </h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Conformément à l&apos;article VI.47 du Code de droit économique belge, l&apos;utilisateur
              dispose d&apos;un délai de 14 jours à compter de la souscription pour exercer son droit
              de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
            </p>
            <p className="text-sm sm:text-base">
              Pour exercer ce droit, contactez-nous à{" "}
              <a
                href="mailto:contact@dreamoracle.eu"
                className="text-primary hover:underline break-all"
              >
                contact@dreamoracle.eu
              </a>
            </p>
          </section>

          {/* Article 7 */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Article 7 - Protection des données personnelles</span>
            </h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Conformément au Règlement Général sur la Protection des Données (RGPD),
              DreamOracle s&apos;engage à protéger vos données personnelles.
            </p>
            <p className="mb-2 sm:mb-4 text-sm sm:text-base">Vos droits :</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1 sm:space-y-2 text-sm sm:text-base">
              <li>Droit d&apos;accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement (&quot;droit à l&apos;oubli&quot;)</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d&apos;opposition au traitement</li>
            </ul>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base">
              Pour toute demande, contactez notre DPO à{" "}
              <a
                href="mailto:privacy@dreamoracle.eu"
                className="text-primary hover:underline break-all"
              >
                privacy@dreamoracle.eu
              </a>
            </p>
          </section>

          {/* Article 8 */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Article 8 - Propriété intellectuelle
            </h2>
            <p className="text-sm sm:text-base">
              L&apos;ensemble des éléments du site DreamOracle (textes, images, logo, design)
              sont protégés par le droit d&apos;auteur. Toute reproduction est interdite sans
              autorisation préalable. Les contenus générés par l&apos;utilisateur (rêves, textes)
              restent sa propriété exclusive.
            </p>
          </section>

          {/* Article 9 */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Article 9 - Limitation de responsabilité
            </h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Les interprétations fournies par DreamOracle sont générées par intelligence
              artificielle à titre informatif et de divertissement uniquement. Elles ne
              constituent en aucun cas un avis médical, psychologique ou professionnel.
            </p>
            <p className="text-sm sm:text-base">
              DreamOracle ne saurait être tenu responsable de l&apos;utilisation faite de ces
              interprétations par l&apos;utilisateur.
            </p>
          </section>

          {/* Article 10 */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Article 10 - Droit applicable
            </h2>
            <p className="text-sm sm:text-base">
              Les présentes CGU sont soumises au droit belge. En cas de litige, les tribunaux
              de Bruxelles seront seuls compétents, sauf disposition légale contraire en faveur
              du consommateur.
            </p>
          </section>

          {/* Contact */}
          <section className="dream-card p-4 sm:p-6 bg-primary/5">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Contact</span>
            </h2>
            <p className="text-sm sm:text-base">
              Pour toute question relative aux présentes CGU, vous pouvez nous contacter à :{" "}
              <a
                href="mailto:contact@dreamoracle.eu"
                className="text-primary hover:underline break-all"
              >
                contact@dreamoracle.eu
              </a>
            </p>
          </section>
        </div>

        {/* Links */}
        <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-4 justify-center text-xs sm:text-sm">
          <Link href="/privacy" className="text-primary hover:underline px-2 py-1">
            Politique de confidentialité
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
