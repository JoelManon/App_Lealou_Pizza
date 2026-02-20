# Image Node.js légère
FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Installer TOUTES les dépendances (build nécessite vite)
RUN npm ci

# Copier le code source
COPY . .

# Créer le dossier pour la base SQLite
RUN mkdir -p data

# Builder l'application
RUN npm run build

# Supprimer les devDependencies pour alléger l'image
RUN npm prune --omit=dev

# Le serveur écoute sur le port défini par la variable PORT (requis par Render, Railway, etc.)
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server"]
