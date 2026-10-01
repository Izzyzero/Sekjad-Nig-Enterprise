import assert from 'node:assert/strict'
import test from 'node:test'
import { api, setAccessToken } from './api.js'
import { authService } from './auth.service.js'

test('profile endpoints send bearer credentials and preserve pending email and password payloads', async () => {
  const original = api.defaults.adapter
  const requests = []
  setAccessToken('profile-token')
  api.defaults.adapter = async (config) => {
    requests.push(config)
    return { config, status: 202, statusText: 'Accepted', headers: {}, data: { success: true, data: { user: { email: 'old@example.com', phoneNumber: '+233541234567' }, emailVerificationRequired: true, pendingEmail: 'new@example.com' } } }
  }
  try {
    await authService.me()
    const details = { firstName: 'Ada', lastName: 'Lovelace', phone: '+233541234567', email: 'new@example.com', currentPassword: ' password ' }
    const result = await authService.updateProfile(details)
    assert.equal(result.data.user.email, 'old@example.com')
    assert.equal(result.data.pendingEmail, 'new@example.com')
    await authService.verifyProfileEmail({ email: result.data.pendingEmail, code: '012345' })
    const passwords = { currentPassword: ' old password ', newPassword: ' new password ', confirmPassword: ' new password ' }
    await authService.changePassword(passwords)
    assert.deepEqual(requests.map((r) => [r.method, r.url]), [['get', '/auth/me'], ['patch', '/auth/me'], ['post', '/auth/me/verify-email'], ['post', '/auth/change-password']])
    assert.deepEqual(JSON.parse(requests[1].data), details)
    assert.deepEqual(JSON.parse(requests[2].data), { email: 'new@example.com', code: '012345' })
    assert.deepEqual(JSON.parse(requests[3].data), passwords)
    for (const request of requests) {
      assert.equal(request.headers.Authorization, 'Bearer profile-token')
      assert.equal(request.withCredentials, true)
      assert.equal(request.skipAuthRefresh, true)
    }
  } finally { api.defaults.adapter = original; setAccessToken(null) }
})

test('profile failures retain validation and rate-limit details without refreshing tokens', async () => {
  const original = api.defaults.adapter
  try {
    for (const status of [400, 401, 409, 429, 503]) {
      let calls = 0
      api.defaults.adapter = async (config) => {
        calls++
        throw { config, response: { status, headers: { 'retry-after': '900' }, data: { message: 'Request failed', errors: [{ field: 'currentPassword', message: 'Incorrect password' }] } } }
      }
      for (const request of [() => authService.updateProfile({ email: 'new@example.com' }), () => authService.verifyProfileEmail({ email: 'new@example.com', code: '000000' }), () => authService.changePassword({})]) {
        await assert.rejects(request(), (error) => error.response.status === status && error.response.data.errors[0].field === 'currentPassword' && error.response.headers['retry-after'] === '900')
      }
      assert.equal(calls, 3)
    }
  } finally { api.defaults.adapter = original }
})
