import fs from 'node:fs/promises'
import express from 'express'
import { generateHydrationScript } from 'solid-js/web'

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''

// Create http server
const app = express()
app.use(express.json())

// Route de santé pour Render et autres plateformes
app.get('/santé', (req, res) => res.status(200).json({ ok: true, service: 'lealou-pizza' }))
app.get('/health', (req, res) => res.status(200).json({ ok: true, service: 'lealou-pizza' }))

// API routes - avant Vite
const { createOrder, getOrders, updateOrderStatus } = await import('./api/orders.js')
const { getStamps, redeemPizza, addStamps, transferFromPaper, setStamps, STAMPS_PER_PIZZA } = await import('./api/fidelity.js')
const { listClients, getClient, getClientByQRCode, createClient, updateClient, deleteClient } = await import('./api/clients.js')
const { listMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, seedMenuFromStatic } = await import('./api/menu.js')
const { categories, supplements, menuMeta, rawItemsForSeed } = await import('./api/menuData.js')
const { 
  reorderMenuItem, bulkReorder, resetMenuToDefault, getMenuStats, 
  exportMenu, importMenu, duplicateMenuItem, getAvailablePizzaImages, fixAllImages 
} = await import('./api/menuAdmin.js')

// Seed menu si vide et corriger les images
try { seedMenuFromStatic(rawItemsForSeed) } catch (_) {}
try { fixAllImages() } catch (_) {}

