import db from './db.js'

function slug(name) {
  return String(name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function listMenuItems() {
  const rows = db.prepare(
    'SELECT * FROM menu_items ORDER BY category, sort_order, name'
  ).all()
  return rows.map(row => ({
    id: String(row.id),
    name: row.name,
    category: row.category,
    price: row.price,
    ingredients: row.ingredients,
    description: row.ingredients,
    image: row.image || '/pizzas/pizza-marguerite.png',
    sizes: { default: row.price },
  }))
}

export function getMenuItem(id) {
  const row = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id)
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    ingredients: row.ingredients,
    description: row.ingredients,
    image: row.image || '/pizzas/pizza-marguerite.png',
    sizes: { default: row.price },
  }
}

export function createMenuItem(data) {
  const { name, category, price, ingredients, image } = data
  if (!name?.trim() || !category?.trim()) {
    throw new Error('Nom et catégorie obligatoires')
  }
  const stmt = db.prepare(`
    INSERT INTO menu_items (name, category, price, ingredients, image)
    VALUES (?, ?, ?, ?, ?)
  `)
  const result = stmt.run(
    name.trim(),
    category.trim(),
    Number(price) || 0,
    (ingredients || '').trim(),
    (image || '/pizzas/pizza-marguerite.png').trim()
  )
  return getMenuItem(result.lastInsertRowid)
}

export function updateMenuItem(id, data) {
  const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id)
  if (!existing) throw new Error('Produit non trouvé')
  const name = (data.name != null ? data.name : existing.name).toString().trim()
  const category = (data.category != null ? data.category : existing.category).toString().trim()
  const price = data.price != null ? Number(data.price) : existing.price
  const ingredients = (data.ingredients != null ? data.ingredients : existing.ingredients).toString().trim()
  const image = (data.image != null ? data.image : existing.image).toString().trim() || '/pizzas/pizza-marguerite.png'
  db.prepare(`
    UPDATE menu_items SET name = ?, category = ?, price = ?, ingredients = ?, image = ?
    WHERE id = ?
  `).run(name, category, price, ingredients, image, id)
  return getMenuItem(id)
}

export function deleteMenuItem(id) {
  const result = db.prepare('DELETE FROM menu_items WHERE id = ?').run(id)
  if (result.changes === 0) throw new Error('Produit non trouvé')
  return { ok: true }
}

export function seedMenuFromStatic(staticItems) {
  const count = db.prepare('SELECT COUNT(*) as n FROM menu_items').get()
  if (count.n > 0) return
  const insert = db.prepare(`
    INSERT INTO menu_items (name, category, price, ingredients, image, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  staticItems.forEach((item, i) => {
    insert.run(
      item.name,
      item.category,
      item.price,
      item.ingredients || '',
      item.image || '/pizzas/pizza-marguerite.png',
      i
    )
  })
}
