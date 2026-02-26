import type { Metadata } from "next";
import { FAQPageJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Tarifs - Plans et Abonnements",
  description:
    "Découvrez les plans DreamOracle : Rêveur (gratuit), Explorateur et Oracle+. Essai gratuit 7 jours, interprétation IA, transcription vocale, Dream Coach.",
  alternates: {
    canonical: "https://dreamoracle.eu/pricing",
  },
  openGraph: {
    title: "Tarifs DreamOracle - Plans et Abonnements",
    description:
      "Découvrez les plans DreamOracle. Essai gratuit 7 jours Oracle+, sans engagement.",
    url: "https://dreamoracle.eu/pricing",
  },
};

const faqQuestions = [
  {
    question: "Comment fonctionne l'essai gratuit de 7 jours ?",
    answer:
      "Chaque nouvel inscrit bénéficie automatiquement de 7 jours d'accès complet à Oracle+ (notre plan le plus complet) sans engagement et sans carte bancaire. À la fin des 7 jours, vous passez au plan Rêveur (gratuit) ou vous choisissez un abonnement payant.",
  },
  {
    question: "Comment fonctionne la transcription vocale ?",
    answer:
      "La transcription vocale vous permet de dicter vos rêves au réveil. Appuyez sur le bouton micro, parlez naturellement, et DreamOracle convertit votre voix en texte automatiquement.",
  },
  {
    question: "Qu'est-ce que le Dream Coach ?",
    answer:
      "Le Dream Coach est votre guide personnel dans l'exploration de vos rêves. Exclusif au plan Oracle+, il analyse l'ensemble de votre journal pour identifier des patterns et des thèmes récurrents.",
  },
  {
    question: "Puis-je changer de plan à tout moment ?",
    answer:
      "Oui, vous pouvez upgrader ou downgrader votre abonnement à tout moment. Les changements prennent effet immédiatement pour les upgrades, et à la fin de la période de facturation pour les downgrades.",
  },
  {
    question: "Que se passe-t-il si j'atteins ma limite mensuelle ?",
    answer:
      "Vous recevrez une notification et pourrez choisir de mettre à niveau votre plan ou d'attendre le renouvellement mensuel de vos crédits. Vos rêves enregistrés restent toujours accessibles.",
  },
  {
    question: "Y a-t-il un engagement ?",
    answer:
      "Non, aucun engagement ! Vous pouvez annuler votre abonnement à tout moment.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Absolument. Vos rêves sont privés et sécurisés. Nous ne partageons jamais vos données avec des tiers et vous pouvez les exporter ou les supprimer à tout moment.",
  },
];

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FAQPageJsonLd questions={faqQuestions} />
      {children}
    </>
  );
}
