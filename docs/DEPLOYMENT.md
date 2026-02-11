# Guide de Déploiement - DreamOracle

## Environnements

| Environnement | URL | Hébergement |
|---------------|-----|-------------|
| Production | https://dreamoracle.eu | Hostinger VPS |
| Local | http://localhost:3000 | Docker/npm |

---

## Déploiement Hostinger (Production)

### Prérequis
- VPS Hostinger avec Docker installé
- Traefik configuré comme reverse proxy
- Domaine pointé vers le VPS (enregistrement A)

### Configuration VPS

**ID VPS:** `767464`

### Commandes de gestion

```bash
# Lister les projets Docker
mcp__hostinger-mcp__VPS_getProjectListV1(virtualMachineId: 767464)

# Mettre à jour/redéployer
mcp__hostinger-mcp__VPS_updateProjectV1(virtualMachineId: 767464, projectName: "dreamoracle")

# Voir les logs
mcp__hostinger-mcp__VPS_getProjectLogsV1(virtualMachineId: 767464, projectName: "dreamoracle")

# Redémarrer le projet
mcp__hostinger-mcp__VPS_restartProjectV1(virtualMachineId: 767464, projectName: "dreamoracle")
```

### Processus de déploiement

1. **Push sur GitHub**
   ```bash
   git add .
   git commit -m "Description des changements"
   git push origin master
   ```

2. **Déclencher le redéploiement**
   - Via API Hostinger MCP
   - Ou manuellement via le panel Hostinger

3. **Vérifier les logs**
   - Attendre `✓ Compiled successfully`
   - Confirmer `✓ Ready in XXXms`

### Variables d'environnement (Production)

Configurées dans `.env` sur le serveur :

```env
# Database
DATABASE_URL="postgresql://dreamoracle:PASSWORD@postgres:5432/dreamoracle"

# Auth
NEXTAUTH_SECRET="super-secret-key"
NEXTAUTH_URL="https://dreamoracle.eu"

# IA
OPENROUTER_API_KEY="sk-or-v1-..."

# Transcription
ELEVENLABS_API_KEY="..."

# Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY="..."
VAPID_PRIVATE_KEY="..."
VAPID_SUBJECT="mailto:contact@dreamoracle.eu"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# CRON
CRON_SECRET="cron-secret-key"
```

### Docker Compose

```yaml
# docker-compose.hostinger.yml
version: "3.8"

services:
  dreamoracle:
    image: node:20-alpine
    working_dir: /app
    command: >
      sh -c "
        apk add --no-cache git &&
        git clone https://github.com/laurent7850/DreamOracle.git /app-tmp &&
        cp -r /app-tmp/* /app/ &&
        npm install &&
        npx prisma generate &&
        npx prisma db push &&
        npm run build &&
        npm start
      "
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    volumes:
      - app-data:/app
    depends_on:
      postgres:
        condition: service_healthy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.dreamoracle.rule=Host(`dreamoracle.eu`)"
      - "traefik.http.routers.dreamoracle.tls.certresolver=letsencrypt"
      - "traefik.http.services.dreamoracle.loadbalancer.server.port=3000"
    networks:
      - traefik
      - internal

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: dreamoracle
      POSTGRES_USER: dreamoracle
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dreamoracle"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - internal

volumes:
  app-data:
  postgres-data:

networks:
  traefik:
    external: true
  internal:
```

---

## Développement Local

### Avec npm (SQLite)

```bash
# Installation
npm install

# Configurer .env
cp .env.example .env

# Base de données SQLite
npx prisma generate
npx prisma db push

# Lancer
npm run dev
```

### Avec Docker (PostgreSQL)

```bash
# Démarrer les services
docker-compose up -d

# Voir les logs
docker-compose logs -f dreamoracle
```

### HTTPS local (requis pour PWA)

```bash
# Générer certificats
npx mkcert create-ca
npx mkcert create-cert

# Lancer avec HTTPS
npm run dev:https
```

---

## Tâches CRON

### Rappels quotidiens

Configurer un CRON pour appeler `/api/notifications/send-reminders` chaque minute :

```bash
* * * * * curl -X POST https://dreamoracle.eu/api/notifications/send-reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Maintenance base de données

Nettoyage hebdomadaire des sessions expirées :

```bash
0 3 * * 0 curl -X POST https://dreamoracle.eu/api/maintenance \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## Troubleshooting

### Build échoue

1. **Vérifier les imports Prisma**
   ```typescript
   // ✅ Correct
   import { prisma } from "@/lib/db"

   // ❌ Incorrect
   import { prisma } from "@/lib/prisma"
   ```

2. **Lancer le build localement**
   ```bash
   npm run build
   ```

3. **Vérifier les dépendances**
   ```bash
   npm install
   npx prisma generate
   ```

### Container redémarre en boucle

1. Vérifier les logs :
   ```
   mcp__hostinger-mcp__VPS_getProjectLogsV1(...)
   ```

2. Chercher les erreurs TypeScript ou import

3. Forcer un rebuild :
   ```
   mcp__hostinger-mcp__VPS_updateProjectV1(...)
   ```

### Push notifications ne fonctionnent pas

1. Vérifier que les clés VAPID sont configurées :
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`

2. Générer de nouvelles clés :
   ```bash
   npx web-push generate-vapid-keys
   ```

3. Vérifier les logs pour le warning VAPID

### Base de données inaccessible

1. Vérifier que PostgreSQL est healthy :
   ```
   mcp__hostinger-mcp__VPS_getProjectContainersV1(...)
   ```

2. Vérifier `DATABASE_URL` dans `.env`

3. Exécuter les migrations :
   ```bash
   npx prisma db push
   ```

---

## Monitoring

### Logs applicatifs
- Via Hostinger MCP : `VPS_getProjectLogsV1`
- Via Docker : `docker-compose logs -f`

### Métriques
- Maintenance quotidienne : `/api/maintenance`
- Stats utilisateurs : `/api/analytics`

### Alertes
- Erreurs push notifications (410 = subscription expirée)
- Build failures
- Database connection errors
