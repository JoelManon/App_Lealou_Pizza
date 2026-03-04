import { walletRequest } from './googleWalletApi.js'

export async function ensureLoyaltyClass() {
  const ISSUER_ID = process.env.GOOGLE_ISSUER_ID
  const CLASS_ID = process.env.WALLET_CLASS_ID || 'lealou.loyaltyclass'
  const issuerName = process.env.ISSUER_NAME || 'Lealou'
  const programName = process.env.PROGRAM_NAME || 'Carte fidélité Lealou'

  const id = `${ISSUER_ID}.${CLASS_ID}`
  const classResource = {
    id,
    issuerName,
    programName,
    reviewStatus: 'UNDER_REVIEW',
  }

  try {
    await walletRequest('GET', `/walletobjects/v1/loyaltyClass/${id}`)
    return { id, created: false }
  } catch (e) {
    if (e.code === 404 || e.response?.status === 404) {
      await walletRequest('POST', '/walletobjects/v1/loyaltyClass', classResource)
      return { id, created: true }
    }
    throw e
  }
}
