// Run with: node scripts/verify-preview-flows.mjs
// Uses an isolated headless Chromium profile and a local mock API; no live writes.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createServer } from 'vite'

const browserPath = process.env.BROWSER_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync)
assert.ok(browserPath, 'Set BROWSER_PATH to a Chromium browser executable')
const requests = []
let mode = 'success'
const products = Array.from({ length: 6 }, (_, index) => ({
  _id: `p${index}`, title: `Preview Fabric ${index}`, slug: `fabric-${index}`,
  price: 5000, compareAtPrice: 6000, currency: 'NGN', isFeatured: true,
  image: { url: '/favicon.svg', altText: `Sample ${index}` }, categories: [],
}))
const user = { id: 'user1', firstName: 'Test', lastName: 'Customer', email: 'test@example.com' }
const server = await createServer({
  server: { host: '127.0.0.1', port: 0 },
  define: { 'import.meta.env.VITE_API_URL': JSON.stringify('/api/v1'), 'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify('') },
  plugins: [{ name: 'mock-preview-api', configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (!req.url.startsWith('/api/v1/')) return next()
      const path = req.url.slice('/api/v1'.length)
      requests.push({ path, method: req.method, token: req.headers.authorization })
      res.setHeader('Content-Type', 'application/json')
      const send = (data, status = 200) => { res.statusCode = status; res.end(JSON.stringify({ success: status === 200, data })) }
      if (path.startsWith('/products/preview/')) {
        if (mode === 'error') return send(null, 500)
        if (mode === 'loading') return setTimeout(() => send(products), 1200)
        return send(mode === 'empty' ? [] : products)
      }
      if (path === '/auth/login' || path === '/auth/refresh') return send({ accessToken: 'test-token', user })
      if (req.headers.authorization !== 'Bearer test-token') return send(null, 401)
      if (path === '/auth/me') return send({ user })
      if (path === '/auth/logout') return send({})
      if (path.startsWith('/products?')) return send(products)
      if (path.startsWith('/products/')) return send(products[0])
      if (path.startsWith('/cart')) return send({ items: [], subtotal: 0 })
      if (path.startsWith('/wishlist')) return send({ products: [] })
      if (path.startsWith('/categories')) return send([])
      return send([])
    })
  } }],
})
await server.listen()
const base = `http://127.0.0.1:${server.httpServer.address().port}`
const profile = await mkdtemp(join(tmpdir(), 'sekjad-preview-'))
const browser = spawn(browserPath, ['--headless=new', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' })
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let socket
try {
  let port
  for (let i = 0; i < 100; i++) {
    try { port = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break } catch { await sleep(100) }
  }
  assert.ok(port, 'Browser debugging port available')
  const pages = await (await fetch(`http://127.0.0.1:${port}/json`, { signal: AbortSignal.timeout(10000) })).json()
  socket = new WebSocket(pages.find((page) => page.type === 'page').webSocketDebuggerUrl)
  await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }))
  let id = 0
  const pending = new Map()
  const runtimeErrors = []
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data)
    if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params.exceptionDetails.text)
    if (message.id) {
      const callbacks = pending.get(message.id)
      pending.delete(message.id)
      if (message.error) callbacks.reject(new Error(message.error.message))
      else callbacks.resolve(message.result)
    }
  })
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Browser command timed out: ${method}`)), 15000)
    pending.set(++id, { resolve: (value) => { clearTimeout(timer); resolve(value) }, reject: (error) => { clearTimeout(timer); reject(error) } }); socket.send(JSON.stringify({ id, method, params }))
  })
  const evaluate = async (expression) => {
    const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (result.exceptionDetails) throw new Error(`${expression}: ${result.exceptionDetails.exception?.description ?? result.exceptionDetails.text}`)
    return result.result.value
  }
  const waitFor = async (expression) => {
    for (let i = 0; i < 150; i++) { if (await evaluate(expression)) return; await sleep(100) }
    throw new Error(`Timed out: ${expression}; page: ${await evaluate('document.body.innerText')}`)
  }
  const visit = async (path) => { await call('Page.navigate', { url: base + path }); await waitFor('document.readyState === "complete" && !!document.querySelector("#root")') }
  const landing = async () => { await visit('/'); await waitFor('document.querySelectorAll("article").length === 12') }
  await call('Runtime.enable')
  await call('Network.enable')
  await call('Network.setBlockedURLs', { urls: ['https://*'] })
  await landing()
  assert.equal(requests.length, 2)
  assert.ok(requests.every((r) => r.path.startsWith('/products/preview/') && !r.path.includes('?') && !r.token))
  assert.equal(await evaluate(`document.querySelectorAll('img[alt="Sample 0"]').length`), 2)
  console.log('PASS guest previews: six per section, public requests only, no refresh')

  for (const path of ['/shop?sort=newest', '/shop/product/p0', '/product/p0', '/cart', '/wishlist', '/checkout', '/checkout/return?reference=ref1', '/orders']) {
    const count = requests.length
    await visit(path)
    await waitFor('location.pathname === "/login" && !!document.querySelector("input[type=password]")')
    assert.equal(await evaluate('history.state.usr.from.pathname + history.state.usr.from.search'), path)
    assert.equal(requests.length, count, `Guest must not request protected API for ${path}`)
  }
  console.log('PASS direct guest routes: blocked with destination/query preserved and zero protected requests')

  for (const selector of ['document.querySelector("article a")', 'document.querySelector("article button[aria-label]")', 'Array.from(document.querySelectorAll("article button")).find(b=>b.textContent.includes("Add to Cart"))', 'Array.from(document.querySelectorAll("a")).find(a=>a.textContent.includes("View all products"))']) {
    await landing()
    const count = requests.length
    await evaluate(`${selector}.click()`)
    await waitFor('location.pathname === "/login"')
    assert.equal(requests.length, count)
    assert.ok(await evaluate('history.state.usr.from.pathname.startsWith("/shop")'))
  }
  console.log('PASS guest product links, wishlist, cart and View all require login before requests')

  await visit('/shop/product/p0?source=preview')
  await waitFor('location.pathname === "/login" && !!document.querySelector("input[type=password]")')
  await evaluate(`(() => {
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    for (const [selector,value] of [['input[type=email]','test@example.com'],['input[type=password]','password123']]) {
      const input=document.querySelector(selector); set.call(input,value); input.dispatchEvent(new Event('input',{bubbles:true}));
    }
    document.querySelector('form').requestSubmit();
  })()`)
  await waitFor('location.pathname === "/shop/product/p0" && document.body.innerText.includes("Preview Fabric 0")')
  assert.equal(await evaluate('location.search'), '?source=preview')
  assert.ok(requests.some((r) => r.path === '/products/p0' && r.token === 'Bearer test-token'))
  await landing()
  await evaluate('Array.from(document.querySelectorAll("article button")).find(b=>b.textContent.includes("Add to Cart")).click()')
  await sleep(300)
  await evaluate('document.querySelector("article button[aria-label]").click()')
  await sleep(300)
  assert.ok(requests.some((r) => r.path === '/cart/items' && r.method === 'POST' && r.token === 'Bearer test-token'))
  assert.ok(requests.some((r) => r.path === '/wishlist/items' && r.method === 'POST' && r.token === 'Bearer test-token'))
  await visit('/shop')
  await waitFor('document.querySelectorAll("article").length > 0')
  assert.ok(requests.some((r) => r.path.startsWith('/products?') && r.token === 'Bearer test-token'))
  console.log('PASS login return, session reload, catalog/detail and authenticated cart/wishlist bearer requests')

  await evaluate('localStorage.clear()')
  mode = 'loading'; await visit('/'); await waitFor('document.body.innerText.includes("Loading latest arrivals")'); await waitFor('document.querySelectorAll("article").length === 12')
  mode = 'empty'; await visit('/'); await waitFor('document.body.innerText.includes("No latest arrivals yet")'); assert.equal(await evaluate('document.querySelectorAll("article").length'), 0)
  mode = 'error'; await visit('/'); await waitFor('document.body.innerText.includes("Could not load featured products")')
  const count = requests.length; await sleep(1500); assert.equal(requests.length, count)
  mode = 'success'; await evaluate('Array.from(document.querySelectorAll("button")).filter(b=>b.textContent.includes("Try again")).forEach(b=>b.click())'); await waitFor('document.querySelectorAll("article").length === 12')
  assert.deepEqual(runtimeErrors, [])
  console.log('PASS loading, empty, error, manual retry and no repeated error requests; no runtime exceptions')
} finally {
  socket?.close()
  browser.kill()
  await server.close()
}
