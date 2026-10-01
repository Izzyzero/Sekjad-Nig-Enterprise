// A non-secret hint to attempt cookie-based restoration, never proof of authentication.
const key = 'sekjad-session-present'
export function hasSessionHint() {
  try { return localStorage.getItem(key) === '1' } catch { return false }
}
export function setSessionHint(present) {
  try {
    if (present) localStorage.setItem(key, '1')
    else localStorage.removeItem(key)
  } catch { /* Sessions still work in memory when storage is unavailable. */ }
}
