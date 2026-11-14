# 🌙 DreamOracle

**Application d'interprétation des rêves avec IA** - Explorez les mystères de votre subconscient.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8)](https://web.dev/progressive-web-apps/)

🔗 **Production**: [dreamoracle.eu](https://dreamoracle.eu)

---

## ✨ Fonctionnalités

### Journal de rêves
- 📝 Enregistrez vos rêves avec titre, contenu et métadonnées
- 🎭 Taguez les émotions ressenties
- 🌟 Évaluez le niveau de lucidité (0-5)
- 🔄 Marquez les rêves récurrents
- 😴 Notez la qualité de sommeil

### Interprétation IA
- 🧠 Analyse symbolique et psychologique via Claude (OpenRouter)
- 🔮 Trois styles : Spirituel, Psychologique, Équilibré
- 🏷️ Extraction automatique des symboles clés

### Transcription vocale
- 🎙️ Dictez vos rêves au réveil
- 🗣️ Conversion voix → texte via ElevenLabs
- ⚡ Transcription instantanée

### PWA & Notifications
- 📱 Installable sur mobile et desktop
- 🔔 Rappels matinaux personnalisables
- 📴 Mode hors-ligne (service worker)

### Statistiques
- 📊 Graphiques d'émotions et lucidité
- ☁️ Nuage de symboles récurrents
- 📅 Heatmap d'activité
- 🔥 Suivi des séries (streaks)

### Abonnements
- 💳 Paiements sécurisés via Stripe
- 📈 3 tiers : Free, Essential, Premium
- 💰 Système de crédits mensuels

---

## 🛠️ Stack Technique

| Couche | Technologies |
|--------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui |
| **Animations** | Framer Motion |
| **State** | Zustand |
| **Backend** | Next.js API Routes |
| **Auth** | NextAuth.js v5 |
| **Database** | Prisma ORM, PostgreSQL |
| **IA** | OpenRouter API (Claude) |
| **Voix** | ElevenLabs API |
| **Paiements** | Stripe |
| **PWA** | Manifest, service worker `sw-push.js`, Web Push |
| **Déploiement** | Docker, Traefik, Hostinger VPS |

---

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/laurent7850/DreamOracle.git
cd DreamOracle

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Initialiser la base de données
npx prisma generate
npx prisma db push

# Lancer en développement
npm run dev
```

---

## ⚙️ Variables d'Environnement

```env
# Database PostgreSQL
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="votre-secret-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# OpenRouter API (interprétation IA)
OPENROUTER_API_KEY="sk-or-..."

# ElevenLabs (transcription vocale) - optionnel
ELEVENLABS_API_KEY="..."

# Push Notifications - optionnel
NEXT_PUBLIC_VAPID_PUBLIC_KEY="..."
VAPID_PRIVATE_KEY="..."

# Stripe (paiements) - optionnel
STRIPE_SECRET_KEY="sk_..."
```

Voir `.env.example` pour la liste complète.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture technique complète |
| [docs/API.md](docs/API.md) | Documentation API REST |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Guide de déploiement |
| [CHANGELOG.md](CHANGELOG.md) | Historique des changements |

---

## 🚢 Déploiement

### Vercel (recommandé pour débuter)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/laurent7850/DreamOracle)

1. Connectez votre repo GitHub à Vercel
2. Ajoutez une base de données PostgreSQL
3. Configurez les variables d'environnement
4. Déployez

### Hostinger VPS (production)

L'application est déployée sur un VPS Hostinger avec Docker Compose et Traefik.

Voir [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) pour le guide complet.

**URL de production**: https://dreamoracle.eu

---

## 🔐 Sécurité

- ✅ Authentification NextAuth.js avec sessions sécurisées
- ✅ Validation Zod sur tous les endpoints PATCH/POST
- ✅ Protection CRON avec secret obligatoire
- ✅ Limite de pagination (max 100 items)
- ✅ Validation taille/type fichiers audio
- ✅ Signature Stripe pour webhooks

---

## 📱 PWA

DreamOracle est une Progressive Web App complète :

- **Installation** : Ajoutez à l'écran d'accueil depuis le navigateur
- **Notifications** : Rappels matinaux configurables
- **Raccourcis** : "Nouveau rêve" et "Mes rêves" depuis l'icône
- **Hors-ligne** : Service worker pour mode déconnecté

---

## 📄 Licence

MIT © 2026 Laurent
