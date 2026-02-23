import db from './db.js'

const STAMPS_PER_PIZZA = 10 // 10 tampons = 1 pizza offerte

export function addStamps(phone, count) {
  const normalized = phone.replace(/\s/g, '')
  const existing = db.prepare('SELECT stamps FROM fidelity WHERE phone = ?').get(normalized)
  const newStamps = (existing?.stamps ?? 0) + count
  if (existing) {
    db.prepare('UPDATE fidelity SET stamps = ?, updated_at = CURRENT_TIMESTAMP WHERE phone = ?')
      .run(newStamps, normalized)
  } else {
    db.prepare('INSERT INTO fidelity (phone, stamps) VALUES (?, ?)').run(normalized, newStamps)
  }
  return newStamps
}

export function getStamps(phone) {
  const normalized = phone.replace(/\s/g, '')
  const row = db.prepare('SELECT stamps FROM fidelity WHERE phone = ?').get(normalized)
  return row?.stamps ?? 0
}

export function getFidelityRow(phone) {
  const normalized = phone.replace(/\s/g, '')
  return db.prepare('SELECT stamps, pass_ninja_id FROM fidelity WHERE phone = ?').get(normalized)
}

export function setPassNinjaId(phone, passNinjaId) {
  const normalized = phone.replace(/\s/g, '')
  const existing = db.prepare('SELECT 1 FROM fidelity WHERE phone = ?').get(normalized)
  if (existing) {
    db.prepare('UPDATE fidelity SET pass_ninja_id = ?, updated_at = CURRENT_TIMESTAMP WHERE phone = ?')
      .run(passNinjaId, normalized)
  } else {
    db.prepare('INSERT INTO fidelity (phone, stamps, pass_ninja_id) VALUES (?, 0, ?)').run(normalized, passNinjaId)
  }
  return passNinjaId
}

/** Transfère des tampons d'une carte papier vers la carte digitale (staff) */
export function transferFromPaper(phone, stampsToAdd) {
  const count = Math.max(0, Math.floor(Number(stampsToAdd) || 0))
  if (count === 0) return getStamps(phone)
  return addStamps(phone, count)
}

/** Définit manuellement le nombre de tampons (staff, pour correction) */
export function setStamps(phone, count) {
  const normalized = phone.replace(/\s/g, '')
  const value = Math.max(0, Math.floor(Number(count) || 0))
  const existing = db.prepare('SELECT stamps FROM fidelity WHERE phone = ?').get(normalized)
  if (existing) {
    db.prepare('UPDATE fidelity SET stamps = ?, updated_at = CURRENT_TIMESTAMP WHERE phone = ?')
      .run(value, normalized)
  } else {
    db.prepare('INSERT INTO fidelity (phone, stamps) VALUES (?, ?)').run(normalized, value)
  }
  return value
}

export function redeemPizza(phone) {
  const stamps = getStamps(phone)
  if (stamps < STAMPS_PER_PIZZA) return { ok: false, stamps }
  const newStamps = stamps - STAMPS_PER_PIZZA
  const normalized = phone.replace(/\s/g, '')
  db.prepare('UPDATE fidelity SET stamps = ?, updated_at = CURRENT_TIMESTAMP WHERE phone = ?')
    .run(newStamps, normalized)
  return { ok: true, stamps: newStamps }
}

export { STAMPS_PER_PIZZA }
