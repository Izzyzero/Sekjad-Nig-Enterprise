import assert from 'node:assert/strict'
import test from 'node:test'
import { api, setAccessToken } from './api.js'
import { checkoutFingerprint, loadCheckoutAttempt, saveCheckoutAttempt, prepareWhatsAppOrder, completeWhatsAppOrder, openWhatsAppOrder } from './whatsapp-order.service.js'

const storage = () => {
  const values = new Map()
  return { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) }
}

test('retry and reload preserve checkout keys and returned order; cart edits and users get new attempts', () => {
  const cache = storage()
  const cart = [{ id: 'a', quantity: 2, price: 500 }]
  const fingerprint = checkoutFingerprint(cart)
  const attempt = loadCheckoutAttempt(cache, 'user-a', fingerprint, () => 'first-key')
  saveCheckoutAttempt(cache, 'user-a', attempt)
  assert.equal(loadCheckoutAttempt(cache, 'user-a', fingerprint).key, 'first-key')
  attempt.order = { reference: 'wa_1', message: 'Saved message' }
  saveCheckoutAttempt(cache, 'user-a', attempt)
  assert.deepEqual(loadCheckoutAttempt(cache, 'user-a', fingerprint).order, attempt.order)
  for (const updated of [
    [{ ...cart[0], quantity: 3 }],
    [{ ...cart[0], price: 600 }],
    [{ ...cart[0], id: 'b' }],
    [{ ...cart[0], productId: cart[0].id, variantId: 'red-id' }],
    [{ ...cart[0], productId: cart[0].id, variantId: 'blue-id' }],
  ]) {
    const next = loadCheckoutAttempt(cache, 'user-a', checkoutFingerprint(updated), () => 'new-key')
    assert.equal(next.key, 'new-key')
    assert.equal(next.order, null)
  }
  assert.equal(loadCheckoutAttempt(cache, 'user-b', fingerprint, () => 'other-user').key, 'other-user')
})

test('WhatsApp checkout posts only an empty body with authentication and a stable idempotency key', async () => {
  const original = api.defaults.adapter
  const requests = []
  const order = {
    orderId: '1',
    reference: 'wa_1',
    amount: 2500,
    currency: 'NGN',
    paymentStatus: 'pending',
    items: [{ productId: 'fabric-1', variantId: 'red-id', colorName: 'Red', quantity: 2, unitAmount: 1250, variantImageUrl: 'red.jpg' }],
    message: 'Server order message with Red x 2',
    whatsappUrl: 'https://wa.me/2349165151867?text=Server%20order%20message',
  }
  setAccessToken('token')
  api.defaults.adapter = async (config) => {
    requests.push(config)
    if (requests.length === 1) throw new Error('Network unavailable')
    return { config, data: { success: true, data: order }, status: 200, headers: {} }
  }
  try {
    await assert.rejects(prepareWhatsAppOrder('same-uuid'), /Network unavailable/)
    assert.deepEqual(await prepareWhatsAppOrder('same-uuid'), order)
    for (const request of requests) {
      assert.equal(request.url, '/orders/whatsapp')
      assert.equal(request.method, 'post')
      assert.equal(request.headers['Idempotency-Key'], 'same-uuid')
      assert.equal(request.headers.Authorization, 'Bearer token')
      assert.deepEqual(JSON.parse(request.data), {})
    }
  } finally { api.defaults.adapter = original; setAccessToken(null) }
})

test('backend errors remain available for UI and unsafe WhatsApp URLs are rejected', async () => {
  const original = api.defaults.adapter
  try {
    for (const status of [400, 429, 503]) {
      api.defaults.adapter = async (config) => { throw { config, response: { status, data: { message: 'Not available' }, headers: { 'retry-after': '900' } } } }
      await assert.rejects(prepareWhatsAppOrder('key'), (error) => error.response.status === status)
    }
    api.defaults.adapter = async (config) => ({ config, status: 200, headers: {}, data: { data: { whatsappUrl: 'javascript:alert(1)', message: 'Order' } } })
    await assert.rejects(prepareWhatsAppOrder('key'), /Could not open/)
  } finally { api.defaults.adapter = original }
})

test('successful WhatsApp order does not clear the cart automatically', async () => {
  let clearCalls = 0
  const order = { reference: 'wa_2', message: 'Message', whatsappUrl: 'https://wa.me/2348000000000?text=hello' }

  const result = await completeWhatsAppOrder({
    order,
    clearCart: async () => {
      clearCalls += 1
      return { success: true }
    },
    invalidateCart: () => {
      clearCalls += 1
    },
  })

  assert.equal(clearCalls, 0)
  assert.deepEqual(result, order)
})

test('WhatsApp links use same-tab navigation and fall back if location assign is unavailable', () => {
  const calls = []
  const windowLike = {
    open: (url) => {
      calls.push(['open', url])
      return { closed: false }
    },
    location: { assign: (url) => calls.push(['assign', url]) },
  }

  const result = openWhatsAppOrder('https://wa.me/2348000000000?text=hello', windowLike)
  assert.equal(result, true)
  assert.deepEqual(calls, [['assign', 'https://wa.me/2348000000000?text=hello']])

  const blocked = {
    open: () => null,
    location: {},
  }
  assert.equal(openWhatsAppOrder('https://wa.me/2348000000000?text=blocked', blocked), false)
})

test('changing only the selected color changes the checkout fingerprint and starts a new attempt', () => {
  const red = [{ productId: 'fabric-1', cartItemId: 'line-red', variantId: 'red-id', quantity: 1, price: 500 }]
  const blue = [{ ...red[0], cartItemId: 'line-blue', variantId: 'blue-id' }]
  assert.notEqual(checkoutFingerprint(red), checkoutFingerprint(blue))
})
