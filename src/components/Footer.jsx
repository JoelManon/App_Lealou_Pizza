import { A } from '@solidjs/router'
import './Footer.css'

export default function Footer() {
  return (
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <img src="/logo-lealou.png" alt="" class="footer-logo" />
          <span>Lealou Pizzas et Burgers</span>
        </div>
        <div class="footer-links">
          <A href="/menu">Menu</A>
          <A href="/fidelite">Ma carte</A>
          <A href="/contact">Contact</A>
        </div>
        <div class="footer-legal">
          <A href="/confidentialite">Politique de confidentialité</A>
          <A href="/cookies">Politique de cookies</A>
          <A href="/cgv">Conditions générales</A>
        </div>
        <p class="footer-copy">
          © {new Date().getFullYear()} Lealou — Fait avec amour
        </p>
      </div>
    </footer>
  )
}
