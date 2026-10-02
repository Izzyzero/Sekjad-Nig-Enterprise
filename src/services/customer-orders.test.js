import assert from 'node:assert/strict'
import test from 'node:test'
import { api, setAccessToken } from './api.js'
import { customerOrdersService, normalizeCustomerOrders } from './customer-orders.service.js'

test('empty API data stays empty', () => {
  assert.deepEqual(normalizeCustomerOrders({ data: { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } } }).orders, [])
})

test('loads customer orders through the authenticated API and normalizes the list', async () => {
  setAccessToken('customer-token')
  api.defaults.adapter = async (config) => {
    assert.equal(config.url, '/orders')
    assert.equal(config.params.page, 2)
    assert.equal(config.params.limit, 10)
    assert.equal(config.headers.Authorization, 'Bearer customer-token')
    return { config, status: 200, headers: {}, data: { data: [{
      _id: 'order-1', reference: 'SKJ-1', status: 'successful', amount: 4500000, currency: 'NGN',
      createdAt: '2026-09-13T12:00:00Z', items: [{
        title: 'Brocade', variantId: 'red-id', colorName: 'Red', quantity: 2,
        unitAmount: 2250000, imageUrl: 'image.jpg', variantImageUrl: 'red.jpg',
      }],
    }], pagination: { page: 2, limit: 10, total: 11, pages: 2 } } }
  }
  const result = await customerOrdersService.list(2)
  assert.equal(result.pagination.pages, 2)
  assert.equal(result.orders.length, 1)
  assert.equal(result.orders[0].number, 'SKJ-1')
  assert.equal(result.orders[0].status, 'successful')
  assert.equal(result.orders[0].total, 45000)
  assert.deepEqual(result.orders[0].items[0], {
    id: 'order-1-0', name: 'Brocade', variantId: 'red-id', colorName: 'Red',
    quantity: 2, price: 22500, image: 'red.jpg',
  })
  setAccessToken(null)
})
