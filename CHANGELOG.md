# Changelog

Tous les changements notables de DreamOracle sont documentés dans ce fichier.

## [Unreleased]

## [2026-02-09] - Security & UX Improvements

### Sécurité

#### CRON_SECRET obligatoire
- **Fichier**: `app/api/notifications/send-reminders/route.ts`
- **Avant**: Le secret CRON était optionnel (`if (cronSecret && ...)`)
- **Après**: Le secret est maintenant requis (`if (!cronSecret || ...)`)
- **Impact**: L'endpoint de rappels ne peut plus être appelé sans authentification

#### Validation des fichiers audio (API Transcription)
- **Fichier**: `app/api/transcribe/route.ts`
- **Ajouts**:
  - Limite de taille: 25 MB maximum
  - Validation MIME type: `audio/webm`, `audio/mp3`, `audio/mpeg`, `audio/wav`, `audio/ogg`, `audio/mp4`, `audio/m4a`
  - Timeout de 30 secondes sur l'appel ElevenLabs API
- **Impact**: Protection contre les uploads malveillants et les timeouts

#### Validation Zod pour PATCH /api/dreams/[id]
- **Fichier**: `app/api/dreams/[id]/route.ts`
- **Ajouts**: Schéma de validation avec limites:
  - `title`: max 200 caractères
  - `content`: 10-10000 caractères
  - `emotions`: max 20 items, 50 chars chacun
  - `symbols`: max 50 items, 100 chars chacun
  - `tags`: max 30 items, 50 chars chacun
  - `interpretation`: max 20000 caractères
- **Impact**: Protection contre les payloads malformés

#### Limite de pagination
- **Fichier**: `app/api/dreams/route.ts`
- **Modification**: `limit` est maintenant borné entre 1 et 100
- **Impact**: Protection contre les requêtes de masse

### UX Mobile

#### Padding horizontal sur pages Analytics et Settings
- **Fichiers**:
  - `app/(dashboard)/analytics/page.tsx`
  - `app/(dashboard)/settings/page.tsx`
- **Modification**: Ajout de `px-3 sm:px-4 md:px-0` au conteneur principal
- **Impact**: Les cartes ne débordent plus sur mobile

### PWA

#### Nettoyage du manifest
- **Fichier**: `public/manifest.json`
- **Modification**: Suppression des références aux screenshots inexistants
- **Impact**: Pas d'erreurs 404 lors de l'installation PWA

#### Warning VAPID keys
- **Fichier**: `lib/web-push.ts`
- **Modification**: Avertissement console en production si clés VAPID non configurées
- **Impact**: Meilleure visibilité des problèmes de configuration

### Navigation Mobile

#### Menu "Plus" extensible
- **Fichier**: `components/layout/MobileNav.tsx`
- **Ajouts**:
  - Bouton "Plus" avec menu déroulant
  - Options manquantes: Calendrier, Statistiques, Aide, Plans, Installer l'app
  - Bouton de déconnexion dans le menu
  - Overlay pour fermer le menu
- **Impact**: Parité de fonctionnalités entre desktop et mobile

---

## [2026-02-07] - Bug Fixes

### Fix: Import Prisma incorrect
- **Fichier**: `app/api/admin/check-duplicates/route.ts`
- **Avant**: `import { prisma } from "@/lib/prisma"`
- **Après**: `import { prisma } from "@/lib/db"`
- **Impact**: Le build de production ne crashait plus en boucle

---

## Fichiers modifiés (2026-02-09)

| Fichier | Type de changement |
|---------|-------------------|
| `app/api/notifications/send-reminders/route.ts` | Sécurité |
| `app/api/transcribe/route.ts` | Sécurité |
| `app/api/dreams/[id]/route.ts` | Sécurité |
| `app/api/dreams/route.ts` | Sécurité |
| `app/(dashboard)/analytics/page.tsx` | UX |
| `app/(dashboard)/settings/page.tsx` | UX |
| `components/layout/MobileNav.tsx` | UX |
| `lib/web-push.ts` | Configuration |
| `public/manifest.json` | PWA |
