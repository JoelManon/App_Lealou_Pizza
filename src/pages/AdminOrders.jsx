import { createSignal, onMount } from 'solid-js'
import { A } from '@solidjs/router'
import './AdminOrders.css'

const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  ready: 'Prête',
  delivered: 'Livrée',
}

export default function AdminOrders() {
  const [orders, setOrders] = createSignal([])
  const [filter, setFilter] = createSignal('')
  const [loading, setLoading] = createSignal(true)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const url = filter() ? `/api/orders?status=${filter()}` : '/api/orders'
      const res = await fetch(url)
      const data = await res.json()
      setOrders(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  onMount(fetchOrders)

  const updateStatus = async (id, status) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      fetchOrders()
    } catch (e) {
      console.error(e)
    }
  }

  const filteredOrders = () => orders()

  return (
    <div class="admin-orders">
      <header class="admin-header">
        <div class="container admin-header-inner">
          <h1>Commandes</h1>
          <A href="/admin">Retour au tableau de bord</A>
        </div>
      </header>

      <main class="container admin-orders-main">
        <div class="orders-filters">
          {['', 'pending', 'confirmed', 'preparing', 'ready', 'delivered'].map(s => (
            <button
              classList={{ active: filter() === s }}
              onClick={() => { setFilter(s); fetchOrders(); }}
            >
              {s || 'Toutes'}
            </button>
          ))}
        </div>

        {loading() ? (
          <p>Chargement...</p>
        ) : (
          <div class="orders-list">
            {filteredOrders().length === 0 ? (
              <p>Aucune commande</p>
            ) : (
              filteredOrders().map(order => (
                <div class="order-card" key={order.id}>
                  <div class="order-header">
                    <span class="order-id">#{order.id}</span>
                    <span class="order-date">{new Date(order.created_at).toLocaleString('fr-FR')}</span>
                    <span class={`order-status status-${order.status}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                  <div class="order-customer">
                    <strong>{order.customer_name}</strong> — {order.phone}
                  </div>
                  <p class="order-address">{order.address}</p>
                  {order.notes && <p class="order-notes">Note: {order.notes}</p>}
                  <ul class="order-items">
                    {order.items.map((i, idx) => (
                      <li key={idx}>
                        {i.name} {i.size && `(${i.size})`} × {i.quantity} — {(i.price * i.quantity).toFixed(2)}€
                      </li>
                    ))}
                  </ul>
                  <div class="order-total">Total: {order.total}€</div>
                  <div class="order-actions">
                    {order.status === 'pending' && (
                      <button onClick={() => updateStatus(order.id, 'confirmed')}>Confirmer</button>
                    )}
                    {order.status === 'confirmed' && (
                      <button onClick={() => updateStatus(order.id, 'preparing')}>En préparation</button>
                    )}
                    {order.status === 'preparing' && (
                      <button onClick={() => updateStatus(order.id, 'ready')}>Prête</button>
                    )}
                    {order.status === 'ready' && (
                      <button onClick={() => updateStatus(order.id, 'delivered')}>Livrée</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
