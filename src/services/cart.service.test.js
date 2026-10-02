import assert from 'node:assert/strict'
import test from 'node:test'
import { api, setAccessToken } from './api.js'
import { cartService, normalizeCart } from './cart.service.js'

const cartResponse = (config, items, subtotal) => ({
  config,
  status: 200,
  headers: {},
  data: { data: { items, subtotal, currency: 'NGN' } },
})

test('cart normalization preserves separate variant lines, server pricing and legacy nulls', () => {
  const cart = normalizeCart({
    data: {
      items: [
        {
          cartItemId: 'line-red',
          productId: 'fabric-1',
          variantId: 'variant-red',
          colorName: 'Red',
          selectedImage: { url: 'red.jpg' },
          quantity: 2,
          price: 1250,
          product: { title: 'Fabric', image: { url: 'main.jpg' } },
        },
        {
          cartItemId: 'line-blue',
          productId: 'fabric-1',
          variantId: 'variant-blue',
          colorName: 'Blue',
          selectedImage: 'blue.jpg',
          quantity: 1,
          price: 1300,
          product: { title: 'Fabric' },
        },
        {
          cartItemId: 'line-legacy',
          productId: 'fabric-2',
          variantId: null,
          colorName: null,
          selectedImage: null,
          quantity: 1,
          price: 500,
          product: { title: 'Legacy fabric', image: { url: 'legacy.jpg' } },
        },
      ],
      subtotal: 4300,
    },
  })

  assert.deepEqual(cart.items.map(({ cartItemId, productId, variantId, colorName, image, quantity }) => ({
    cartItemId, productId, variantId, colorName, image, quantity,
  })), [
    { cartItemId: 'line-red', productId: 'fabric-1', variantId: 'variant-red', colorName: 'Red', image: 'red.jpg', quantity: 2 },
    { cartItemId: 'line-blue', productId: 'fabric-1', variantId: 'variant-blue', colorName: 'Blue', image: 'blue.jpg', quantity: 1 },
    { cartItemId: 'line-legacy', productId: 'fabric-2', variantId: null, colorName: null, image: 'legacy.jpg', quantity: 1 },
  ])
  assert.deepEqual(cart.items.map((item) => item.cartItemId), ['line-red', 'line-blue', 'line-legacy'])
  assert.equal(cart.items[0].price, 1250)
  assert.equal(cart.subtotal, 4300)
})

test('adding, updating and removing use variant request identity and authoritative cart lines', async () => {
  const previousAdapter = api.defaults.adapter
  const previousToken = 'cart-test-token'
  const requests = []
  const backendLines = []
  let nextId = 1
  setAccessToken(previousToken)
  api.defaults.adapter = async (config) => {
    const method = config.method.toLowerCase()
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
    requests.push({ method, url: config.url, body })

    if (method === 'post' && config.url === '/cart/items') {
      const match = backendLines.find((line) => line.productId === body.productId && line.variantId === (body.variantId ?? null))
      if (match) match.quantity += body.quantity
      else backendLines.push({
        cartItemId: `cart-line-${nextId++}`,
        productId: body.productId,
        variantId: body.variantId ?? null,
        colorName: body.variantId === 'red-id' ? 'Red' : body.variantId === 'blue-id' ? 'Blue' : null,
        selectedImage: body.variantId ? `${body.variantId}.jpg` : null,
        quantity: body.quantity,
        price: body.variantId === 'blue-id' ? 200 : 100,
        product: { title: 'Fabric', image: { url: 'product.jpg' } },
      })
    } else if (method === 'patch') {
      const line = backendLines.find((item) => item.cartItemId === decodeURIComponent(config.url.split('/').at(-1)))
      if (line) line.quantity = body.quantity
    } else if (method === 'delete' && config.url.startsWith('/cart/items/')) {
      const lineId = decodeURIComponent(config.url.split('/').at(-1))
      backendLines.splice(backendLines.findIndex((item) => item.cartItemId === lineId), 1)
    }

    const items = backendLines.map((line) => ({ ...line }))
    return cartResponse(config, items, items.reduce((sum, line) => sum + line.price * line.quantity, 0))
  }

  try {
    const redCart = await cartService.addItem({ productId: 'fabric-1', variantId: 'red-id', quantity: 1 })
    const blueCart = await cartService.addItem({ productId: 'fabric-1', variantId: 'blue-id', quantity: 1 })
    const redAgainCart = await cartService.addItem({ productId: 'fabric-1', variantId: 'red-id', quantity: 1 })
    assert.deepEqual(redCart.items.map((item) => item.cartItemId), ['cart-line-1'])
    assert.deepEqual(blueCart.items.map((item) => item.variantId), ['red-id', 'blue-id'])
    assert.deepEqual(redAgainCart.items.map((item) => [item.variantId, item.quantity]), [['red-id', 2], ['blue-id', 1]])

    const updated = await cartService.updateItemQuantity('cart-line-2', 4)
    assert.deepEqual(updated.items.map((item) => [item.cartItemId, item.quantity]), [['cart-line-1', 2], ['cart-line-2', 4]])
    const removed = await cartService.removeItem('cart-line-1')
    assert.deepEqual(removed.items.map((item) => [item.cartItemId, item.variantId, item.quantity]), [['cart-line-2', 'blue-id', 4]])
    assert.deepEqual(requests.slice(0, 3).map(({ method, url, body }) => [method, url, body]), [
      ['post', '/cart/items', { productId: 'fabric-1', variantId: 'red-id', quantity: 1 }],
      ['post', '/cart/items', { productId: 'fabric-1', variantId: 'blue-id', quantity: 1 }],
      ['post', '/cart/items', { productId: 'fabric-1', variantId: 'red-id', quantity: 1 }],
    ])
    assert.equal(requests[3].url, '/cart/items/cart-line-2')
    assert.deepEqual(requests[3].body, { quantity: 4 })
    assert.equal(requests[4].url, '/cart/items/cart-line-1')
  } finally {
    api.defaults.adapter = previousAdapter
    setAccessToken(null)
  }
})

test('products without variants omit variantId and saved cart selections reload from API', async () => {
  const previousAdapter = api.defaults.adapter
  const requests = []
  setAccessToken('cart-test-token')
  api.defaults.adapter = async (config) => {
    requests.push(config)
    return cartResponse(config, [{
      cartItemId: 'saved-line',
      productId: 'plain-product',
      variantId: null,
      colorName: null,
      selectedImage: null,
      quantity: 1,
      price: 900,
      product: { title: 'Plain product', image: { url: 'plain.jpg' } },
    }], 900)
  }
  try {
    const added = await cartService.addItem({ productId: 'plain-product', quantity: 1 })
    assert.deepEqual(JSON.parse(requests[0].data), { productId: 'plain-product', quantity: 1 })
    const reloaded = await cartService.get()
    assert.deepEqual(reloaded.items[0], added.items[0])
    assert.equal(reloaded.items[0].variantId, null)
    assert.equal(reloaded.items[0].colorName, null)
    assert.equal(reloaded.items[0].image, 'plain.jpg')
  } finally {
    api.defaults.adapter = previousAdapter
    setAccessToken(null)
  }
})
