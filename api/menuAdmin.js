import db from './db.js'
import { listMenuItems, seedMenuFromStatic } from './menu.js'
import { rawItemsForSeed, categories, supplements, menuMeta } from './menuData.js'

export function reorderMenuItem(id, newSortOrder) {
  const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id)
  if (!existing) throw new Error('Produit non trouvé')
  
  db.prepare('UPDATE menu_items SET sort_order = ? WHERE id = ?').run(newSortOrder, id)
  return { ok: true, id, sort_order: newSortOrder }
}

export function bulkReorder(items) {
  const stmt = db.prepare('UPDATE menu_items SET sort_order = ? WHERE id = ?')
  const update = db.transaction((list) => {
    for (const item of list) {
      stmt.run(item.sort_order, item.id)
    }
  })
  update(items)
  return { ok: true, updated: items.length }
}

export function resetMenuToDefault() {
  db.prepare('DELETE FROM menu_items').run()
  seedMenuFromStatic(rawItemsForSeed)
  return { ok: true, message: 'Menu réinitialisé aux valeurs par défaut' }
}

export function getMenuStats() {
  const total = db.prepare('SELECT COUNT(*) as count FROM menu_items').get()
  const byCategory = db.prepare(`
    SELECT category, COUNT(*) as count, AVG(price) as avg_price 
    FROM menu_items GROUP BY category
  `).all()
  const priceRange = db.prepare(`
    SELECT MIN(price) as min_price, MAX(price) as max_price, AVG(price) as avg_price 
    FROM menu_items
  `).get()
  
  return {
    total: total.count,
    byCategory: byCategory.map(c => ({
      category: c.category,
      count: c.count,
      avgPrice: Math.round(c.avg_price * 100) / 100
    })),
    priceRange: {
      min: priceRange.min_price,
      max: priceRange.max_price,
      avg: Math.round(priceRange.avg_price * 100) / 100
    }
  }
}

export function exportMenu() {
  const menuItems = listMenuItems()
  return {
    exportedAt: new Date().toISOString(),
    menuItems,
    categories,
    supplements,
    menuMeta
  }
}

export function importMenu(data) {
  if (!data.menuItems || !Array.isArray(data.menuItems)) {
    throw new Error('Format invalide: menuItems manquant')
  }
  
  const clear = db.prepare('DELETE FROM menu_items')
  const insert = db.prepare(`
    INSERT INTO menu_items (name, category, price, ingredients, image, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  
  const doImport = db.transaction((items) => {
    clear.run()
    items.forEach((item, i) => {
      insert.run(
        item.name,
        item.category,
        item.price,
        item.ingredients || item.description || '',
        item.image || '/pizzas/pizza-marguerite.png',
        item.sort_order ?? i
      )
    })
  })
  
  doImport(data.menuItems)
  return { ok: true, imported: data.menuItems.length }
}

export function duplicateMenuItem(id) {
  const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id)
  if (!existing) throw new Error('Produit non trouvé')
  
  const result = db.prepare(`
    INSERT INTO menu_items (name, category, price, ingredients, image, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    existing.name + ' (copie)',
    existing.category,
    existing.price,
    existing.ingredients,
    existing.image,
    existing.sort_order + 1
  )
  
  return {
    id: result.lastInsertRowid,
    name: existing.name + ' (copie)',
    category: existing.category,
    price: existing.price,
    ingredients: existing.ingredients,
    image: existing.image
  }
}

export function toggleMenuItemAvailability(id, available) {
  const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id)
  if (!existing) throw new Error('Produit non trouvé')
  
  db.prepare('UPDATE menu_items SET available = ? WHERE id = ?').run(available ? 1 : 0, id)
  return { ok: true, id, available }
}

export function getAvailablePizzaImages() {
  return [
    '/pizzas/pizza-marguerite.png',
    '/pizzas/pizza-marguerite-napolitaine.png',
    '/pizzas/pizza-napolitaine.png',
    '/pizzas/pizza-4-fromages.png',
    '/pizzas/pizza-6-fromages.png',
    '/pizzas/pizza-4-saisons.png',
    '/pizzas/pizza-reine.png',
    '/pizzas/pizza-rome.png',
    '/pizzas/pizza-hawai.png',
    '/pizzas/pizza-chorizo.png',
    '/pizzas/pizza-forestiere.png',
    '/pizzas/pizza-poulet.png',
    '/pizzas/pizza-poulet-curry.png',
    '/pizzas/pizza-vegetarienne.png',
    '/pizzas/pizza-vegetarienne +.png',
    '/pizzas/pizza-chevre-miel.png',
    '/pizzas/pizza-saumon.png',
    '/pizzas/pizza-tartiflette.png',
    '/pizzas/pizza-bolognaise.png',
    '/pizzas/pizza-bolognaise +.png',
    '/pizzas/pizza-burger.png',
    '/pizzas/pizza-kebab.png',
    '/pizzas/pizza-kebab +.png',
    '/pizzas/pizza-la-bella-napoli.png',
    '/pizzas/pizza-la-colisée.png',
    '/pizzas/pizza-la-kevin.png',
    '/pizzas/pizza-la-savoyarde.png',
    '/pizzas/pizza-la-truffee.png',
    '/pizzas/pizza-raviole.png',
    '/pizzas/pizza-regionale.png',
    '/pizzas/pizza-saint-marcellin.png',
  ]
}
