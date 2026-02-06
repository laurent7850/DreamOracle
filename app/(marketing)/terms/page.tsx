"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Scale, Shield, Mail } from "lucide-react";
import { StarField } from "@/components/shared/StarField";

export default function TermsPage() {
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
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-cinzel text-foreground">
              Conditions Générales d&apos;Utilisation
            </h1>
          </div>
          <p className="text-muted-foreground">Dernière mise à jour : 6 février 2026</p>
        </div>

        <div className="space-y-8 text-foreground/90">
          {/* Article 1 */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4 flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Article 1 - Objet
            </h2>
            <p className="leading-relaxed">
              Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;utilisation
              du service DreamOracle, une application web d&apos;enregistrement et d&apos;interprétation
              de rêves par intelligence artificielle, accessible à l&apos;adresse
              <a href="https://dreamoracle.eu" className="text-primary hover:underline ml-1">
                dreamoracle.eu
              </a>.
            </p>
          </section>

          {/* Article 2 */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4">Article 2 - Éditeur du service</h2>
            <div className="space-y-2">
              <p><strong>Raison sociale :</strong> Distr&apos;Action SRL</p>
              <p><strong>Siège social :</strong> Belgique</p>
              <p><strong>Email :</strong> contact@dreamoracle.eu</p>
              <p><strong>Numéro d&apos;entreprise :</strong> À compléter</p>
            </div>
          </section>

          {/* Article 3 */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4">Article 3 - Description du service</h2>
            <p className="mb-4">DreamOracle propose les fonctionnalités suivantes :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Enregistrement et stockage sécurisé de vos rêves</li>
              <li>Interprétation des rêves par intelligence artificielle</li>
              <li>Transcription vocale de vos récits de rêves</li>
              <li>Suivi statistique et calendrier de vos rêves</li>
              <li>Export de vos données personnelles</li>
            </ul>
          </section>

          {/* Article 4 */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4">Article 4 - Inscription et compte utilisateur</h2>
            <p className="mb-4">
              L&apos;accès au service nécessite la création d&apos;un compte utilisateur.
              L&apos;utilisateur s&apos;engage à fournir des informations exactes et à maintenir
              la confidentialité de ses identifiants de connexion.
            </p>
            <p>
              L&apos;utilisateur est seul responsable de toute activité effectuée depuis son compte.
            </p>
          </section>

          {/* Article 5 */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4">Article 5 - Abonnements et tarification</h2>
            <p className="mb-4">DreamOracle propose trois formules :</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Rêveur (Gratuit) :</strong> 5 rêves/mois, 2 interprétations/mois</li>
              <li><strong>Explorateur (4,99€/mois) :</strong> Rêves illimités, 15 interprétations/mois</li>
              <li><strong>Oracle (9,99€/mois) :</strong> Toutes fonctionnalités illimitées</li>
            </ul>
            <p>
              Les prix sont indiqués en euros TTC. Les abonnements sont renouvelés automatiquement
              sauf résiliation par l&apos;utilisateur via son espace de gestion.
            </p>
          </section>

          {/* Article 6 */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4">Article 6 - Droit de rétractation</h2>
            <p className="mb-4">
              Conformément à l&apos;article VI.47 du Code de droit économique belge, l&apos;utilisateur
              dispose d&apos;un délai de 14 jours à compter de la souscription pour exercer son droit
              de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
            </p>
            <p>
              Pour exercer ce droit, contactez-nous à{" "}
              <a href="mailto:contact@dreamoracle.eu" className="text-primary hover:underline">
                contact@dreamoracle.eu
              </a>
            </p>
          </section>

          {/* Article 7 */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Article 7 - Protection des données personnelles
            </h2>
            <p className="mb-4">
              Conformément au Règlement Général sur la Protection des Données (RGPD),
              DreamOracle s&apos;engage à protéger vos données personnelles.
            </p>
            <p className="mb-4">Vos droits :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Droit d&apos;accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement (&quot;droit à l&apos;oubli&quot;)</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d&apos;opposition au traitement</li>
            </ul>
            <p className="mt-4">
              Pour toute demande, contactez notre DPO à{" "}
              <a href="mailto:privacy@dreamoracle.eu" className="text-primary hover:underline">
                privacy@dreamoracle.eu
              </a>
            </p>
          </section>

          {/* Article 8 */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4">Article 8 - Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des éléments du site DreamOracle (textes, images, logo, design)
              sont protégés par le droit d&apos;auteur. Toute reproduction est interdite sans
              autorisation préalable. Les contenus générés par l&apos;utilisateur (rêves, textes)
              restent sa propriété exclusive.
            </p>
          </section>

          {/* Article 9 */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4">Article 9 - Limitation de responsabilité</h2>
            <p className="mb-4">
              Les interprétations fournies par DreamOracle sont générées par intelligence
              artificielle à titre informatif et de divertissement uniquement. Elles ne
              constituent en aucun cas un avis médical, psychologique ou professionnel.
            </p>
            <p>
              DreamOracle ne saurait être tenu responsable de l&apos;utilisation faite de ces
              interprétations par l&apos;utilisateur.
            </p>
          </section>

          {/* Article 10 */}
          <section className="dream-card p-6">
            <h2 className="text-xl font-cinzel text-primary mb-4">Article 10 - Droit applicable</h2>
            <p>
              Les présentes CGU sont soumises au droit belge. En cas de litige, les tribunaux
              de Bruxelles seront seuls compétents, sauf disposition légale contraire en faveur
              du consommateur.
            </p>
          </section>

          {/* Contact */}
          <section className="dream-card p-6 bg-primary/5">
            <h2 className="text-xl font-cinzel text-primary mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact
            </h2>
            <p>
              Pour toute question relative aux présentes CGU, vous pouvez nous contacter à :{" "}
              <a href="mailto:contact@dreamoracle.eu" className="text-primary hover:underline">
                contact@dreamoracle.eu
              </a>
            </p>
          </section>
        </div>

        {/* Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
          <Link href="/privacy" className="text-primary hover:underline">
            Politique de confidentialité
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
