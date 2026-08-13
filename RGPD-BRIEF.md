# Brief RGPD — traceurs deposes sans consentement

**Constat etabli le 13 aout 2026**, en conditions reelles : navigateur vierge, aucun cookie
prealable, aucune interaction. Verification menee depuis une session sur le projet AutoSEO.

---

## Ce qui a ete mesure

Au chargement de `https://dreamoracle.eu`, **avant tout clic** :

```
gtag                  : charge et actif
dataLayer             : 4 entrees
scripts charges       : googletagmanager.com/gtag/js?id=G-43MDBYPN9M
cookies deposes       : _ga , _ga_43MDBYPN9M , _fbp
banniere de consentement : AUCUNE
consentement stocke   : aucun (localStorage vide de toute cle de consentement)
```

`_ga` et `_ga_43MDBYPN9M` sont les cookies Google Analytics. **`_fbp` est le cookie
publicitaire de Meta** — un traceur de ciblage, pas de simple mesure d'audience.

## Ou, dans le code

```
app/layout.tsx:118    <MetaPixel />                                   ← aucune condition
app/layout.tsx:120    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
components/tracking/MetaPixel.tsx    <Script strategy="afterInteractive">  PIXEL_ID = '1422623571851790'
```

Les deux composants se montent inconditionnellement. La seule "condition" presente porte sur
l'existence de la variable d'environnement, pas sur un consentement utilisateur.

## Pourquoi c'est un probleme

La directive ePrivacy, transposee en droit belge, impose un consentement **prealable** pour
tout traceur non strictement necessaire au service. Mesure d'audience et pixel publicitaire
en font partie. Le consentement doit etre libre, specifique, eclaire et univoque : un depot
au chargement ne remplit aucun de ces criteres.

Deux facteurs aggravants propres a ce site :

1. **La nature des donnees.** Le service traite des recits de reves, susceptibles de reveler
   des elements de sante mentale ou de vie intime. Meme si les traceurs ne transmettent pas
   le contenu des reves, la seule frequentation d'un service d'interpretation onirique est un
   signal en soi — transmis ici a Meta a des fins publicitaires.
2. **Le pixel Meta**, qui alimente un ecosysteme publicitaire tiers, pese plus lourd qu'une
   mesure d'audience interne.

Note : ce brief decrit un constat technique et le remede standard. La qualification precise
au regard de l'article 9 RGPD (donnees sensibles) depasse ce cadre — a faire confirmer par un
DPO avant toute communication publique ou reponse a une reclamation.

---

## A corriger

### 1. Bloquer par defaut, charger apres consentement

Aucun traceur ne doit se charger tant que l'utilisateur n'a pas accepte. Concretement :
`<MetaPixel />` et `<GoogleAnalytics />` ne doivent etre montes que si un consentement
"analytics" (respectivement "marketing") a ete donne et persiste.

Le projet **AInspiration** a deja ce motif dans `src/components/Analytics.tsx` : le tag n'est
charge qu'apres acceptation. C'est la reference a reprendre — inutile de reinventer.

### 2. Banniere de consentement

- Refus aussi accessible que l'acceptation (un seul clic pour tout refuser)
- Choix granulaire : mesure d'audience et marketing separes
- Choix persiste et relu au chargement suivant
- Possibilite de revenir sur son choix (lien permanent en pied de page)
- Aucun traceur avant action explicite ; l'absence de reponse vaut refus

### 3. Politique de confidentialite

Elle doit lister les traceurs reellement deposes, leur finalite, leur duree et les
destinataires — dont Meta pour `_fbp`. A verifier : la page actuelle mentionne-t-elle le
pixel Meta ?

### 4. Option intermediaire, si le chantier ne peut pas etre mene tout de suite

Retirer purement et simplement `<MetaPixel />` du layout. Le pixel publicitaire est le
traceur le plus expose et le moins indispensable au fonctionnement du service ; le supprimer
reduit l'exposition en une ligne, sans attendre la banniere complete.

---

## Verification

Dans un navigateur vierge, sans interagir avec la page, executer en console :

```js
JSON.stringify({
  gtag: typeof window.gtag,
  cookies: document.cookie.split(';').map(c => c.trim().split('=')[0]),
  fbq: typeof window.fbq
})
```

**Attendu apres correction** : `gtag: "undefined"`, `fbq: "undefined"`, et aucun cookie
`_ga`, `_ga_*` ou `_fbp`. Ces valeurs ne doivent apparaitre qu'apres acceptation explicite.

---

## Contexte

- Propriete GA4 : `properties/526223523`, mesure `G-43MDBYPN9M`. Elle collecte reellement
  (13 vues sur 30 jours) — c'est le seul des quatre sites Distr'Action dans ce cas, et
  precisement parce qu'il ne demande rien.
- Les sites AInspiration, Distr'Action et Audityo conditionnent (ou conditionneront) leur
  mesure au consentement. DreamOracle est l'exception a aligner.
