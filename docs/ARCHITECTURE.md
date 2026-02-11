# Architecture Technique - DreamOracle

## Vue d'ensemble

DreamOracle est une Progressive Web App (PWA) de journal de rêves avec interprétation IA, construite avec Next.js 16 et déployée sur Hostinger VPS via Docker.

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  Next.js 16 + React 19 + Tailwind CSS + shadcn/ui              │
│  ├── PWA (next-pwa)                                            │
│  ├── Framer Motion (animations)                                │
│  └── Zustand (state management)                                │
├─────────────────────────────────────────────────────────────────┤
│                         BACKEND                                  │
│  Next.js API Routes                                             │
│  ├── NextAuth.js v5 (authentification)                         │
│  ├── Prisma ORM (base de données)                              │
│  ├── Stripe (paiements)                                        │
│  └── Web Push (notifications)                                  │
├─────────────────────────────────────────────────────────────────┤
│                      SERVICES EXTERNES                          │
│  ├── OpenRouter API (Claude - interprétation IA)               │
│  ├── ElevenLabs API (transcription vocale)                     │
│  └── Stripe (abonnements)                                      │
├─────────────────────────────────────────────────────────────────┤
│                      INFRASTRUCTURE                              │
│  Hostinger VPS + Docker Compose + Traefik + PostgreSQL         │
└─────────────────────────────────────────────────────────────────┘
```

## Structure des dossiers

```
dream-oracle/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Routes authentification
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Routes protégées
│   │   ├── analytics/            # Statistiques
│   │   ├── calendar/             # Calendrier des rêves
│   │   ├── dashboard/            # Tableau de bord
│   │   ├── dreams/               # CRUD rêves
│   │   │   ├── [id]/             # Détail rêve
│   │   │   └── new/              # Nouveau rêve
│   │   ├── help/                 # Aide
│   │   └── settings/             # Paramètres
│   ├── (marketing)/              # Pages publiques
│   │   ├── pricing/
│   │   ├── privacy/
│   │   └── terms/
│   ├── api/                      # API Routes
│   │   ├── admin/                # Endpoints admin
│   │   ├── analytics/            # Stats utilisateur
│   │   ├── auth/                 # NextAuth
│   │   ├── dreams/               # CRUD rêves
│   │   ├── interpret/            # Interprétation IA
│   │   ├── maintenance/          # Nettoyage DB
│   │   ├── notifications/        # Push notifications
│   │   ├── register/             # Inscription
│   │   ├── settings/             # Paramètres user
│   │   ├── stripe/               # Paiements
│   │   ├── transcribe/           # Voix -> texte
│   │   └── usage/                # Crédits/limites
│   ├── layout.tsx
│   └── page.tsx                  # Landing page
├── components/
│   ├── analytics/                # Graphiques stats
│   ├── calendar/                 # Calendrier
│   ├── dream/                    # Composants rêves
│   ├── layout/                   # Navigation
│   ├── notifications/            # Push settings
│   ├── pwa/                      # Installation PWA
│   ├── shared/                   # Composants partagés
│   ├── subscription/             # Abonnements
│   └── ui/                       # shadcn/ui
├── lib/                          # Utilitaires
│   ├── auth.ts                   # Config NextAuth
│   ├── credits.ts                # Système de crédits
│   ├── db.ts                     # Client Prisma
│   ├── stripe.ts                 # Config Stripe
│   └── web-push.ts               # Notifications
├── prisma/
│   └── schema.prisma             # Schéma DB
├── public/
│   ├── icons/                    # Icônes PWA
│   ├── manifest.json             # PWA manifest
│   └── sw.js                     # Service Worker
└── docs/                         # Documentation
```

## Base de données

### Modèles Prisma

```
┌──────────────┐     ┌─────────────────┐     ┌────────────────┐
│     User     │────<│      Dream      │     │  UserSettings  │
├──────────────┤     ├─────────────────┤     ├────────────────┤
│ id           │     │ id              │     │ id             │
│ email        │     │ userId (FK)     │     │ userId (FK)    │
│ name         │     │ title           │     │ style          │
│ password     │     │ content         │     │ language       │
│ subscription │     │ dreamDate       │     │ notifications  │
│ stripeId     │     │ emotions[]      │     │ reminderTime   │
└──────────────┘     │ symbols[]       │     │ theme          │
       │             │ lucidity        │     └────────────────┘
       │             │ interpretation  │
       │             │ tags[]          │
       │             └─────────────────┘
       │
       ├─────────<│ Account (OAuth)
       ├─────────<│ Session
       ├─────────<│ UsageLog
       └─────────<│ PushSubscription
