import { api } from './api.js'

export const checkoutFingerprint = (items) => JSON.stringify(items.map(({ id, quantity, price }) => ({ id, quantity, price })).sort((a, b) => String(a.id).localeCompare(String(b.id))))

export function loadCheckoutAttempt(storage, storageKey, fingerprint, uuid = () => crypto.randomUUID()) {
  try {
    const saved = JSON.parse(storage.getItem(storageKey))
    if (saved?.fingerprint === fingerprint && saved?.key) return saved
  } catch { /* A missing or unavailable cache starts a fresh attempt. */ }
  return { fingerprint, key: uuid(), order: null }
}

export function saveCheckoutAttempt(storage, storageKey, attempt) {
  try { storage.setItem(storageKey, JSON.stringify(attempt)) } catch { /* In-memory retries still retain the key. */ }
}

export async function prepareWhatsAppOrder(key) {
  const response = await api.post('/orders/whatsapp', {}, { headers: { 'Idempotency-Key': key } })
  const order = response.data.data
  const url = new URL(order.whatsappUrl)
  if (url.protocol !== 'https:' || url.hostname !== 'wa.me' || url.username || url.password || typeof order.message !== 'string') {
    throw new Error('Could not open the order link. Please retry this order.')
  }
  return order
}

export function openWhatsAppOrder(url, windowObject = window) {
  const target = typeof url === 'string' ? url : ''
  if (!target) return false
  if (typeof windowObject.location?.assign === 'function') {
    windowObject.location.assign(target)
    return true
  }
  return false
}

export async function completeWhatsAppOrder({ order }) {
  return order
}
