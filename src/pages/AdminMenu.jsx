import { createSignal, onMount } from 'solid-js'
import { A } from '@solidjs/router'
import { Show } from 'solid-js'
import './AdminMenu.css'

const CATEGORIES = [
  { id: 'base-tomate', name: 'Base tomate' },
  { id: 'base-creme', name: 'Base crème' },
]

const PIZZA_IMAGES = [
  '/pizzas/pizza-marguerite.png',
  '/pizzas/pizza-4-fromages.png',
  '/pizzas/pizza-reine.png',
  '/pizzas/pizza-hawai.png',
  '/pizzas/pizza-chorizo.png',
  '/pizzas/pizza-forestiere.png',
  '/pizzas/pizza-poulet.png',
  '/pizzas/pizza-vegetarienne.png',
  '/pizzas/pizza-chevre-miel.png',
  '/pizzas/pizza-saumon.png',
  '/pizzas/pizza-tartiflette.png',
]

export default function AdminMenu() {
  const [items, setItems] = createSignal([])
  const [loading, setLoading] = createSignal(true)
  const [showForm, setShowForm] = createSignal(false)
  const [editing, setEditing] = createSignal(null)
  const [form, setForm] = createSignal({
    name: '',
    category: 'base-tomate',
    price: '',
    ingredients: '',
    image: '/pizzas/pizza-marguerite.png',
  })
  const [error, setError] = createSignal('')
  const [submitting, setSubmitting] = createSignal(false)

  const fetchMenu = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/menu')
      const data = await res.json()
      setItems(data.menuItems || [])
    } catch (e) {
      console.error(e)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  onMount(fetchMenu)

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', category: 'base-tomate', price: '', ingredients: '', image: '/pizzas/pizza-marguerite.png' })
    setError('')
    setShowForm(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      name: item.name || '',
      category: item.category || 'base-tomate',
      price: String(item.price ?? ''),
      ingredients: item.ingredients || '',
      image: item.image || '/pizzas/pizza-marguerite.png',
    })
    setError('')
    setShowForm(true)
  }

  const submitProduct = async (e) => {
    e.preventDefault()
    setError('')
    const f = form()
    if (!f.name?.trim()) {
      setError('Le nom est obligatoire')
      return
    }
    const price = parseFloat(f.price)
    if (isNaN(price) || price < 0) {
      setError('Prix invalide')
      return
    }
    setSubmitting(true)
    try {
      const body = {
        name: f.name.trim(),
        category: f.category,
        price,
        ingredients: (f.ingredients || '').trim(),
        image: (f.image || '/pizzas/pizza-marguerite.png').trim(),
      }
      if (editing()) {
        await fetch(`/api/menu/${editing().id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } else {
        await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }
      setShowForm(false)
      fetchMenu()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const deleteProduct = async (item) => {
    if (!confirm(`Supprimer "${item.name}" ?`)) return
    try {
      await fetch(`/api/menu/${item.id}`, { method: 'DELETE' })
      fetchMenu()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div class="admin-menu">
      <header class="admin-header">
        <div class="container admin-header-inner">
          <h1>Gestion de la carte menu</h1>
          <A href="/admin">Retour au tableau de bord</A>
        </div>
      </header>

      <main class="container admin-menu-main">
        <div class="menu-toolbar">
          <p class="menu-intro">Modifier les visuels, tarifs, ingrédients. Créer ou supprimer des produits.</p>
          <button class="btn-add-product" onClick={openAdd}>
            + Nouveau produit
          </button>
        </div>

        {loading() ? (
          <p>Chargement...</p>
        ) : (
          <div class="menu-grid-admin">
            {items().length === 0 ? (
              <p class="empty">Aucun produit</p>
            ) : (
              items().map(item => (
                <div class="menu-card-admin" key={item.id}>
                  <div class="menu-card-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div class="menu-card-body">
                    <h3>{item.name}</h3>
                    <p class="menu-category">{CATEGORIES.find(c => c.id === item.category)?.name || item.category}</p>
                    <p class="menu-ingredients">{item.ingredients}</p>
                    <p class="menu-price">{item.price}€</p>
                    <div class="menu-card-actions">
                      <button class="btn-edit" onClick={() => openEdit(item)}>Modifier</button>
                      <button class="btn-delete" onClick={() => deleteProduct(item)}>Supprimer</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <Show when={showForm()}>
        <div class="modal-overlay" onClick={() => setShowForm(false)}>
          <div class="modal modal-menu" onClick={e => e.stopPropagation()}>
            <h3>{editing() ? 'Modifier le produit' : 'Nouveau produit'}</h3>
            <form onSubmit={submitProduct}>
              <label>Nom *</label>
              <input
                value={form().name}
                onInput={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ex: Marguerite"
                required
              />
              <label>Catégorie</label>
              <select
                value={form().category}
                onInput={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map(c => (
                  <option value={c.id} key={c.id}>{c.name}</option>
                ))}
              </select>
              <label>Prix (€) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form().price}
                onInput={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="8"
                required
              />
              <label>Composants / Ingrédients</label>
              <input
                value={form().ingredients}
                onInput={e => setForm(f => ({ ...f, ingredients: e.target.value }))}
                placeholder="Mozzarella, basilic, tomates"
              />
              <label>Visuel (image)</label>
              <select
                value={form().image}
                onInput={e => setForm(f => ({ ...f, image: e.target.value }))}
              >
                {PIZZA_IMAGES.map(img => (
                  <option value={img} key={img}>{img.split('/').pop()}</option>
                ))}
              </select>
              <div class="form-image-preview">
                <img src={form().image} alt="Aperçu" />
              </div>
              {error() && <p class="form-error">{error()}</p>}
              <div class="modal-actions">
                <button type="button" onClick={() => setShowForm(false)}>Annuler</button>
                <button type="submit" class="btn-primary" disabled={submitting()}>
                  {submitting() ? 'Envoi...' : (editing() ? 'Enregistrer' : 'Ajouter')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Show>
    </div>
  )
}
