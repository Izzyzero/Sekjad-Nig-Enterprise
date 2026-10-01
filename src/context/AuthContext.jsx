import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/auth.service'
import { setAccessToken, setAuthenticationFailureHandler } from '../services/api'
import { hasSessionHint, setSessionHint } from '../utils/sessionHint'

// Kept with the provider to preserve the project's existing context/hook pattern.
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

const payloadOf = (response) => response?.data ?? response ?? {}
const tokenOf = (response) => payloadOf(response)?.accessToken ?? null
const userOf = (response) => payloadOf(response)?.user ?? null

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setToken] = useState(null)
  const [shouldRestoreSession] = useState(hasSessionHint)
  const [isAuthLoading, setIsAuthLoading] = useState(shouldRestoreSession)

  const clearSession = useCallback(() => {
    setSessionHint(false)
    setAccessToken(null)
    setToken(null)
    setUser(null)
  }, [])

  const applyToken = useCallback((response) => {
    const token = tokenOf(response)
    setSessionHint(Boolean(token))
    setAccessToken(token)
    setToken(token)
    return token
  }, [])

  // Route guards handle redirects; public pages remain accessible on session expiry.
  useEffect(() => setAuthenticationFailureHandler(clearSession), [clearSession])

  useEffect(() => {
    if (!shouldRestoreSession) return
    let active = true
    authService.refresh({ notifyOnFailure: false })
      .then(async (response) => {
        if (!active) return
        applyToken(response)
        const me = await authService.me()
        if (active) setUser(userOf(me) ?? payloadOf(me))
      })
      .catch(() => {
        if (active) clearSession()
      })
      .finally(() => {
        if (active) setIsAuthLoading(false)
      })
    return () => { active = false }
  }, [applyToken, clearSession, shouldRestoreSession])

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials)
    applyToken(response)
    const nextUser = userOf(response)
    setUser(nextUser)
    return nextUser
  }, [applyToken])

  const loginWithGoogle = useCallback(async (credential) => {
    const response = await authService.google(credential)
    if (!tokenOf(response) || !userOf(response)) throw new Error('Unable to complete Google sign-in. Please try again.')
    applyToken(response)
    const nextUser = userOf(response)
    setUser(nextUser)
    return nextUser
  }, [applyToken])

  const logout = useCallback(async () => {
    try { await authService.logout() } finally { clearSession() }
  }, [clearSession])

  const value = useMemo(() => ({
    user, updateUser: setUser, accessToken, isAuthenticated: Boolean(accessToken), isAuthLoading, login, loginWithGoogle, logout, clearSession,
  }), [user, accessToken, isAuthLoading, login, loginWithGoogle, logout, clearSession])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
