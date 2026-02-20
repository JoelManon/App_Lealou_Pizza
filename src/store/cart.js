import { createSignal } from 'solid-js'

export const [cart, setCart] = createSignal([])

export function addToCart(item, quantity = 1) {
  setCart(prev => {
    const existing = prev.find(i => i.id === item.id && i.size === item.size)
    if (existing) {
      return prev.map(i =>
        i.id === item.id && i.size === item.size
          ? { ...i, quantity: i.quantity + quantity }
          : i
      )
    }
    return [...prev, { ...item, quantity }]
  })
}

export function removeFromCart(itemId, size) {
  setCart(prev => prev.filter(i => !(i.id === itemId && i.size === size)))
}

export function updateQuantity(itemId, size, quantity) {
  if (quantity <= 0) {
    removeFromCart(itemId, size)
    return
  }
  setCart(prev =>
    prev.map(i =>
      i.id === itemId && i.size === size ? { ...i, quantity } : i
    )
  )
}

export function clearCart() {
  setCart([])
}
