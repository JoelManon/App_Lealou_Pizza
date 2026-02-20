import { createSignal, onMount, onCleanup } from 'solid-js'
import './FidelityScanner.css'

const LEALOU_PREFIX = 'LEALOU:'

export default function FidelityScanner() {
  const [status, setStatus] = createSignal('idle') // idle | scanning | success | error
  const [message, setMessage] = createSignal('')
  const [scanner, setScanner] = createSignal(null)

  onMount(async () => {
    const el = document.getElementById('qr-reader')
    if (!el || typeof document === 'undefined') return

    const { Html5Qrcode } = await import('html5-qrcode')
    const html5Qr = new Html5Qrcode('qr-reader')
    setScanner(html5Qr)

    html5Qr
      .start(
        { facingMode: 'environment' },
        { fps: 5, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        () => {}
      )
      .then(() => setStatus('scanning'))
      .catch(err => {
        setStatus('error')
        setMessage('Caméra non disponible. Vérifiez les permissions.')
        console.error(err)
      })

    let processing = false
    function onScanSuccess(decodedText) {
      if (processing) return
      if (!decodedText.startsWith(LEALOU_PREFIX)) return

      const phone = decodedText.slice(LEALOU_PREFIX.length).replace(/\s/g, '')
      if (!phone) return

      processing = true
      setStatus('success')
      setMessage('Tampon ajouté !')

      fetch('/api/fidelity/stamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.ok) {
            if (data.redeemed) {
              setMessage('Pizza offerte validée ! Compteur remis à 0.')
            } else {
              const total = data.stamps ?? 0
              const msg = total >= 10
                ? `+1 tampon ! Total: ${total}. 🎉 Pizza offerte à réclamer !`
                : `+1 tampon ! Total: ${total}`
              setMessage(msg)
            }
          } else {
            setMessage("Erreur lors de l'ajout du tampon")
          }
        })
        .catch(() => setMessage('Erreur réseau'))
        .finally(() => {
          setTimeout(() => {
            processing = false
            setStatus('scanning')
            setMessage('')
          }, 2000)
        })
    }
  })

  onCleanup(() => {
    const s = scanner()
    if (s?.isScanning) {
      s.stop().catch(() => {})
    }
  })

  return (
    <section class="fidelity-scanner-section">
      <h2>Flasher le QR client</h2>
      <p class="scanner-hint">Le client montre son QR sur la page fidélité. Placez-le dans le cadre.</p>
      <div
        id="qr-reader"
        class="qr-reader-box"
        classList={{ scanning: status() === 'scanning', success: status() === 'success' }}
      />
      {message() && (
        <p class="scanner-feedback" classList={{ success: status() === 'success', error: status() === 'error' }}>
          {message()}
        </p>
      )}
      {status() === 'error' && (
        <p class="scanner-error-hint">Rechargez la page et autorisez l'accès à la caméra.</p>
      )}
    </section>
  )
}
