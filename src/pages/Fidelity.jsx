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
      QRCode.toDataURL(`LEALOU:${p}`).then(setQrDataUrl).catch(() => setQrDataUrl(''))
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
          Consultez vos tampons ! 1 pizza achetée = 1 tampon. 10 tampons + le 11ᵉ Gratuit = 1 pizza offerte.
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
            const stampsToEarn = d.stampsPerPizza || 10
            const filledNormal = Math.min(stampsVal, stampsToEarn)
            const hasGratuit = stampsVal >= stampsToEarn
            return (
              <div class="fidelity-card">
                <div class="card-header">
                  <img src="/logo-lealou.png" alt="Lealou" class="card-logo" />
                  <h2>Carte de fidélité Lealou</h2>
                </div>
                {qrDataUrl() && (
                  <div class="qr-show-section">
                    <p class="qr-label">QR code unique avec flash simple — un seul flash à chaque fois</p>
                    <img src={qrDataUrl()} alt="QR fidélité" class="qr-image" />
                  </div>
                )}
                <p class="stamps-count">
                  <strong>{filledNormal}</strong> tampon{filledNormal > 1 ? 's' : ''} sur {stampsToEarn}
                  {hasGratuit && <span class="bonus"> + Gratuit ✓</span>}
                </p>
                <div class="stamps-grid stamps-grid-11">
                  {Array.from({ length: stampsToEarn }, (_, i) => (
                    <div
                      classList={{ stamp: true, filled: i < filledNormal }}
                      title={i < filledNormal ? 'Tampon obtenu' : 'À gagner'}
                    >
                      {i < filledNormal ? '🍕' : ''}
                    </div>
                  ))}
                  <div
                    classList={{ stamp: true, 'stamp-gratuit': true, filled: hasGratuit }}
                    title={hasGratuit ? 'Pizza offerte à réclamer' : 'Gratuit (après 10 tampons)'}
                  >
                    <img src="/stamp-gratuit.png" alt="Gratuit" class="stamp-gratuit-img" />
                  </div>
                </div>
                <p class="card-footer">
                  {hasGratuit
                    ? "🎉 Vous avez droit à une pizza offerte ! Montrez ce QR en caisse pour la valider."
                    : `${stampsToEarn - filledNormal} tampon${stampsToEarn - filledNormal > 1 ? 's' : ''} restant${stampsToEarn - filledNormal > 1 ? 's' : ''} pour débloquer le Gratuit.`}
                </p>
              </div>
            )
          })()}
        </Show>

        <A href="/menu" class="fidelity-link">Voir le menu</A>
      </div>
    </div>
  )
}

