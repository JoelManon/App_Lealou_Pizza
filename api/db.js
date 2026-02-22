import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { mkdirSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', 'data')
const dbPath = join(dataDir, 'lealou.db')

// Créer le dossier data s'il n'existe pas
try { mkdirSync(dataDir, { recursive: true }) } catch (_) {}

const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT,
    address TEXT,
    qr_code TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// Migration: ajouter la colonne qr_code si elle n'existe pas
try {
  db.exec(`ALTER TABLE clients ADD COLUMN qr_code TEXT`)
} catch (_) {}

// Créer un index unique sur qr_code (ignore si existe déjà)
try {
  db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_qr_code ON clients(qr_code)`)
} catch (_) {}

db.exec(`
  CREATE TABLE IF NOT EXISTS fidelity (
    phone TEXT PRIMARY KEY,
    stamps INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    ingredients TEXT,
    image TEXT DEFAULT '/pizzas/pizza-marguerite.png',
    sort_order INTEGER DEFAULT 0,
    available INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// Migration: ajouter les colonnes manquantes si la table existe déjà
try {
  db.exec(`ALTER TABLE menu_items ADD COLUMN sort_order INTEGER DEFAULT 0`)
} catch (_) {}
try {
  db.exec(`ALTER TABLE menu_items ADD COLUMN available INTEGER DEFAULT 1`)
} catch (_) {}

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    notes TEXT,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

export default db