// Routes admin menu (AVANT les routes avec :id pour éviter les conflits)
app.get('/api/menu/admin/stats', (req, res) => {
  try {
    const stats = getMenuStats()
    res.json(stats)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/menu/admin/images', (req, res) => {
  try {
    const images = getAvailablePizzaImages()
    res.json(images)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/menu/admin/export', (req, res) => {
  try {
    const data = exportMenu()
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/menu/admin/import', (req, res) => {
  try {
    const result = importMenu(req.body)
    res.json(result)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

app.post('/api/menu/admin/reset', (req, res) => {
  try {
    const result = resetMenuToDefault()
    res.json(result)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/menu/admin/fix-images', (req, res) => {
  try {
    const result = fixAllImages()
    res.json(result)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/menu/admin/reorder', (req, res) => {
  try {
    const result = bulkReorder(req.body.items)
    res.json(result)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// Routes menu standard
app.get('/api/menu', (req, res) => {
  try {
    const menuItems = listMenuItems()
    res.json({ menuItems, categories, supplements, menuMeta })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/menu', (req, res) => {
  try {
    const item = createMenuItem(req.body)
    res.status(201).json(item)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

app.post('/api/menu/:id/duplicate', (req, res) => {
  try {
    const item = duplicateMenuItem(Number(req.params.id))
    res.status(201).json(item)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

app.patch('/api/menu/:id/reorder', (req, res) => {
  try {
    const result = reorderMenuItem(Number(req.params.id), req.body.sort_order)
    res.json(result)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

app.patch('/api/menu/:id', (req, res) => {
  try {
    const item = updateMenuItem(Number(req.params.id), req.body)
    res.json(item)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

app.delete('/api/menu/:id', (req, res) => {
  try {
    deleteMenuItem(Number(req.params.id))
    res.json({ ok: true })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

app.get('/api/orders', (req, res) => {
  try {
    const status = req.query.status
    const orders = getOrders(status)
    res.json(orders)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/orders', (req, res) => {
  console.log('[API] POST /api/orders received')
  res.setHeader('Content-Type', 'application/json')
  try {
    const body = req.body || {}
    const id = createOrder(body)
    res.status(201).json({ id, ok: true })
  } catch (e) {
    res.status(400).json({ error: e?.message || 'Erreur lors de la création de la commande' })
  }
})

app.get('/api/fidelity', (req, res) => {
  try {
    const phone = req.query.phone
    if (!phone) return res.status(400).json({ error: 'phone required' })
    const stamps = getStamps(phone)
    const client = getClient(phone)
    res.json({ 
      stamps, 
      stampsPerPizza: STAMPS_PER_PIZZA,
      qrCode: client?.qr_code || null,
      clientName: client ? `${client.first_name} ${client.last_name || ''}`.trim() : null
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/clients', (req, res) => {
  try {
    const search = req.query.search || ''
    const clients = listClients(search)
    res.json(clients)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/clients/:phone', (req, res) => {
  try {
    const client = getClient(req.params.phone)
    if (!client) return res.status(404).json({ error: 'Client non trouvé' })
    res.json(client)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/clients', (req, res) => {
  try {
    const client = createClient(req.body)
    res.status(201).json(client)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

app.patch('/api/clients/:phone', (req, res) => {
  try {
    const client = updateClient(req.params.phone, req.body)
    res.json(client)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

app.delete('/api/clients/:phone', (req, res) => {
  try {
    deleteClient(req.params.phone)
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Récupérer un client par QR code
app.get('/api/clients/qr/:qrCode', (req, res) => {
  try {
    const client = getClientByQRCode(req.params.qrCode)
    if (!client) return res.status(404).json({ error: 'Client non trouvé avec ce QR code' })
    res.json(client)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Ajouter un tampon via QR code (scan)
app.post('/api/fidelity/stamp', (req, res) => {
  try {
    const { qrCode, phone } = req.body
    let clientPhone = phone
    
    if (qrCode && !phone) {
      // Format 1: LEALOU:phone (QR basé sur téléphone)
      if (qrCode.startsWith('LEALOU:')) {
        clientPhone = qrCode.replace('LEALOU:', '').replace(/\s/g, '')
      }
      // Format 2: LEALOU-XXXX (QR unique client)
      else if (qrCode.startsWith('LEALOU-')) {
        const client = getClientByQRCode(qrCode)
        if (!client) return res.status(404).json({ error: 'Client non trouvé avec ce QR code' })
        clientPhone = client.phone
      }
      else {
        return res.status(400).json({ error: 'Format QR code invalide' })
      }
    }
    
    if (!clientPhone) return res.status(400).json({ error: 'QR code ou téléphone requis' })
    
    const newStamps = addStamps(clientPhone, 1)
    const client = getClient(clientPhone)
    res.json({ 
      ok: true, 
      stamps: newStamps, 
      stampsPerPizza: STAMPS_PER_PIZZA,
      client: client ? { first_name: client.first_name, last_name: client.last_name } : null
    })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

app.post('/api/fidelity/transfer', (req, res) => {
  try {
    const { phone, stamps } = req.body
    if (!phone) return res.status(400).json({ error: 'phone required' })
    const newTotal = transferFromPaper(phone, stamps || 0)
    res.json({ ok: true, stamps: newTotal })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

app.patch('/api/fidelity/:phone', (req, res) => {
  try {
    const { stamps } = req.body
    const phone = req.params.phone
    if (!phone) return res.status(400).json({ error: 'phone required' })
    const newTotal = setStamps(phone, stamps)
    res.json({ ok: true, stamps: newTotal })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

app.post('/api/fidelity/redeem', (req, res) => {
  try {
    const { phone } = req.body
    if (!phone) return res.status(400).json({ error: 'phone required' })
    const result = redeemPizza(phone)
    res.json(result)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/fidelity/wallet-pass', async (req, res) => {
  try {
    const { phone } = req.body
    if (!phone) return res.status(400).json({ error: 'phone required' })
    const normalized = phone.replace(/\s/g, '')
    const stamps = getStamps(phone)
    const client = getClient(normalized)
    const qrContent = (client?.qr_code) || `LEALOU:${normalized}`
    const apiKey = process.env.ADD_PASS_API_KEY
    if (!apiKey) {
      return res.status(501).json({
        fallback: true,
        qrContent,
        generatorUrl: 'https://app.addpass.io/generator',
        message: 'Utilisez le générateur AddPass (lien ouvert) et collez votre code QR.',
      })
    }
    const clientName = client ? `${client.first_name} ${client.last_name || ''}`.trim() : null
    const payload = {
      backgroundColor: '#8B4513',
      foregroundColor: '#FFFFFF',
      labelColor: '#FFFFFF',
      primaryText: 'Lealou Pizza',
      headerLabelRight: 'Carte fidélité',
      headerTextRight: `${stamps}/10 tampons`,
      secondaryTextLeft: clientName || phone,
      barcode: { format: 'qr', message: qrContent },
      backFields: [
        { label: 'Contact', value: '07 68 34 17 69' },
        { label: 'Site', value: 'https://lealoupizza.fr' },
      ],
    }
    const addRes = await fetch('https://app.addpass.io/api/v1/generate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/pkpass',
      },
      body: JSON.stringify(payload),
    })
    if (!addRes.ok) {
      const err = await addRes.text()
      return res.status(502).json({ error: 'AddPass API error', details: err })
    }
    const buffer = Buffer.from(await addRes.arrayBuffer())
    res.set({ 'Content-Type': 'application/vnd.apple.pkpass', 'Content-Disposition': 'attachment; filename="carte-lealou.pkpass"' })
    res.send(buffer)
  } catch (e) {
    console.error('wallet-pass', e)
    res.status(500).json({ error: e.message })
  }
})

app.patch('/api/orders/:id', (req, res) => {
  try {
    const { status } = req.body
    if (!status) return res.status(400).json({ error: 'status required' })
    updateOrderStatus(Number(req.params.id), status)
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Serve HTML (ne pas renvoyer du HTML pour les requêtes API)
app.use('*all', async (req, res) => {
  if (req.originalUrl.startsWith('/api') || req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Route API non trouvée' })
  }
  try {
    const url = req.originalUrl.replace(base, '')

    /** @type {string} */
    let template
    /** @type {import('./src/entry-server.js').render} */
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url)

    const head = (rendered.head ?? '') + generateHydrationScript()

    const html = template
      .replace(`<!--app-head-->`, head)
      .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({ 
      'Content-Type': 'text/html',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://cloudflareinsights.com"
    }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
const host = '0.0.0.0'
app.listen(port, host, () => {
  console.log(`Server started at http://${host}:${port}`)
  console.log(`Environment: ${isProduction ? 'production' : 'development'}`)
  console.log(`Health check: http://${host}:${port}/health`)
})
