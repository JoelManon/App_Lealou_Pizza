# Configuration PassNinja

Pour activer le bouton "Ajouter à Apple Wallet" sur la carte de fidélité.

## 1. Créer un compte PassNinja

- Inscription sur [passninja.com](https://passninja.com)
- $10 de crédits offerts au démarrage

## 2. Créer un modèle de pass Loyalty

- Dashboard → Pass Templates → Create
- Type : **Loyalty** (storeCard)
- Renseigner les champs API mapping (Edit Pass Template) :
  - `primary.label` / `primary.value` (ex. Tampons, X/10)
  - `secondary.0.label` / `secondary.0.value` (ex. Client)
  - `barcode.data` / `barcode.type` (QR code)
- Note : si les noms de champs diffèrent, adapter le payload dans `server.js` route `/api/fidelity/wallet-pass`

## 3. Variables d'environnement (Railway)

Dans **Settings** → **Variables**, ajouter :

- `PASS_NINJA_API_KEY` : clé API (32 caractères hex)
- `PASS_NINJA_ACCOUNT_ID` : ID compte (format `aid_0x...`)
- `PASS_NINJA_PASS_TYPE` : clé du template (format `ptk_0x...`)

Ces valeurs se trouvent dans le dashboard PassNinja, onglet "Get Passes" du template.
