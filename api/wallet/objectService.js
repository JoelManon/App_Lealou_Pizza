export function remainingText(stamps) {
  const current = stamps >= 10 ? 10 : stamps % 10
  const remaining = 10 - current
  return `${remaining} tampon${remaining > 1 ? 's' : ''} restant${remaining > 1 ? 's' : ''} pour une pizza offerte.`
}

export function buildLoyaltyObject({ issuerId, classId, objectId, qrToken, stamps, customerName }) {
  const current = stamps >= 10 ? 10 : stamps % 10
  const freePizzas = stamps >= 10 ? 1 : 0

  const modules = [
    { id: 'headline', header: 'Carte de fidélité Lealou', body: `Bonjour, ${customerName || 'client'}` },
    { id: 'stamps', header: 'Tampons', body: `${current} tampon${current > 1 ? 's' : ''} sur 10` },
    { id: 'remaining', header: 'Avantage', body: remainingText(stamps) },
  ]

  if (freePizzas > 0) {
    modules.push({
      id: 'free',
      header: 'Pizza offerte',
      body: 'Pizza gratuite à réclamer en caisse ✅',
    })
  }

  return {
    id: `${issuerId}.${objectId}`,
    classId: `${issuerId}.${classId}`,
    state: 'ACTIVE',
    accountId: objectId,
    accountName: customerName || 'Client Lealou',
    barcode: {
      type: 'QR_CODE',
      value: qrToken,
      alternateText: 'Présentez en caisse',
    },
    textModulesData: modules,
  }
}
