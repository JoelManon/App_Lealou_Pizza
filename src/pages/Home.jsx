import { A } from '@solidjs/router'
import './Home.css'

export default function Home() {
  return (
    <div class="home">
      <section class="hero">
        <div class="container hero-content">
          <h1 class="hero-title">
            Bienvenue chez <span>Lealou</span>
          </h1>
          <p class="hero-subtitle">
            Des pizzas artisanales cuites au feu de bois, des ingrédients frais
            et une touche d'Italie à chaque bouchée.
          </p>
          <div class="hero-actions">
            <A href="/menu" class="btn btn-primary">
              Voir le menu
            </A>
            <A href="/panier" class="btn btn-outline">
              Mon panier
            </A>
          </div>
        </div>
        <div class="hero-decoration">🍕</div>
      </section>

      <section class="features">
        <div class="container">
          <h2>Pourquoi nous choisir ?</h2>
          <div class="feature-grid">
            <div class="feature-card feature-card-schedule">
              <a href="tel:0768341769" class="schedule-phone">07 68 34 17 69</a>
              <div class="schedule-list">
                <p><span class="day">LUNDI</span> Corbelin</p>
                <p><span class="day">MARDI</span> Saint Didier d'Aoste</p>
                <p><span class="day">MERCREDI</span> Corbelin</p>
                <p><span class="day">VENDREDI</span> Saint Didier d'Aoste</p>
                <p><span class="day">SAMEDI</span> Corbelin</p>
                <p><span class="day">DIMANCHE</span> La Bâtie Montgascon</p>
              </div>
            </div>
            <div class="feature-card">
              <span class="feature-icon">🌿</span>
              <h3>Produits frais</h3>
              <p>Des ingrédients sélectionnés chaque jour pour des saveurs authentiques.</p>
            </div>
            <A href="/fidelite" class="feature-card feature-card-fidelity">
              <img src="/carte-fidelite-visuel.png" alt="Carte de fidélité Lealou - 10 pizzas achetées, la 11ème gratuite" />
            </A>
          </div>
        </div>
      </section>
    </div>
  )
}
