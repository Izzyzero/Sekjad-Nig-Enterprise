import axios from 'axios'

const API_URL = import.meta.env?.VITE_API_URL

export const api = axios.create({ baseURL: API_URL, withCredentials: true })

let accessToken = null
let refreshPromise = null
let authenticationFailureHandler = null

const tokenFrom = (response) => response?.data?.data?.accessToken ?? response?.data?.accessToken ?? null
const isAuthRequest = (url = '') => /(^|\/)auth\//.test(url)
export const isSessionRejected = (error) => [401, 403].includes(error.response?.status)

export const setAccessToken = (token) => {
  accessToken = token || null
}

export const setAuthenticationFailureHandler = (handler) => {
  authenticationFailureHandler = handler
  return () => {
    if (authenticationFailureHandler === handler) authenticationFailureHandler = null
  }
}

export const refreshAccessToken = ({ notifyOnFailure = true } = {}) => {
  if (!refreshPromise) {
    refreshPromise = api
      .post('/auth/refresh', undefined, { skipAuthRefresh: true })
      .then((response) => {
        const token = tokenFrom(response)
        if (!token) throw new Error('Refresh response did not include an access token')
        setAccessToken(token)
        return response.data
      })
      .catch((error) => {
        if (isSessionRejected(error)) {
          setAccessToken(null)
          if (notifyOnFailure) authenticationFailureHandler?.()
        }
        throw error
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

api.interceptors.request.use((config) => {
  if (accessToken && !config.headers.Authorization) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config
    const canRefresh = error.response?.status === 401 && request && request.headers?.Authorization && !request._authRetry &&
      !request.skipAuthRefresh && !isAuthRequest(request.url)
    if (!canRefresh) throw error

    request._authRetry = true
    await refreshAccessToken()
    request.headers.Authorization = `Bearer ${accessToken}`
    return api(request)
  },
)

export const getApiError = (error, fallback = 'Something went wrong. Please try again.') =>
  error.response?.data?.message || error.response?.data?.error || error.message || fallback

const normalizeFieldName = (field = '') => {
  const source = String(field).trim()
  if (!source) return source

  const underscored = source.replace(/([a-z0-9])([A-Z])/g, '$1_$2')
  return underscored.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

export const applyApiFieldErrors = (error, setError) => {
  const errors = error.response?.data?.errors
  if (!Array.isArray(errors)) return
  errors.forEach((item) => {
    if (item?.field && item?.message) {
      const normalizedField = normalizeFieldName(item.field)
      setError(normalizedField, { type: 'server', message: item.message })
    }
  })
}

export const getRateLimitSeconds = (error, fallback = 30) => {
  if (error.response?.status !== 429) return 0
  const header = Number.parseInt(error.response.headers?.['retry-after'], 10)
  return Number.isFinite(header) && header > 0 ? header : fallback
}
