import { createSignal, onMount, onCleanup } from 'solid-js'
import { A } from '@solidjs/router'
import { Show } from 'solid-js'
import { Html5Qrcode } from 'html5-qrcode'
import './AdminScanner.css'

const STAMPS_PER_PIZZA = 10

export default function AdminScanner() {
  const [scanning, setScanning] = createSignal(false)
  const [result, setResult] = createSignal(null)
  const [error, setError] = createSignal('')
  const [processing, setProcessing] = createSignal(false)
  const [showSuccess, setShowSuccess] = createSignal(false)
  let scanner = null
  let scannerDiv

  const startScanner = async () => {
    if (scanner) return
    setError('')
    setResult(null)
    
    try {
      scanner = new Html5Qrcode('qr-reader')
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        () => {}
      )
      setScanning(true)
    } catch (err) {
      setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.')
      console.error(err)
    }
  }

  const stopScanner = async () => {
    if (scanner) {
      try {
        await scanner.stop()
      } catch (_) {}
      scanner = null
    }
    setScanning(false)
  }

  const onScanSuccess = async (decodedText) => {
    if (processing()) return
    
    await stopScanner()
    setProcessing(true)
    setError('')
    
    try {
      const res = await fetch('/api/fidelity/stamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode: decodedText }),
      })
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la validation')
      }
      
      setResult({
        ...data,
        qrCode: decodedText,
        freeEarned: data.stamps >= STAMPS_PER_PIZZA && (data.stamps % STAMPS_PER_PIZZA === 0),
      })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const redeemPizza = async () => {
    const r = result()
    if (!r) return
    
    setProcessing(true)
    try {
      let clientPhone = null
      
      // Format LEALOU:phone
      if (r.qrCode.startsWith('LEALOU:')) {
        clientPhone = r.qrCode.replace('LEALOU:', '').replace(/\s/g, '')
      }
      // Format LEALOU-XXXX (client unique)
      else if (r.qrCode.startsWith('LEALOU-')) {
        const clientRes = await fetch(`/api/clients/qr/${encodeURIComponent(r.qrCode)}`)
        const client = await clientRes.json()
        if (!clientRes.ok) throw new Error(client.error)
        clientPhone = client.phone
      }
      
      if (!clientPhone) throw new Error('Format QR code invalide')
      
      const res = await fetch('/api/fidelity/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: clientPhone }),
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      setResult(prev => ({
        ...prev,
        stamps: data.stamps,
        freeEarned: false,
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  onMount(() => {
    startScanner()
  })

  onCleanup(() => {
    stopScanner()
  })

  return (
    <div class="admin-scanner">
      <header class="admin-header">
        <div class="container admin-header-inner">
          <h1>Scanner Fidélité</h1>
          <A href="/admin">Retour au tableau de bord</A>
        </div>
      </header>

      <main class="container scanner-main">
        <p class="scanner-instructions">
          Scannez le QR code du client pour ajouter un tampon à sa carte de fidélité.
        </p>

        <div class="scanner-area">
          <div id="qr-reader" ref={scannerDiv}></div>
          
          <Show when={!scanning() && !processing()}>
            <button class="btn-start" onClick={startScanner}>
              Démarrer le scanner
            </button>
          </Show>
          
          <Show when={scanning()}>
            <button class="btn-stop" onClick={stopScanner}>
              Arrêter le scanner
            </button>
          </Show>
          
          <Show when={processing()}>
            <p class="processing">Traitement en cours...</p>
          </Show>
        </div>

        <Show when={error()}>
          <div class="scanner-error">
            <p>{error()}</p>
            <button onClick={startScanner}>Réessayer</button>
          </div>
        </Show>

        <Show when={result()}>
          <div classList={{ 'scanner-result': true, 'success': showSuccess() }}>
            <div class="result-header">
              <span class="checkmark">✓</span>
              <h3>Tampon validé !</h3>
            </div>
            <Show when={result().client}>
              <p class="client-name">
                {result().client.first_name} {result().client.last_name || ''}
              </p>
            </Show>
            <p class="stamps-count">
              <strong>{result().stamps}</strong> tampon{result().stamps > 1 ? 's' : ''} / {STAMPS_PER_PIZZA}
            </p>
            <div class="stamps-progress">
              <div 
                class="stamps-bar" 
                style={{ width: `${Math.min((result().stamps % STAMPS_PER_PIZZA || (result().stamps >= STAMPS_PER_PIZZA ? STAMPS_PER_PIZZA : 0)) / STAMPS_PER_PIZZA * 100, 100)}%` }}
              ></div>
            </div>
            
            <Show when={result().stamps >= STAMPS_PER_PIZZA}>
              <div class="free-pizza-alert">
                <span class="pizza-icon">🍕</span>
                <p>
                  <strong>Pizza gratuite disponible !</strong><br />
                  Le client a droit à {Math.floor(result().stamps / STAMPS_PER_PIZZA)} pizza(s) offerte(s).
                </p>
                <button class="btn-redeem" onClick={redeemPizza} disabled={processing()}>
                  Valider la pizza gratuite
                </button>
              </div>
            </Show>
            
            <button class="btn-scan-again" onClick={startScanner}>
              Scanner un autre client
            </button>
          </div>
        </Show>
      </main>
    </div>
  )
}
