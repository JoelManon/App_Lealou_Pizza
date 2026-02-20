import { createSignal } from 'solid-js'
import { A, useNavigate } from '@solidjs/router'
import { cart, clearCart } from '../store/cart'
import './Order.css'

export default function Order() {
  const navigate = useNavigate()
  const [name, setName] = createSignal('')
  const [phone, setPhone] = createSignal('')
  const [address, setAddress] = createSignal('')
  const [notes, setNotes] = createSignal('')

  const items = cart
  const total = () =>
    items().reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2)

  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items().length === 0) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name(),
          phone: phone(),
          address: address(),
          notes: notes(),
          items: items().map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, size: i.size })),
          total: parseFloat(total()),
        }),
      })
      const text = await res.text()
      let data = {}
      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        throw new Error('Erreur serveur. Vérifiez que le serveur est bien démarré (npm run dev).')
      }
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la commande')
      alert(`Merci ${name()} ! Votre commande #${data.id} de ${total()}€ a été enregistrée.`)
      clearCart()
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (items().length === 0 && !name()) {
    return (
      <div class="order-page">
        <div class="container">
          <p>Votre panier est vide.</p>
          <A href="/menu">Voir le menu</A>
        </div>
      </div>
    )
  }

  return (
    <div class="order-page">
      <div class="container">
        <h1 class="page-title">Finaliser la commande</h1>

        <form class="order-form" onSubmit={handleSubmit}>
          <div class="order-summary">
            <h3>Récapitulatif</h3>
            {items().map(item => (
              <div class="order-line">
                <span>
                  {item.name} {item.size && `(${item.size})`} × {item.quantity}
                </span>
                <span>{(item.price * item.quantity).toFixed(2)}€</span>
              </div>
            ))}
            <div class="order-total">
              <strong>Total</strong>
              <strong>{total()}€</strong>
            </div>
          </div>

          <div class="order-fields">
            <label>
              Nom complet *
              <input
                type="text"
                required
                value={name()}
                onInput={e => setName(e.target.value)}
                placeholder="Jean Dupont"
              />
            </label>
            <label>
              Téléphone *
              <input
                type="tel"
                required
                value={phone()}
                onInput={e => setPhone(e.target.value)}
                placeholder="06 12 34 56 78"
              />
            </label>
            <label>
              Adresse *
              <input
                type="text"
                required
                value={address()}
                onInput={e => setAddress(e.target.value)}
                placeholder="123 rue de la Pizza, 75001 Paris"
              />
            </label>
            <label>
              Notes (allergies, instructions)
              <textarea
                value={notes()}
                onInput={e => setNotes(e.target.value)}
                rows="2"
                placeholder="Ex: Sans oignons, 2ème étage..."
              />
            </label>
          </div>

          {error() && <p class="order-error">{error()}</p>}
          <button type="submit" class="btn btn-primary btn-submit" disabled={loading()}>
            {loading() ? 'Envoi en cours...' : 'Confirmer la commande'}
          </button>
        </form>
      </div>
    </div>
  )
}
