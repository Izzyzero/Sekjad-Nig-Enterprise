import assert from 'node:assert/strict'
import test from 'node:test'
import { api } from './api.js'
import { authService } from './auth.service.js'

test('Google login accepts new and returning accounts and sends the ID token with cookies', async () => {
  const original = api.defaults.adapter
  try {
    for (const status of [200, 201]) {
      const body = { success: true, data: { user: { _id: 'google-user', email: 'user@gmail.com', role: 'user' }, accessToken: 'access-token', isNewUser: status === 201 } }
      api.defaults.adapter = async (config) => {
        assert.equal(config.url, '/auth/google')
        assert.equal(config.method, 'post')
        assert.deepEqual(JSON.parse(config.data), { credential: 'google-id-token' })
        assert.equal(config.withCredentials, true)
        assert.equal(config.skipAuthRefresh, true)
        return { config, status, headers: {}, data: body }
      }
      assert.deepEqual(await authService.google('google-id-token'), body)
    }
  } finally { api.defaults.adapter = original }
})

test('Google errors preserve backend messages without attempting refresh', async () => {
  const original = api.defaults.adapter
  try {
    for (const status of [400, 401, 409, 429, 503]) {
      let calls = 0
      api.defaults.adapter = async (config) => {
        calls++
        throw { config, response: { status, data: { message: 'Use your existing login method' } } }
      }
      await assert.rejects(authService.google('invalid-token'), (error) =>
        error.response.status === status && error.response.data.message === 'Use your existing login method')
      assert.equal(calls, 1)
    }
  } finally { api.defaults.adapter = original }
})
