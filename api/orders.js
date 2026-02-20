import db from './db.js'
import { addStamps } from './fidelity.js'

export function createOrder(order) {
  const stmt = db.prepare(`
    INSERT INTO orders (customer_name, phone, address, notes, items, total, status)
    VALUES (?, ?, ?, ?, ?, ?, 'pending')
  `)
  const result = stmt.run(
    order.customer_name,
    order.phone,
    order.address,
    order.notes || '',
    JSON.stringify(order.items),
    order.total
  )
  // 1 pizza achetée = 1 tampon
  const pizzaCount = order.items.reduce((sum, i) => sum + (i.quantity || 0), 0)
  if (pizzaCount > 0 && order.phone) {
    addStamps(order.phone, pizzaCount)
  }
  return result.lastInsertRowid
}

export function getOrders(status) {
  let sql = 'SELECT * FROM orders ORDER BY created_at DESC'
  const params = []
  if (status) {
    sql = 'SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC'
    params.push(status)
  }
  const stmt = db.prepare(sql)
  const rows = params.length ? stmt.all(...params) : stmt.all()
  return rows.map(r => ({
    ...r,
    items: JSON.parse(r.items),
    created_at: r.created_at,
  }))
}

export function updateOrderStatus(id, status) {
  const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?')
  return stmt.run(status, id)
}
