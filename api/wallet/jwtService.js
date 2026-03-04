import fs from 'fs'
import jwt from 'jsonwebtoken'

let cached = null

function loadServiceAccount() {
  if (cached) return cached
  const p = process.env.GOOGLE_APPLICATION_CREDENTIALS
  const jsonEnv = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (jsonEnv) {
    try {
      cached = typeof jsonEnv === 'string' ? JSON.parse(jsonEnv) : jsonEnv
      return cached
    } catch (e) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON invalide')
    }
  }
  if (!p) throw new Error('GOOGLE_APPLICATION_CREDENTIALS ou GOOGLE_SERVICE_ACCOUNT_JSON requis')
  cached = JSON.parse(fs.readFileSync(p, 'utf8'))
  return cached
}

export function makeAddToWalletLink(loyaltyObject) {
  const sa = loadServiceAccount()
  const signerEmail = sa.client_email
  const privateKey = sa.private_key

  const claims = {
    iss: signerEmail,
    aud: 'google',
    typ: 'savetowallet',
    payload: {
      loyaltyObjects: [loyaltyObject],
    },
  }

  const token = jwt.sign(claims, privateKey, { algorithm: 'RS256' })
  return `https://pay.google.com/gp/v/save/${token}`
}
