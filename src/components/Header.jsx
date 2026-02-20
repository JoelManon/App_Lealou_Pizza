import { A } from '@solidjs/router'
import { cart } from '../store/cart'
import { Show } from 'solid-js'
import './Header.css'

export default function Header() {
  const cartCount = () => cart().reduce((acc, i) => acc + i.quantity, 0)

  return (
    <header class="header">
      <div class="header-inner container">
        <A href="/" class="logo">
          <img src="/logo-lealou.png" alt="Lealou Pizzas et Burgers" class="logo-img" />
          <span class="logo-text">Lealou</span>
        </A>
        <nav class="nav">
          <A href="/" activeClass="active">
            Accueil
          </A>
          <A href="/fidelite" activeClass="active">
            Ma carte
          </A>
          <A href="/menu" activeClass="active">
            Menu
          </A>
          <A
            href="/panier"
            class="nav-cart"
            activeClass="active"
          >
            Panier
            <Show when={cartCount() > 0}>
              <span class="cart-badge">{cartCount()}</span>
            </Show>
          </A>
          <A href="/admin" class="nav-admin">
            Staff
          </A>
        </nav>
      </div>
    </header>
  )
}
