import { createSignal, onMount } from 'solid-js'
import { A } from '@solidjs/router'
import { Show } from 'solid-js'
import QRCode from 'qrcode'
import './AdminClients.css'

const STAMPS_PER_PIZZA = 10

export default function AdminClients() {
  const [clients, setClients] = createSignal([])
  const [search, setSearch] = createSignal('')
  const [loading, setLoading] = createSignal(true)
  const [showForm, setShowForm] = createSignal(false)
  const [editing, setEditing] = createSignal(null)
  const [transferModal, setTransferModal] = createSignal(null)
  const [qrModal, setQrModal] = createSignal(null)
  const [qrDataUrl, setQrDataUrl] = createSignal('')
  const [form, setForm] = createSignal({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
  })
  const [error, setError] = createSignal('')
  const [submitting, setSubmitting] = createSignal(false)

  const fetchClients = async () => {
    setLoading(true)
    try {
      const url = search() ? `/api/clients?search=${encodeURIComponent(search())}` : '/api/clients'
      const res = await fetch(url)
      const data = await res.json()
      setClients(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  onMount(fetchClients)

  const handleSearch = () => fetchClients()

  const openAdd = () => {
    setEditing(null)
    setForm({ first_name: '', last_name: '', phone: '', address: '' })
    setError('')
    setShowForm(true)
  }

  const openEdit = (c) => {
    setEditing(c)
    setForm({
      first_name: c.first_name || '',
      last_name: c.last_name || '',
      phone: c.phone || '',
      address: c.address || '',
    })
    setError('')
    setShowForm(true)
  }

  const submitClient = async (e) => {
    e.preventDefault()
    setError('')
    const f = form()
    if (!f.first_name?.trim() || !f.phone?.trim()) {
      setError('Prénom et numéro de téléphone sont obligatoires')
      return
    }
    setSubmitting(true)
    try {
      const url = editing()
        ? `/api/clients/${encodeURIComponent(editing().phone)}`
        : '/api/clients'
      const method = editing() ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: f.first_name?.trim(),
          last_name: f.last_name?.trim() || '',
          phone: f.phone?.trim().replace(/\s/g, ''),
          address: f.address?.trim() || '',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Erreur serveur')
      setShowForm(false)
      fetchClients()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const openTransfer = (client) => {
    setTransferModal({ client, stampsToAdd: 0 })
  }

  const showQRCode = async (client) => {
    setQrModal(client)
    if (client.qr_code) {
      const url = await QRCode.toDataURL(client.qr_code, { width: 250, margin: 1 })
      setQrDataUrl(url)
    } else {
      setQrDataUrl('')
    }
  }

  const doTransfer = async () => {
    const m = transferModal()
    if (!m || m.stampsToAdd <= 0) return
    try {
      await fetch('/api/fidelity/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: m.client.phone, stamps: m.stampsToAdd }),
      })
      setTransferModal(null)
      fetchClients()
    } catch (e) {
      console.error(e)
    }
  }

  const updateStamps = async (phone, newStamps) => {
    try {
      await fetch(`/api/fidelity/${encodeURIComponent(phone)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stamps: newStamps }),
      })
      fetchClients()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div class="admin-clients">
      <header class="admin-header">
        <div class="container admin-header-inner">
          <h1>Gestion des clients</h1>
          <A href="/admin">Retour au tableau de bord</A>
        </div>
      </header>

      <main class="container admin-clients-main">
        <div class="clients-toolbar">
          <div class="search-row">
            <input
              type="text"
              placeholder="Rechercher (nom, prénom, téléphone, adresse)"
              value={search()}
              onInput={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch}>Rechercher</button>
          </div>
          <button class="btn-add-client" onClick={openAdd}>
            + Nouveau client
          </button>
        </div>

        {loading() ? (
          <p>Chargement...</p>
        ) : (
          <div class="clients-list">
            {clients().length === 0 ? (
              <p class="empty">Aucun client trouvé</p>
            ) : (
              clients().map(client => (
                <div class="client-card" key={client.phone}>
                  <div class="client-info">
                    <strong>{client.first_name} {client.last_name || ''}</strong>
                    <span class="client-phone">{client.phone}</span>
                    {client.address && <span class="client-address">{client.address}</span>}
                    {client.qr_code && <span class="client-qr-code">{client.qr_code}</span>}
                  </div>
                  <div class="client-fidelity">
                    <span class="stamps-badge">
                      🎫 {client.stamps || 0} / {STAMPS_PER_PIZZA} tampons
                    </span>
                    <div class="fidelity-actions">
                      <button
                        class="btn-small btn-qr"
                        onClick={() => showQRCode(client)}
                        title="Voir le QR code du client"
                      >
                        📱 QR
                      </button>
                      <button
                        class="btn-small"
                        onClick={() => openTransfer(client)}
                        title="Transférer tampons d'une carte papier"
                      >
                        Carte papier →
                      </button>
                      <button
                        class="btn-small"
                        onClick={() => {
                          const n = prompt('Nouveau nombre de tampons (correction) :', client.stamps || 0)
                          if (n != null && !isNaN(Number(n))) updateStamps(client.phone, Number(n))
                        }}
                        title="Corriger le nombre de tampons"
                      >
                        Corriger
                      </button>
                    </div>
                  </div>
                  <div class="client-actions">
                    <button onClick={() => openEdit(client)}>Modifier</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <Show when={showForm()}>
        <div class="modal-overlay" onClick={() => setShowForm(false)}>
          <div class="modal" onClick={e => e.stopPropagation()}>
            <h3>{editing() ? 'Modifier le client' : 'Nouveau client'}</h3>
            <form onSubmit={submitClient}>
              <label>Prénom *</label>
              <input
                value={form().first_name}
                onInput={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                required
              />
              <label>Nom</label>
              <input
                value={form().last_name}
                onInput={e => setForm(f => ({ ...f, last_name: e.target.value }))}
              />
              <label>Téléphone *</label>
              <input
                type="tel"
                value={form().phone}
                onInput={e => setForm(f => ({ ...f, phone: e.target.value }))}
                required
                disabled={!!editing()}
              />
              {editing() && <p class="hint">Le numéro ne peut pas être modifié.</p>}
              <label>Adresse</label>
              <input
                value={form().address}
                onInput={e => setForm(f => ({ ...f, address: e.target.value }))}
              />
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

      <Show when={transferModal()}>
        <div class="modal-overlay" onClick={() => setTransferModal(null)}>
          <div class="modal modal-transfer" onClick={e => e.stopPropagation()}>
            <h3>Transférer carte papier → digitale</h3>
            <p>
              Client : <strong>{transferModal()?.client?.first_name} {transferModal()?.client?.last_name}</strong>
              <br />
              Téléphone : {transferModal()?.client?.phone}
            </p>
            <p class="transfer-desc">
              Combien de tampons le client a-t-il sur sa carte papier ? Ils seront ajoutés à sa carte digitale.
            </p>
            <div class="transfer-input">
              <input
                type="number"
                min="0"
                max="20"
                value={transferModal()?.stampsToAdd ?? 0}
                onInput={e => setTransferModal(m => ({ ...m, stampsToAdd: Number(e.target.value) || 0 }))}
              />
              <span>tampons</span>
            </div>
            <div class="modal-actions">
              <button type="button" onClick={() => setTransferModal(null)}>Annuler</button>
              <button
                class="btn-primary"
                onClick={doTransfer}
                disabled={!transferModal()?.stampsToAdd}
              >
                Transférer
              </button>
            </div>
          </div>
        </div>
      </Show>

      <Show when={qrModal()}>
        <div class="modal-overlay" onClick={() => setQrModal(null)}>
          <div class="modal modal-qr" onClick={e => e.stopPropagation()}>
            <h3>QR Code Client</h3>
            <p class="qr-client-name">
              <strong>{qrModal()?.first_name} {qrModal()?.last_name || ''}</strong>
            </p>
            <Show when={qrDataUrl()} fallback={<p class="no-qr">Ce client n'a pas encore de QR code.</p>}>
              <img src={qrDataUrl()} alt="QR Code" class="qr-image" />
              <p class="qr-code-text">{qrModal()?.qr_code}</p>
            </Show>
            <div class="modal-actions">
              <button type="button" onClick={() => setQrModal(null)}>Fermer</button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}
