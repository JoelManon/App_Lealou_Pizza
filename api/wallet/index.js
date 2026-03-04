import { ensureLoyaltyClass } from './classService.js'
import { walletRequest } from './googleWalletApi.js'
import { buildLoyaltyObject } from './objectService.js'
import { makeAddToWalletLink } from './jwtService.js'

const ISSUER_ID = () => process.env.GOOGLE_ISSUER_ID
const CLASS_ID = () => process.env.WALLET_CLASS_ID || 'lealou.loyaltyclass'

export async function createOrGetGoogleWalletCard({ phone, stamps, qrToken, clientName, getGoogleObjectId, setGoogleObjectId }) {
  const issuerId = ISSUER_ID()
  const classId = CLASS_ID()
  if (!issuerId || !classId) {
    throw new Error('GOOGLE_ISSUER_ID requis')
  }

  await ensureLoyaltyClass()
  const normalized = phone.replace(/\s/g, '')
  const objectId = `lealou-${normalized.replace(/[^a-zA-Z0-9]/g, '')}`
  const existingObjectId = getGoogleObjectId?.(phone)

  const obj = buildLoyaltyObject({
    issuerId,
    classId,
    objectId,
    qrToken: qrToken || `LEALOU:${normalized}`,
    stamps: stamps ?? 0,
    customerName: clientName || null,
  })

  try {
    await walletRequest('GET', `/walletobjects/v1/loyaltyObject/${issuerId}.${objectId}`)
  } catch (e) {
    if (e.code === 404 || e.response?.status === 404) {
      await walletRequest('POST', '/walletobjects/v1/loyaltyObject', obj)
    } else {
      throw e
    }
  }

  if (setGoogleObjectId) {
    setGoogleObjectId(phone, objectId)
  }

  const addToWalletUrl = makeAddToWalletLink(obj)
  return { addToWalletUrl, objectId }
}

export async function pushWalletUpdate({ phone, stamps, qrToken, clientName, getGoogleObjectId }) {
  const objectId = getGoogleObjectId?.(phone)
  if (!objectId) return

  const issuerId = ISSUER_ID()
  const classId = CLASS_ID()
  if (!issuerId || !classId) return

  const obj = buildLoyaltyObject({
    issuerId,
    classId,
    objectId,
    qrToken: qrToken || `LEALOU:${phone.replace(/\s/g, '')}`,
    stamps: stamps ?? 0,
    customerName: clientName || null,
  })

  try {
    await walletRequest('PUT', `/walletobjects/v1/loyaltyObject/${issuerId}.${objectId}`, obj)
  } catch (e) {
    console.error('Google Wallet push update error:', e.message)
  }
}
