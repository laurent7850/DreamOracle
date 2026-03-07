"use client";

import Link from "next/link";
import { ArrowLeft, Trash2, Mail, Shield, UserX, AlertTriangle, CheckCircle } from "lucide-react";
import { StarField } from "@/components/shared/StarField";

export default function DataDeletionPage() {
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
            <Trash2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-cinzel text-foreground leading-tight">
              Suppression des Données
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Instructions pour supprimer vos données personnelles de DreamOracle
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6 md:space-y-8 text-foreground/90">
          {/* Introduction */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Votre droit à l&apos;effacement</span>
            </h2>
            <p className="leading-relaxed text-sm sm:text-base">
              Conformément au Règlement Général sur la Protection des Données (RGPD),
              vous avez le droit de demander la suppression de toutes vos données
              personnelles stockées par DreamOracle. Nous nous engageons à traiter
              votre demande dans un délai de 30 jours.
            </p>
          </section>

          {/* Option 1: Via le compte */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <UserX className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Option 1 : Depuis votre compte</span>
            </h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Si vous avez accès à votre compte DreamOracle :
            </p>
            <ol className="list-decimal pl-5 sm:pl-6 space-y-2 text-sm sm:text-base">
              <li>Connectez-vous à votre compte sur <a href="https://dreamoracle.eu" className="text-primary hover:underline">dreamoracle.eu</a></li>
              <li>Accédez à <strong>Paramètres</strong> depuis le menu</li>
              <li>Cliquez sur l&apos;onglet <strong>Confidentialité</strong></li>
              <li>Cliquez sur <strong>&quot;Supprimer mon compte et toutes mes données&quot;</strong></li>
              <li>Confirmez la suppression</li>
            </ol>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
              La suppression est immédiate et irréversible. Toutes vos données seront effacées.
            </p>
          </section>

          {/* Option 2: Par email */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Option 2 : Par email</span>
            </h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Si vous ne pouvez pas accéder à votre compte, envoyez un email à :
            </p>
            <a
              href="mailto:privacy@dreamoracle.eu?subject=Demande%20de%20suppression%20de%20donn%C3%A9es"
              className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm sm:text-base break-all"
            >
              privacy@dreamoracle.eu
            </a>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base">
              Incluez dans votre email :
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-sm sm:text-base mt-2">
              <li>L&apos;adresse email associée à votre compte DreamOracle</li>
              <li>La mention <strong>&quot;Demande de suppression de données&quot;</strong> en objet</li>
              <li>Une confirmation que vous souhaitez supprimer définitivement toutes vos données</li>
            </ul>
          </section>

          {/* Données supprimées */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Données concernées</span>
            </h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              La suppression inclut :
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-sm sm:text-base">
              <li>Votre profil et informations de compte</li>
              <li>Tous vos rêves enregistrés et leurs interprétations</li>
              <li>Vos statistiques et données d&apos;utilisation</li>
              <li>Vos préférences et paramètres</li>
              <li>Votre historique de connexion</li>
              <li>Toute donnée liée à une connexion via Facebook ou Google</li>
            </ul>
          </section>

          {/* Avertissement */}
          <section className="dream-card p-4 sm:p-6 border-yellow-500/30">
            <h2 className="text-lg sm:text-xl font-cinzel text-yellow-400 mb-3 sm:mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Information importante</span>
            </h2>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base">
              <li>La suppression est <strong>définitive et irréversible</strong></li>
              <li>Vous ne pourrez pas récupérer vos rêves ou interprétations après la suppression</li>
              <li>Si vous avez un abonnement actif, pensez à le résilier avant de supprimer votre compte</li>
              <li>Le traitement de la demande par email prend un maximum de <strong>30 jours</strong></li>
              <li>Vous recevrez une confirmation par email une fois la suppression effectuée</li>
            </ul>
          </section>

          {/* Connexion Facebook */}
          <section className="dream-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-cinzel text-primary mb-3 sm:mb-4">
              Utilisateurs connectés via Facebook
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Si vous avez utilisé Facebook pour vous connecter à DreamOracle,
              la suppression de vos données sur DreamOracle ne supprime pas les
              données stockées par Facebook. Pour gérer vos données Facebook,
              rendez-vous dans les{" "}
              <a
                href="https://www.facebook.com/settings?tab=applications"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                paramètres de votre compte Facebook
              </a>.
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
                <strong>Protection des données (DPO) :</strong>{" "}
                <a
                  href="mailto:privacy@dreamoracle.eu"
                  className="text-primary hover:underline"
                >
                  privacy@dreamoracle.eu
                </a>
              </p>
              <p className="break-words">
                <strong>Questions générales :</strong>{" "}
                <a
                  href="mailto:contact@dreamoracle.eu"
                  className="text-primary hover:underline"
                >
                  contact@dreamoracle.eu
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Links */}
        <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-4 justify-center text-xs sm:text-sm">
          <Link href="/privacy" className="text-primary hover:underline px-2 py-1">
            Politique de confidentialité
          </Link>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <Link href="/terms" className="text-primary hover:underline px-2 py-1">
            Conditions d&apos;utilisation
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
