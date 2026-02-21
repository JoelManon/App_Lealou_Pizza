#!/usr/bin/env node
/**
 * Importe les clients de test depuis data/clients-test.json dans la base SQLite.
 * Usage: node scripts/seed-clients.js
 */
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '../api/clients.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataPath = join(__dirname, '..', 'data', 'clients-test.json')

const clients = JSON.parse(readFileSync(dataPath, 'utf-8'))

console.log(`Import de ${clients.length} client(s) de test...`)

let added = 0
let skipped = 0

for (const c of clients) {
  try {
    createClient(c)
    console.log(`  ✓ ${c.first_name} ${c.last_name} (${c.phone})`)
    added++
  } catch (e) {
    if (e.message?.includes('existe déjà')) {
      console.log(`  − ${c.first_name} ${c.last_name} (${c.phone}) — déjà présent`)
      skipped++
    } else {
      console.error(`  ✗ ${c.first_name} ${c.last_name}: ${e.message}`)
    }
  }
}

console.log(`\nTerminé : ${added} ajouté(s), ${skipped} déjà présent(s).`)
