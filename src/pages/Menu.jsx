import { createSignal } from 'solid-js'
import { menuItems, categories, supplements, menuMeta } from '../data/menu'
import { addToCart } from '../store/cart'
import './Menu.css'

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = createSignal('all')

  const filteredItems = () => {
    const cat = selectedCategory()
    if (cat === 'all') return menuItems
    return menuItems.filter(i => i.category === cat)
  }

  const handleAdd = (item, size = 'default', qty = 1) => {
    const price = item.sizes[size] ?? item.price
    addToCart({
      id: item.id,
      name: item.name,
      price,
      size: size === 'default' ? null : size,
    }, qty)
  }

  return (
    <div class="menu-page">
      <div class="container">
        <h1 class="page-title">Notre Menu</h1>

        <div class="category-tabs">
          <button
            classList={{ active: selectedCategory() === 'all' }}
            onClick={() => setSelectedCategory('all')}
          >
            Tout
          </button>
          {categories.map(cat => (
            <button
              classList={{ active: selectedCategory() === cat.id }}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div class="menu-grid">
          {filteredItems().map(item => (
            <article class="menu-card">
              <div class="menu-card-image">
                <img src={item.image} alt={item.name} class="card-img" loading="lazy" />
              </div>
              <div class="menu-card-body">
                <h3>{item.name}</h3>
                <p class="menu-description">{item.description}</p>
                {item.sizes.default !== undefined ? (
                  <div class="menu-action">
                    <span class="price">{item.price}€</span>
                    <button
                      class="btn-add"
                      onClick={() => handleAdd(item)}
                    >
                      Ajouter
                    </button>
                  </div>
                ) : (
                  <div class="menu-sizes">
                    {Object.entries(item.sizes).map(([size, price]) => (
                      <div class="size-row" key={size}>
                        <span>{size}</span>
                        <span class="price">{price}€</span>
                        <button
                          class="btn-add small"
                          onClick={() => handleAdd(item, size)}
                        >
                          +
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <div class="menu-meta">
          <p class="meta-note">{menuMeta.note}</p>
          <p class="meta-calzone">{menuMeta.basePriceText}</p>
          <div class="supplements">
            <h4>Suppléments</h4>
            {supplements.map(s => (
              <p key={s}>{s}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
