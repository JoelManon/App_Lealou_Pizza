import { createSignal } from 'solid-js'
import { Show } from 'solid-js'
import { A } from '@solidjs/router'
import './Fidelity.css'

export default function Fidelity() {
  const [phone, setPhone] = createSignal('')
  const [data, setData] = createSignal(null)
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal('')

  const fetchCard = async (e) => {
    e?.preventDefault()
    const p = phone().trim()
    if (!p) {
      setError('Veuillez entrer votre numéro de téléphone')
      return
    }
    setLoading(true)
    setError('')
    setStamps(null)
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
            const total = d.stampsPerPizza || 10
            const currentCard = stampsVal % total
            const filled = Math.min(currentCard, total)
            return (
              <div class="fidelity-card">
                <div class="card-header">
                  <img src="/logo-lealou.png" alt="Lealou" class="card-logo" />
                  <h2>Carte de fidélité Lealou</h2>
                </div>
                <p class="stamps-count">
                  <strong>{filled}</strong> tampon{filled > 1 ? 's' : ''} sur {total}
                  {stampsVal >= total && (
                    <span class="bonus"> (+{Math.floor(stampsVal / total)} pizza(s) offerte(s) à réclamer)</span>
                  )}
                </p>
                <div class="stamps-grid">
                  {Array.from({ length: total }, (_, i) => (
                    <div
                      classList={{ stamp: true, filled: i < filled }}
                      title={i < filled ? 'Tampon obtenu' : 'À gagner'}
                    >
                      {i < filled ? '🍕' : ''}
                    </div>
                  ))}
                </div>
                <p class="card-footer">
                  {filled >= total
                    ? "🎉 Vous avez droit à une pizza offerte ! Présentez cette carte en caisse."
                    : `${total - filled} tampon${total - filled > 1 ? 's' : ''} restant${total - filled > 1 ? 's' : ''} pour une pizza offerte.`}
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

