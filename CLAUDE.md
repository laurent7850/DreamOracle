# DreamOracle - Instructions Claude Code

## Branches Git

- **`develop`** : branche de travail (par défaut). Tous les commits de dev vont ici.
- **`master`** : branche de production. Ne jamais commit directement — uniquement via merge depuis `develop`.

## Déploiement Production

1. Merger `develop` → `master` et push
2. Redéployer via : `VPS_updateProjectV1(virtualMachineId: 767464, projectName: "dreamoracle")`
3. Vérifier les logs : `VPS_getProjectLogsV1(virtualMachineId: 767464, projectName: "dreamoracle")`

## Stack

- Next.js 16 + React 19 + TypeScript
- Prisma ORM (SQLite dev / PostgreSQL prod)
- NextAuth.js v5 (JWT)
- Tailwind CSS 4 + shadcn/ui
- OpenRouter API (Claude Sonnet 4) pour l'interprétation IA
- Stripe pour les paiements
- PWA avec service worker

## Architecture Auth & Trial

- Deux chemins d'inscription : credentials (`/api/register`) et Google OAuth (`lib/auth.ts` signIn callback)
- Les deux activent l'essai Oracle+ 7j — toute modification trial doit couvrir les deux
- UTM tracking : `UTMCapture` component (layout racine) → sessionStorage + cookies → lu par les deux flux
- Trial lifecycle events dans table `TrialEvent` : trial_started → trial_converted | trial_expired
- CRON expiration trial : POST `/api/trial/expire` (protégé par CRON_SECRET)

## Email Funnel (Trial Nurturing)

- Séquence 4 emails automatiques pour convertir les utilisateurs trial → payants
- Templates + logique d'envoi : `lib/funnel-emails.ts`
- Modèle `FunnelEmail` en DB : `@@unique([userId, step])` anti-duplicatas
- **Jour 0** : envoyé inline à l'inscription (credentials + Google OAuth) — fire-and-forget
- **Jours 1, 3, 4** : envoyés par CRON quotidien POST `/api/emails/funnel` (protégé par CRON_SECRET)
- Jour 4 contient code promo -30% annuel (`FUNNEL_PROMO_CODE` env var, défaut: `ORACLE2026`)
- Les emails ne sont envoyés qu'aux users en trial (pas encore convertis en payants)
- Toute modification trial/inscription doit aussi vérifier l'impact sur le funnel

## Admin CRM

- Page admin : `app/(admin)/admin/page.tsx` — stats cards, revenue, trial funnel, users table
- APIs admin : `/api/admin/stats`, `/api/admin/trial-analytics`, `/api/admin/users`
- Interface `Stats` dans la page admin doit matcher la réponse de `/api/admin/stats`

## Gotchas Next.js 16

- `useSearchParams()` requiert `<Suspense>` boundary sinon build fail (prerender error)
- `cookies()` de `next/headers` est async (requiert `await`)
- Prisma dev : `npx prisma db push` (pas migrate dev — SQLite)

## Conventions

- UI en français
- Commits en anglais
- Prisma schema prod : `prisma/schema.prod.prisma`
- Fichiers statiques : `public/`
- Composants par feature : `components/{feature}/`
