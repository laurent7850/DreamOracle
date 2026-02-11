# API Reference - DreamOracle

Base URL: `https://dreamoracle.eu/api`

## Authentification

Toutes les routes protégées nécessitent une session NextAuth valide (cookie `next-auth.session-token`).

---

## Rêves

### GET /api/dreams

Liste les rêves de l'utilisateur connecté avec pagination.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Numéro de page |
| limit | number | 10 | Items par page (max 100) |
| search | string | - | Recherche dans titre/contenu |

**Response 200:**
```json
{
  "dreams": [
    {
      "id": "clx...",
      "title": "Vol au-dessus des nuages",
      "content": "Je volais...",
      "dreamDate": "2026-02-09T00:00:00.000Z",
      "emotions": ["joie", "liberté"],
      "symbols": ["nuages", "vol"],
      "lucidity": 3,
      "interpretation": "Ce rêve symbolise...",
      "tags": ["vol", "liberté"],
      "isRecurring": false,
      "mood": "positive",
      "sleepQuality": 4
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

---

### POST /api/dreams

Crée un nouveau rêve.

**Request Body:**
```json
{
  "title": "Mon rêve",
  "content": "Description du rêve (min 10 caractères)",
  "dreamDate": "2026-02-09",
  "emotions": ["joie"],
  "lucidity": 2,
  "mood": "positive",
  "sleepQuality": 4,
  "isRecurring": false,
  "tags": ["aventure"]
}
```

**Response 201:**
```json
{
  "id": "clx...",
  "title": "Mon rêve",
  "content": "Description...",
  "credits": {
    "used": 5,
    "limit": 10,
    "remaining": 5,
    "isUnlimited": false
  }
}
```

**Response 403 (crédits épuisés):**
```json
{
  "error": "Vous avez atteint votre limite mensuelle",
  "code": "CREDITS_EXHAUSTED",
  "tier": "FREE",
  "used": 10,
  "limit": 10,
  "upgradeRecommendation": "ESSENTIAL"
}
```

---

### GET /api/dreams/[id]

Récupère un rêve par son ID.

**Response 200:**
```json
{
  "id": "clx...",
  "title": "Mon rêve",
  "content": "...",
  "dreamDate": "2026-02-09T00:00:00.000Z",
  "emotions": ["joie"],
  "symbols": [],
  "lucidity": 2,
  "interpretation": null,
  "interpretedAt": null,
  "tags": [],
  "isRecurring": false,
  "mood": "positive",
  "sleepQuality": 4
}
```

---

### PATCH /api/dreams/[id]

Met à jour un rêve existant.

**Request Body (tous les champs optionnels):**
```json
{
  "title": "Nouveau titre",
  "content": "Nouveau contenu...",
  "dreamDate": "2026-02-09T00:00:00.000Z",
  "emotions": ["tristesse"],
  "symbols": ["eau", "lune"],
  "lucidity": 4,
  "interpretation": "Analyse...",
  "tags": ["récurrent"],
  "isRecurring": true,
  "mood": "neutre",
  "sleepQuality": 3
}
```

**Validations Zod:**
| Champ | Contraintes |
|-------|-------------|
| title | 1-200 caractères |
| content | 10-10000 caractères |
| emotions | max 20 items, 50 chars chacun |
| symbols | max 50 items, 100 chars chacun |
| tags | max 30 items, 50 chars chacun |
| interpretation | max 20000 caractères |
| lucidity | 0-5 |
| sleepQuality | 1-5 |

---

### DELETE /api/dreams/[id]

Supprime un rêve.

**Response 200:**
```json
{
  "message": "Rêve supprimé avec succès"
}
```

---

## Interprétation IA

### POST /api/interpret

Génère une interprétation IA du rêve via Claude (OpenRouter).

**Request Body:**
```json
{
  "dreamId": "clx...",
  "content": "Contenu du rêve...",
  "emotions": ["peur", "curiosité"],
  "style": "balanced"
}
```

**Styles disponibles:**
- `spiritual` - Interprétation ésotérique/symbolique
- `psychological` - Approche psychanalytique
- `balanced` - Mix des deux approches

**Response 200:**
```json
{
  "interpretation": "Votre rêve révèle...",
  "symbols": ["eau", "escalier", "lumière"],
  "credits": {
    "used": 3,
    "limit": 5,
    "remaining": 2
  }
}
```

---

## Transcription Vocale

### POST /api/transcribe

Transcrit un fichier audio en texte via ElevenLabs.

**Request:** `multipart/form-data`
| Field | Type | Description |
|-------|------|-------------|
| audio | File | Fichier audio |

**Contraintes:**
- Taille max: 25 MB
- Formats: webm, mp3, mpeg, wav, ogg, mp4, m4a
- Timeout: 30 secondes

**Response 200:**
```json
{
  "transcript": "J'ai rêvé que je volais...",
  "credits": {
    "used": 2,
    "limit": 3,
    "remaining": 1
  }
}
```

---

## Notifications Push

### GET /api/notifications/vapid-key

Récupère la clé publique VAPID pour s'abonner aux notifications.

**Response 200:**
```json
{
  "vapidPublicKey": "BL..."
}
```

---

### POST /api/notifications/subscribe

Enregistre un abonnement push.

**Request Body:**
```json
{
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    }
  }
}
```

---

### POST /api/notifications/send-reminders

**⚠️ Endpoint CRON - Nécessite `CRON_SECRET`**

Envoie les rappels matinaux aux utilisateurs.

**Headers:**
```
Authorization: Bearer {CRON_SECRET}
```

**Response 200:**
```json
{
  "success": true,
  "sent": 15,
  "failed": 2,
  "cleaned": 1,
  "time": "08:00"
}
```

---

## Stripe / Paiements

### POST /api/stripe/checkout

Crée une session de paiement Stripe.

**Request Body:**
```json
{
  "priceId": "price_..."
}
```

**Response 200:**
```json
{
  "sessionId": "cs_...",
  "url": "https://checkout.stripe.com/..."
}
```

---

### POST /api/stripe/portal

Redirige vers le portail client Stripe.

**Response 200:**
```json
{
  "url": "https://billing.stripe.com/..."
}
```

---

## Paramètres

### GET /api/settings

Récupère les paramètres utilisateur.

**Response 200:**
```json
{
  "interpretationStyle": "balanced",
  "language": "fr",
  "notificationsEnabled": true,
  "reminderTime": "08:00",
  "theme": "dark"
}
```

---

### PATCH /api/settings

Met à jour les paramètres.

**Request Body:**
```json
{
  "interpretationStyle": "psychological",
  "reminderTime": "07:30"
}
```

---

## Analytics

### GET /api/analytics

Statistiques de l'utilisateur.

**Response 200:**
```json
{
  "totalDreams": 42,
  "dreamsThisMonth": 8,
  "interpretedDreams": 35,
  "averageLucidity": 2.4,
  "topEmotions": [
    { "emotion": "joie", "count": 15 },
    { "emotion": "peur", "count": 10 }
  ],
  "topSymbols": [
    { "symbol": "eau", "count": 8 },
    { "symbol": "vol", "count": 6 }
  ],
  "dreamsByMonth": [
    { "month": "2026-01", "count": 12 },
    { "month": "2026-02", "count": 8 }
  ],
  "streak": {
    "current": 5,
    "longest": 12
  }
}
```

---

## Usage / Crédits

### GET /api/usage

Récupère l'utilisation des crédits.

**Response 200:**
```json
{
  "tier": "FREE",
  "dreams": { "used": 8, "limit": 10 },
  "interpretations": { "used": 4, "limit": 5 },
  "transcriptions": { "used": 1, "limit": 3 },
  "resetsAt": "2026-03-01T00:00:00.000Z"
}
```

---

## Codes d'erreur

| Code | Description |
|------|-------------|
| 400 | Requête invalide (validation échouée) |
| 401 | Non authentifié |
| 403 | Accès refusé / Crédits épuisés |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |
