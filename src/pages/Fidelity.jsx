import { createSignal, createEffect } from 'solid-js'
import { Show } from 'solid-js'
import { A } from '@solidjs/router'
import QRCode from 'qrcode'
import './Fidelity.css'

export default function Fidelity() {
  const [phone, setPhone] = createSignal('')
  const [data, setData] = createSignal(null)
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal('')
  const [qrDataUrl, setQrDataUrl] = createSignal('')

  createEffect(() => {
    const d = data()
    const p = phone().trim().replace(/\s/g, '')
    if (d && p) {
      const qrContent = d.qrCode || `LEALOU:${p}`
      QRCode.toDataURL(qrContent, { width: 300, margin: 1 }).then(setQrDataUrl).catch(() => setQrDataUrl(''))
    } else {
      setQrDataUrl('')
    }
  })

  const fetchCard = async (e) => {
    e?.preventDefault()
    const p = phone().trim()
    if (!p) {
      setError('Veuillez entrer votre numéro de téléphone')
      return
    }
    setLoading(true)
    setError('')
    setData(null)
    try {
      const res = await fetch(`/api/fidelity?phone=${encodeURIComponent(p)}`)
      const apiData = await res.json()
      if (!res.ok) throw new Error(apiData.error || 'Erreur')
      setData(apiData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="fidelity-page">
      <div class="container fidelity-container">
        <h1 class="page-title">Ma carte de fidélité</h1>
        <p class="fidelity-intro">
          Consultez vos tampons ! 1 pizza achetée = 1 tampon. 10 tampons = 1 pizza offerte.
        </p>

        <form class="fidelity-form" onSubmit={fetchCard}>
          <label>
            Numéro de téléphone
            <input
              type="tel"
              value={phone()}
              onInput={e => setPhone(e.target.value)}
              placeholder="06 12 34 56 78"
            />
          </label>
          {error() && <p class="fidelity-error">{error()}</p>}
          <button type="submit" class="btn btn-primary" disabled={loading()}>
            {loading() ? 'Chargement...' : 'Consulter ma carte'}
          </button>
        </form>

        <Show when={data()}>
          {(() => {
            const d = data()
            const stampsVal = d.stamps
            const total = 10
            const currentCard = stampsVal % total
            const filled = stampsVal >= total ? total : currentCard
            const freeEarned = stampsVal >= total
            return (
              <div class="fidelity-card">
                <div class="card-header">
                  <img src="/logo-lealou.png" alt="Lealou" class="card-logo" />
                  <h2>Carte de fidélité Lealou</h2>
                </div>
                <Show when={d.clientName}>
                  <p class="client-name">Bonjour, <strong>{d.clientName}</strong></p>
                </Show>
                <p class="stamps-count">
                  <strong>{stampsVal >= total ? total : currentCard}</strong> tampon{(stampsVal >= total ? total : currentCard) > 1 ? 's' : ''} sur {total}
                  {stampsVal >= total && (
                    <span class="bonus"> — Pizza gratuite à réclamer !</span>
                  )}
                </p>
                <div class="stamps-grid-11">
                  {Array.from({ length: total }, (_, i) => (
                    <div
                      classList={{ stamp: true, filled: i < filled }}
                      title={i < filled ? 'Tampon obtenu' : 'À gagner'}
                    >
                      {i < filled ? '🍕' : (i + 1)}
                    </div>
                  ))}
                  <div
                    classList={{ stamp: true, 'stamp-gratuit': true, filled: freeEarned }}
                    title={freeEarned ? 'Pizza gratuite à réclamer !' : '11ème - Gratuit'}
                  >
                    {freeEarned ? '🎁' : ''}
                    <span class="gratuit-label">Gratuit</span>
                  </div>
                </div>
                <p class="card-footer">
                  {freeEarned
                    ? "🎉 Félicitations ! Présentez ce QR code en caisse pour obtenir votre pizza gratuite."
                    : `${total - filled} tampon${total - filled > 1 ? 's' : ''} restant${total - filled > 1 ? 's' : ''} pour une pizza offerte.`}
                </p>
                
                <Show when={qrDataUrl()}>
                  <div class="qr-section">
                    <p class="qr-label">Votre QR code unique</p>
                    <img src={qrDataUrl()} alt="QR code carte client" class="qr-code-large" />
                    <p class="qr-info">Présentez ce QR code en caisse pour valider vos tampons</p>
                  </div>
                </Show>
              </div>
            )
          })()}
        </Show>

        <A href="/menu" class="fidelity-link">Voir le menu</A>
      </div>
    </div>
  )
}

