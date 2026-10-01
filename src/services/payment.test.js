import assert from 'node:assert/strict'
import test from 'node:test'
import { api, setAccessToken } from './api.js'
import { paymentService } from './payment.service.js'

test('initialize sends an authenticated POST without a price body', async () => {
  setAccessToken('checkout-token')
  api.defaults.adapter = async (config) => {
    assert.equal(config.url, '/payments/initialize')
    assert.equal(config.method, 'post')
    assert.equal(config.headers.Authorization, 'Bearer checkout-token')
    assert.equal(config.data, undefined)
    return { config, status: 200, headers: {}, data: { success: true, data: { reference: 'ref-1', authorizationUrl: 'https://paystack.com/pay/test' } } }
  }
  assert.equal((await paymentService.initialize()).reference, 'ref-1')
  setAccessToken(null)
})

test('verify encodes the reference and reads backend payment status', async () => {
  api.defaults.adapter = async (config) => {
    assert.equal(config.url, '/payments/verify/ref%2F1')
    return { config, status: 200, headers: {}, data: { success: true, data: { paymentStatus: 'pending' } } }
  }
  assert.equal((await paymentService.verify('ref/1')).paymentStatus, 'pending')
})
