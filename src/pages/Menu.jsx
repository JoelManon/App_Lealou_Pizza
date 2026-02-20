import { createSignal, onMount } from 'solid-js'
import { addToCart } from '../store/cart'
import './Menu.css'

const FALLBACK = {
  menuItems: [],
  categories: [{ id: 'base-tomate', name: 'Base tomate', icon: '🍅' }, { id: 'base-creme', name: 'Base crème', icon: '🥛' }],
  supplements: [],
  menuMeta: { note: '', basePriceText: '' },
}

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = createSignal('all')
  const [menuData, setMenuData] = createSignal(null)

  onMount(async () => {
    try {
      const res = await fetch('/api/menu')
      const data = await res.json()
      setMenuData(data)
    } catch (e) {
      setMenuData(FALLBACK)
    }
  })

  const menuItems = () => menuData()?.menuItems ?? []
  const categories = () => menuData()?.categories ?? FALLBACK.categories
  const supplements = () => menuData()?.supplements ?? FALLBACK.supplements
  const menuMeta = () => menuData()?.menuMeta ?? FALLBACK.menuMeta

  const filteredItems = () => {
    const cat = selectedCategory()
    const items = menuItems()
    if (cat === 'all') return items
    return items.filter(i => i.category === cat)
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
        <p class="menu-disclaimer">Images Non Contractuelles</p>
        <h1 class="page-title">Notre Menu</h1>

        {!menuData() ? (
          <p class="menu-loading">Chargement du menu...</p>
        ) : (
        <>
        <div class="category-tabs">
          <button
            classList={{ active: selectedCategory() === 'all' }}
            onClick={() => setSelectedCategory('all')}
          >
            Tout
          </button>
          {categories().map(cat => (
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
          <p class="meta-note">{menuMeta().note}</p>
          <p class="meta-calzone">{menuMeta().basePriceText}</p>
          <div class="supplements">
            <h4>Suppléments</h4>
            {supplements().map(s => (
              <p key={s}>{s}</p>
            ))}
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  )
}
