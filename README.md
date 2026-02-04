# DreamOracle

Application d'interprétation des rêves avec IA - Explorez les mystères de votre subconscient.

## Fonctionnalités

- **Journal de rêves** - Enregistrez vos rêves avec émotions, tags et niveau de lucidité
- **Interprétation IA** - Analyse symbolique et psychologique via Claude (OpenRouter)
- **Thème ésotérique** - Interface mystique avec animations et effets visuels
- **Statistiques** - Suivez vos patterns de rêves et symboles récurrents
- **Multi-style** - Interprétations spirituelles, psychologiques ou équilibrées

## Stack Technique

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Vercel Postgres / Neon)
- **Auth**: NextAuth.js v5
- **AI**: OpenRouter API (Claude)

## Installation

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

## Variables d'Environnement

```env
# Database PostgreSQL
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="votre-secret"
NEXTAUTH_URL="http://localhost:3000"

# OpenRouter API
OPENROUTER_API_KEY="sk-or-..."
```

## Déploiement Vercel

1. Connectez votre repo GitHub à Vercel
2. Ajoutez une base de données PostgreSQL (Vercel Postgres ou Neon)
3. Configurez les variables d'environnement
4. Déployez

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/laurent7850/DreamOracle)

## Déploiement Hostinger (VPS avec Docker)

L'application peut être déployée sur un VPS Hostinger avec Docker Compose et Traefik.

### Prérequis
- VPS Hostinger avec Docker et Traefik configurés
- Domaine pointant vers le VPS (enregistrement A)

### Configuration

1. Copier le fichier d'exemple:
```bash
cp .env.hostinger.example .env.hostinger
```

2. Remplir les variables dans `.env.hostinger`:
```env
DB_PASSWORD=your-secure-database-password
NEXTAUTH_SECRET=your-nextauth-secret
OPENROUTER_API_KEY=sk-or-v1-your-api-key
```

3. Déployer via l'API Hostinger ou manuellement avec `docker-compose.hostinger.yml`.

### URL de production
- https://dreamoracle.eu

## Licence

MIT
