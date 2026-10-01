import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { api, applyApiFieldErrors, getRateLimitSeconds, setAccessToken, setAuthenticationFailureHandler } from './api.js'
import { authService } from './auth.service.js'

const response = (config, data, status = 200) => ({ config, data, status, statusText: 'OK', headers: {} })
const rejection = (config, status, data = {}) => Promise.reject({ config, response: { status, data, headers: {} } })
const source = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8')

test.beforeEach(() => setAccessToken(null))

test('anonymous product failures do not refresh or trigger session failure', async () => {
  const requests = []
  let failures = 0
  const cleanup = setAuthenticationFailureHandler(() => { failures += 1 })
  try {
    api.defaults.adapter = (config) => {
      requests.push(config.url)
      return rejection(config, 401)
    }
    await assert.rejects(api.get('/products'))
    assert.deepEqual(requests, ['/products'])
    assert.equal(failures, 0)
  } finally {
    cleanup()
  }
})

test('expired authenticated sessions still notify the provider when refresh fails', async () => {
  setAccessToken('expired-token')
  let failures = 0
  const requests = []
  const cleanup = setAuthenticationFailureHandler(() => { failures += 1 })
  try {
    api.defaults.adapter = (config) => {
      requests.push(config.url)
      return rejection(config, 401)
    }
    await assert.rejects(api.get('/orders'))
    assert.deepEqual(requests, ['/orders', '/auth/refresh'])
    assert.equal(failures, 1)
  } finally {
    cleanup()
  }
})

test('registration posts its contract and navigates to email verification with the email', async () => {
  let request
  api.defaults.adapter = async (config) => {
    request = config
    return response(config, { success: true, message: 'Verification code sent to your email' }, 202)
  }
  const details = { phoneNumber: '+233541234567', email: 'user@example.com', firstName: 'Ada', lastName: 'Lovelace', password: 'password123', confirmPassword: 'password123' }
  await authService.register(details)
  assert.equal(request.url, '/auth/register')
  assert.deepEqual(JSON.parse(request.data), details)
  assert.match(await source('../pages/Auth/Register/Register.jsx'), /navigate\('\/verify-email'.*email: values\.email/s)
})

test('login sends only credentials and auth endpoints are never refreshed on 401', async () => {
  let calls = 0
  api.defaults.adapter = (config) => {
    calls += 1
    assert.equal(config.url, '/auth/login')
    assert.deepEqual(JSON.parse(config.data), { email: 'user@example.com', password: 'password123' })
    return rejection(config, 401, { message: 'Invalid credentials' })
  }
  await assert.rejects(authService.login({ email: 'user@example.com', password: 'password123' }))
  assert.equal(calls, 1)
})

test('simultaneous protected 401s share one refresh and each retry only once', async () => {
  setAccessToken('expired-token')
  let refreshes = 0
  let protectedCalls = 0
  api.defaults.adapter = async (config) => {
    if (config.url === '/auth/refresh') {
      refreshes += 1
      await Promise.resolve()
      return response(config, { data: { accessToken: 'new-token' } })
    }
    protectedCalls += 1
    if (config.headers.Authorization !== 'Bearer new-token') return rejection(config, 401)
    return response(config, { ok: true })
  }
  const results = await Promise.all([api.get('/orders'), api.get('/wishlist')])
  assert.ok(results.every((item) => item.data.ok))
  assert.equal(refreshes, 1)
  assert.equal(protectedCalls, 4)
})

test('protected routes retain an authentication-loading gate', async () => {
  const route = await source('../routes/PrivateRoute.jsx')
  assert.match(route, /if \(isAuthLoading\)/)
  assert.match(route, /<Navigate to="\/login"/)
  const provider = await source('../context/AuthContext.jsx')
  assert.match(provider, /authService\.refresh\(\{ notifyOnFailure: false \}\)/)
  assert.match(provider, /authService\.me\(\)/)
})

test('forgot and reset password preserve email and use the complete reset body', async () => {
  const requests = []
  api.defaults.adapter = async (config) => {
    requests.push(config)
    return response(config, { success: true, message: 'Request accepted' })
  }
  await authService.forgotPassword({ email: 'user@example.com' })
  await authService.resetPassword({ email: 'user@example.com', code: '123456', password: 'new-password', confirmPassword: 'new-password' })
  assert.deepEqual(requests.map((item) => item.url), ['/auth/forgot-password', '/auth/reset-password'])
  assert.deepEqual(JSON.parse(requests[1].data), { email: 'user@example.com', code: '123456', password: 'new-password', confirmPassword: 'new-password' })
  assert.match(await source('../pages/Auth/ForgotPassword/ForgotPasswordPage.jsx'), /navigate\('\/reset-password'.*email/s)
})

test('logout uses its endpoint and frontend state is cleared in a finally block', async () => {
  api.defaults.adapter = async (config) => response(config, { success: true })
  await authService.logout()
  const provider = await source('../context/AuthContext.jsx')
  assert.match(provider, /try \{ await authService\.logout\(\) \} finally \{ clearSession\(\) \}/)
})

test('429 responses use Retry-After or a temporary fallback cooldown', () => {
  assert.equal(getRateLimitSeconds({ response: { status: 429, headers: { 'retry-after': '12' } } }), 12)
  assert.equal(getRateLimitSeconds({ response: { status: 429, headers: {} } }), 30)
  assert.equal(getRateLimitSeconds({ response: { status: 400, headers: {} } }), 0)
})

test('applyApiFieldErrors maps backend field names to react-hook-form fields', () => {
  const seen = {}

  applyApiFieldErrors({
    response: {
      data: {
        errors: [
          { field: 'price', message: 'Price must be between 0 and 99999999.99' },
          { field: 'compare_at_price', message: 'Compare-at price must be greater than or equal to the selling price' },
          { field: 'stock', message: 'Stock must be between 0 and 999999' },
        ],
      },
    },
  }, (field, data) => {
    seen[field] = data
  })

  assert.deepEqual(seen, {
    price: { type: 'server', message: 'Price must be between 0 and 99999999.99' },
    compareAtPrice: { type: 'server', message: 'Compare-at price must be greater than or equal to the selling price' },
    stock: { type: 'server', message: 'Stock must be between 0 and 999999' },
  })
})
