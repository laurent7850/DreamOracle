export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DreamOracle",
    url: "https://dreamoracle.eu",
    logo: "https://dreamoracle.eu/icons/icon-512x512.png",
    description:
      "Application d'interprétation de rêves par intelligence artificielle. Journal de rêves, analyse onirique et coaching personnalisé.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@dreamoracle.eu",
      contactType: "customer support",
      availableLanguage: "French",
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebApplicationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DreamOracle",
    url: "https://dreamoracle.eu",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    description:
      "Journal de rêves intelligent avec interprétation par IA. Enregistrez, analysez et comprenez vos rêves grâce à l'Oracle.",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        name: "Rêveur - Gratuit",
      },
      {
        "@type": "Offer",
        price: "4.99",
        priceCurrency: "EUR",
        name: "Explorateur",
        billingIncrement: "P1M",
      },
      {
        "@type": "Offer",
        price: "9.99",
        priceCurrency: "EUR",
        name: "Oracle+",
        billingIncrement: "P1M",
      },
    ],
    featureList:
      "Journal de rêves, Interprétation IA, Transcription vocale, Dream Coach, Biorythme, Statistiques",
    inLanguage: "fr",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQPageJsonLd({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
