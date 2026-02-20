import { A } from '@solidjs/router'
import { Show } from 'solid-js'
import { cart, removeFromCart, updateQuantity, clearCart } from '../store/cart'
import './Cart.css'

export default function Cart() {
  const items = cart
  const total = () =>
    items().reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2)

  return (
    <div class="cart-page">
      <div class="container">
        <h1 class="page-title">Mon Panier</h1>

        <div class="cart-content">
          <Show
            when={items().length > 0}
            fallback={
              <div class="cart-empty">
                <span class="empty-icon">🛒</span>
                <p>Votre panier est vide</p>
                <A href="/menu" class="btn btn-primary">
                  Voir le menu
                </A>
              </div>
            }
          >
            <div class="cart-items">
              {items().map(item => (
                <div class="cart-item">
                  <div class="cart-item-info">
                    <h4>
                      {item.name}
                      {item.size && <span class="size"> ({item.size})</span>}
                    </h4>
                    <p class="cart-item-price">{item.price}€ × {item.quantity}</p>
                  </div>
                  <div class="cart-item-actions">
                    <div class="qty-controls">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      class="btn-remove"
                      onClick={() => removeFromCart(item.id, item.size)}
                    >
                      Supprimer
                    </button>
                  </div>
                  <div class="cart-item-total">
                    {(item.price * item.quantity).toFixed(2)}€
                  </div>
                </div>
              ))}
            </div>

            <div class="cart-footer">
              <button class="btn-clear" onClick={clearCart}>
                Vider le panier
              </button>
              <div class="cart-total">
                <span>Total</span>
                <strong>{total()}€</strong>
              </div>
              <A href="/commande" class="btn btn-primary btn-checkout">
                Passer la commande
              </A>
            </div>
          </Show>
        </div>
      </div>
    </div>
  )
}
