import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/auth.service'
import { setAccessToken } from '../services/api'


export const AuthContext = createContext(null)

const getPayload = (response) => response?.data ?? response ?? {}
const getToken = (payload) =>
  payload?.accessToken ??
  payload?.data?.accessToken ??
  payload?.access_token ??
  payload?.token ??
  null
const getUser = (payload) => payload?.user ?? payload?.data?.user ?? payload?.profile ?? null

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setToken] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const clearSession = useCallback(() => {
    setAccessToken(null)
    setToken(null)
    setUser(null)
    
  }, [])

  const applySession = useCallback((response) => {
    const payload = getPayload(response)
    const token = getToken(payload)
    const nextUser = getUser(payload)

    if (token) {
      setAccessToken(token)
      setToken(token)
    } else {
      setAccessToken(null)
      setToken(null)
    }

    if (nextUser) {
      setUser(nextUser)
    } else if (response === null) {
      setUser(null)
    }

    return response
  }, [])

  useEffect(() => {
    let active = true

    authService.refresh()
      .then(async (response) => {
        if (!active) return

        applySession(response)

        const userResponse = await authService.me()
        if (!active) return

        const payload = getPayload(userResponse)
        setUser(getUser(payload) ?? payload)
      })
      .catch((error) => {
        console.error('AuthProvider refresh error:', {
          status: error?.response?.status,
          data: error?.response?.data,
          message: error?.message,
        })
        if (active) clearSession()
      })
      .finally(() => {
        if (active) setIsAuthLoading(false)
      })

    return () => {
      active = false
    }
  }, [applySession, clearSession])

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials)
    applySession(response)

    let loggedInUser = getUser(getPayload(response))

    // Some login endpoints return only tokens. Fetch the profile so callers
    // can safely decide where to send the user based on their server-side role.
    if (!loggedInUser) {
      const userResponse = await authService.me()
      const payload = getPayload(userResponse)
      loggedInUser = getUser(payload) ?? payload
      setUser(loggedInUser)
    }

    return loggedInUser
  }, [applySession])

  const register = useCallback(async (details) => {
    const response = await authService.register(details)
    return applySession(response)
  }, [applySession])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      clearSession()
    }
  }, [clearSession])

  const value = useMemo(
    () => ({ user, accessToken, isAuthenticated: Boolean(accessToken), isAuthLoading, login, register, logout }),
    [user, accessToken, isAuthLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
