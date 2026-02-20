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
const { listClients, getClient, createClient, updateClient, deleteClient } = await import('./api/clients.js')

app.get('/api/menu', async (req, res) => {
  const { menuItems, categories, supplements, menuMeta } = await import('./api/menuData.js')
  res.json({ menuItems, categories, supplements, menuMeta })
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
    res.json({ stamps, stampsPerPizza: STAMPS_PER_PIZZA })
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

app.post('/api/fidelity/stamp', (req, res) => {
  try {
    const { phone } = req.body
    if (!phone) return res.status(400).json({ error: 'phone required' })
    const current = getStamps(phone)
    if (current >= STAMPS_PER_PIZZA) {
      const result = redeemPizza(phone)
      res.json({ ok: true, stamps: result.stamps, redeemed: true })
    } else {
      const newTotal = addStamps(phone, 1)
      res.json({ ok: true, stamps: newTotal, redeemed: false })
    }
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

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
