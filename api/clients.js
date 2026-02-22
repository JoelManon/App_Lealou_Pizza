import db from './db.js'
import { getStamps } from './fidelity.js'
import crypto from 'crypto'

function normalizePhone(phone) {
  return (phone || '').replace(/\s/g, '')
}

function generateQRCode() {
  const prefix = 'LEALOU'
  const uniqueId = crypto.randomBytes(6).toString('hex').toUpperCase()
  return `${prefix}-${uniqueId}`
}

function ensureQRCode(phone) {
  const normalized = normalizePhone(phone)
  const client = db.prepare('SELECT qr_code FROM clients WHERE phone = ?').get(normalized)
  if (client && !client.qr_code) {
    const qrCode = generateQRCode()
    db.prepare('UPDATE clients SET qr_code = ? WHERE phone = ?').run(qrCode, normalized)
    return qrCode
  }
  return client?.qr_code || null
}

export function listClients(search = '') {
  let sql = 'SELECT * FROM clients ORDER BY first_name, last_name'
  const params = []
  if (search && search.trim()) {
    const term = `%${search.trim()}%`
    sql = `SELECT * FROM clients 
           WHERE first_name LIKE ? OR last_name LIKE ? OR phone LIKE ? OR address LIKE ? OR qr_code LIKE ?
           ORDER BY first_name, last_name`
    params.push(term, term, term, term, term)
  }
  const stmt = db.prepare(sql)
  const rows = params.length ? stmt.all(...params) : stmt.all()
  return rows.map(c => {
    const qrCode = c.qr_code || ensureQRCode(c.phone)
    return {
      ...c,
      qr_code: qrCode,
      stamps: getStamps(c.phone),
    }
  })
}

export function getClient(phone) {
  const normalized = normalizePhone(phone)
  const row = db.prepare('SELECT * FROM clients WHERE phone = ?').get(normalized)
  if (!row) return null
  const qrCode = row.qr_code || ensureQRCode(row.phone)
  return { ...row, qr_code: qrCode, stamps: getStamps(row.phone) }
}

export function getClientByQRCode(qrCode) {
  if (!qrCode) return null
  const row = db.prepare('SELECT * FROM clients WHERE qr_code = ?').get(qrCode)
  if (!row) return null
  return { ...row, stamps: getStamps(row.phone) }
}

export function createClient(data) {
  const normalized = normalizePhone(data.phone)
  if (!data.first_name?.trim() || !normalized) {
    throw new Error('Prénom et numéro de téléphone sont obligatoires')
  }
  const existing = db.prepare('SELECT id FROM clients WHERE phone = ?').get(normalized)
  if (existing) {
    throw new Error('Un client avec ce numéro de téléphone existe déjà')
  }
  try {
    const qrCode = generateQRCode()
    const stmt = db.prepare(`
      INSERT INTO clients (phone, first_name, last_name, address, qr_code)
      VALUES (?, ?, ?, ?, ?)
    `)
    stmt.run(
      normalized,
      data.first_name.trim(),
      (data.last_name || '').trim() || null,
      (data.address || '').trim() || null,
      qrCode
    )
    return getClient(normalized)
  } catch (e) {
    if (e.message?.includes('UNIQUE') || e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new Error('Un client avec ce numéro de téléphone existe déjà')
    }
    throw e
  }
}

export function updateClient(phone, data) {
  const normalized = normalizePhone(phone)
  const existing = db.prepare('SELECT id FROM clients WHERE phone = ?').get(normalized)
  if (!existing) throw new Error('Client non trouvé')

  const newPhone = data.phone ? normalizePhone(data.phone) : normalized
  if (!data.first_name?.trim() || !newPhone) {
    throw new Error('Prénom et numéro de téléphone sont obligatoires')
  }

  db.prepare(`
    UPDATE clients SET phone = ?, first_name = ?, last_name = ?, address = ?
    WHERE phone = ?
  `).run(
    newPhone,
    data.first_name.trim(),
    (data.last_name || '').trim() || null,
    (data.address || '').trim() || null,
    normalized
  )
  return getClient(newPhone)
}

export function deleteClient(phone) {
  const normalized = normalizePhone(phone)
  const stmt = db.prepare('DELETE FROM clients WHERE phone = ?')
  return stmt.run(normalized)
}