```

### Tiers d'abonnement

| Tier | Rêves/mois | Interprétations/mois | Transcriptions/mois |
|------|------------|---------------------|---------------------|
| FREE | 10 | 5 | 3 |
| ESSENTIAL | 50 | 30 | 20 |
| PREMIUM | Illimité | Illimité | Illimité |

## API Endpoints

### Authentification
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Inscription |
| * | `/api/auth/[...nextauth]` | NextAuth handlers |

### Rêves
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/dreams` | Liste paginée | ✅ |
| POST | `/api/dreams` | Créer un rêve | ✅ |
| GET | `/api/dreams/[id]` | Détail rêve | ✅ |
| PATCH | `/api/dreams/[id]` | Modifier rêve | ✅ |
| DELETE | `/api/dreams/[id]` | Supprimer rêve | ✅ |

### IA & Transcription
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/interpret` | Interprétation IA | ✅ |
| POST | `/api/transcribe` | Voix → Texte | ✅ |

### Notifications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/notifications/subscribe` | S'abonner push | ✅ |
| GET | `/api/notifications/vapid-key` | Clé publique | - |
| POST | `/api/notifications/send-reminders` | CRON rappels | CRON_SECRET |
| POST | `/api/notifications/test` | Test push | ✅ |

### Paiements Stripe
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/stripe/checkout` | Créer session | ✅ |
| POST | `/api/stripe/portal` | Portal client | ✅ |
| POST | `/api/stripe/webhook` | Webhooks Stripe | Signature |

### Autres
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/analytics` | Stats utilisateur | ✅ |
| GET/PATCH | `/api/settings` | Paramètres | ✅ |
| GET | `/api/usage` | Crédits restants | ✅ |
| POST | `/api/maintenance` | Nettoyage DB | CRON_SECRET |

## Sécurité

### Validations implémentées

1. **API Dreams PATCH** - Schéma Zod avec limites :
   - title: 1-200 caractères
   - content: 10-10000 caractères
   - emotions: max 20 items
   - tags: max 30 items

2. **API Transcribe** :
   - Taille fichier: max 25 MB
   - Types MIME: audio/webm, mp3, wav, ogg, mp4, m4a
   - Timeout: 30 secondes

3. **Pagination** :
   - Limite max: 100 items par page

4. **CRON endpoints** :
   - Secret obligatoire via `CRON_SECRET`

### Headers de sécurité
- Authentification: Bearer token (NextAuth)
- CRON: `Authorization: Bearer {CRON_SECRET}`
- Stripe Webhooks: Signature verification

## PWA

### Fonctionnalités
- Installation sur mobile/desktop
- Notifications push (rappels matinaux)
- Mode hors-ligne (service worker)
- Raccourcis: "Nouveau rêve", "Mes rêves"

### Configuration
```json
// manifest.json
{
  "name": "DreamOracle - Journal de Rêves",
  "short_name": "DreamOracle",
  "start_url": "/dashboard",
  "display": "standalone",
  "theme_color": "#d4af37"
}
```

## Déploiement

### Docker Compose (Production)
```yaml
services:
  dreamoracle:
    image: node:20-alpine
    # Build from GitHub, run Prisma, start Next.js

  postgres:
    image: postgres:16-alpine
    # Base de données persistante
```

### Traefik (Reverse Proxy)
- SSL automatique via Let's Encrypt
- Routing par domaine
- Health checks

### CI/CD
1. Push sur `master`
2. Hostinger pull depuis GitHub
3. Docker rebuild
4. Prisma migrate
5. Next.js build & start

## Performance

### Optimisations
- Turbopack pour le build
- Images optimisées (Next.js Image)
- Static generation pour pages marketing
- Dynamic rendering pour pages auth

### Métriques
- Build time: ~20s
- Start time: ~100ms
- Lighthouse PWA: 100
