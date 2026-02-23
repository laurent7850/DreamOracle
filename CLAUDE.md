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

## Conventions

- UI en français
- Commits en anglais
- Prisma schema prod : `prisma/schema.prod.prisma`
- Fichiers statiques : `public/`
- Composants par feature : `components/{feature}/`
