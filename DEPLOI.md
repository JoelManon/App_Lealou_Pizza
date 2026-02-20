# Guide de déploiement — Lealou Pizza

Ce guide vous aide à déployer l'application sur un **serveur gratuit** en utilisant Docker.

## Plateformes gratuites compatibles

| Plateforme | Avantages | Limites gratuites |
|------------|-----------|-------------------|
| **Render** | Simple, supporte Docker | 750 h/mois, mise en veille après inactivité |
| **Railway** | Très facile | 5$ de crédit/mois |
| **Fly.io** | Performant | 3 VM partagées gratuites |

---

## Option 1 : Render (recommandé)

1. **Créez un compte** sur [render.com](https://render.com)

2. **Poussez votre code** sur GitHub (si ce n'est pas déjà fait)

3. Sur Render : **New** → **Web Service**

4. Connectez votre dépôt GitHub et sélectionnez le projet

5. **Configuration** :
   - **Name** : `lealou-pizza`
   - **Region** : choisissez le plus proche (ex. Frankfurt)
   - **Root Directory** : laissez vide (racine du projet)
   - **Environment** : `Docker`
   - **Instance Type** : Free

6. **Variables d'environnement** (optionnel) :
   - `NODE_ENV` = `production`
   - `PORT` = `3000` (Render le définit automatiquement en général)

7. Cliquez sur **Create Web Service**

Votre app sera disponible à : `https://lealou-pizza.onrender.com`

⚠️ **Note** : En mode gratuit, Render met le service en veille après ~15 min d'inactivité. Le premier chargement après veille peut prendre 30–60 secondes.

---

## Option 2 : Railway

1. **Créez un compte** sur [railway.app](https://railway.app)

2. **New Project** → **Deploy from GitHub repo**

3. Sélectionnez votre dépôt

4. Railway détecte automatiquement le `Dockerfile`. Cliquez sur **Deploy**

5. Une fois déployé : **Settings** → **Generate Domain** pour obtenir une URL publique

---

## Option 3 : Fly.io

1. **Installez le CLI** : [fly.io/docs/hands-on/install-flyctl](https://fly.io/docs/hands-on/install-flyctl/)

2. **Connectez-vous** :
   ```bash
   fly auth login
   ```

3. **Lancez l'app** (à la racine du projet) :
   ```bash
   fly launch
   ```
   Répondez aux questions (nom de l'app, région, etc.)

4. **Déployez** :
   ```bash
   fly deploy
   ```

---

## Tester Docker en local

Avant de déployer, vous pouvez tester que l'image Docker fonctionne :

```bash
# Construire l'image
docker build -t lealou-pizza .

# Lancer le conteneur
docker run -p 3000:3000 lealou-pizza
```

Ouvrez http://localhost:3000

---

## Important : base de données SQLite

L'application utilise **SQLite** (fichier `data/lealou.db`). Sur les hébergements gratuits :

- Les données peuvent être **perdues** à chaque redéploiement (le disque est souvent éphémère)
- Pour une utilisation réelle en production, envisagez une base externe (Turso, Supabase, etc.)

Pour l'instant, SQLite convient pour tester et démonstrations.
