#!/usr/bin/env node
/**
 * Crée 5 clients test au format Jorge Ferreira 0632508244
 * Exécuter : node scripts/seed-clients.js
 */

import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, '..', 'data', 'lealou.db')

const db = new Database(dbPath)

const testClients = [
  { first_name: 'Jorge', last_name: 'Ferreira', phone: '0632508244' },
  { first_name: 'Maria', last_name: 'Ferreira', phone: '0632508245' },
  { first_name: 'Antonio', last_name: 'Ferreira', phone: '0632508246' },
  { first_name: 'Sofia', last_name: 'Ferreira', phone: '0632508247' },
  { first_name: 'Carlos', last_name: 'Ferreira', phone: '0632508248' },
]

const insert = db.prepare(`
  INSERT OR IGNORE INTO clients (phone, first_name, last_name, address)
  VALUES (?, ?, ?, ?)
`)

for (const c of testClients) {
  const phone = c.phone.replace(/\s/g, '')
  try {
    insert.run(phone, c.first_name, c.last_name, null)
    console.log(`✓ ${c.first_name} ${c.last_name} ${c.phone}`)
  } catch (e) {
    if (e.message?.includes('UNIQUE')) {
      console.log(`- ${c.first_name} ${c.last_name} ${c.phone} (existe déjà)`)
    } else {
      throw e
    }
  }
}

console.log('\n5 clients test créés.')
