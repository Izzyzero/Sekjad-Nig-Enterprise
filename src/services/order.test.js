import assert from 'node:assert/strict'
import test from 'node:test'
import { api, setAccessToken } from './api.js'
import { getOrder, isWhatsAppOrder } from './order.service.js'

test('whatsapp orders are recognised even when the backend uses alternate field names', () => {
  assert.equal(isWhatsAppOrder({ source: 'whatsapp', paymentStatus: 'pending' }), true)
  assert.equal(isWhatsAppOrder({ channel: 'WhatsApp', paymentStatus: 'pending' }), true)
  assert.equal(isWhatsAppOrder({ salesChannel: 'chat', paymentStatus: 'pending' }), true)
  assert.equal(isWhatsAppOrder({ source: 'web', paymentStatus: 'pending' }), false)
})

test('admin order detail uses the authenticated API and renders customer and purchased items', async () => {
  setAccessToken('admin-token')
  api.defaults.adapter = async (config) => {
    assert.equal(config.url, '/admin/orders/order-1')
    assert.equal(config.headers.Authorization, 'Bearer admin-token')
    return { config, status: 200, headers: {}, data: { data: {
      _id: 'order-1', reference: 'SKJ-1', status: 'successful', amount: 4500000,
      user: { firstName: 'Ada', lastName: 'Okafor', email: 'ada@example.com' },
      items: [{ _id: 'item-1', title: 'Brocade', quantity: 2, unitAmount: 2250000, imageUrl: 'image.jpg' }],
    } } }
  }

  try {
    const order = await getOrder('order-1')
    assert.equal(order.orderNumber, 'SKJ-1')
    assert.equal(order.customerName, 'Ada Okafor')
    assert.equal(order.customerEmail, 'ada@example.com')
    assert.equal(order.total, 45000)
    assert.deepEqual(order.items[0], {
      _id: 'item-1', title: 'Brocade', quantity: 2, unitAmount: 2250000, imageUrl: 'image.jpg',
      id: 'item-1', name: 'Brocade', price: 22500, image: 'image.jpg',
    })
  } finally {
    setAccessToken(null)
    delete api.defaults.adapter
  }
})
