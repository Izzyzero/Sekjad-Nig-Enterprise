import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getApiError, getRateLimitSeconds } from '../../services/api'
import { useRateLimit } from '../../hooks/useRateLimit'

let sdkPromise
let credentialCallback

function loadGoogle(clientId) {
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      const timeout = window.setTimeout(() => fail(), 15000)
      const fail = () => {
        window.clearTimeout(timeout)
        script.remove()
        sdkPromise = undefined
        reject(new Error('Google sign-in could not load. Please reload and try again.'))
      }
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onerror = fail
      script.onload = () => {
        window.clearTimeout(timeout)
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            ux_mode: 'popup',
            callback: (response) => credentialCallback?.(response),
          })
          resolve(window.google.accounts.id)
        } catch { fail() }
      }
      document.head.appendChild(script)
    })
  }
  return sdkPromise
}

export function GoogleSignIn({ disabled = false }) {
  const container = useRef(null)
  const inFlight = useRef(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const { loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { rateLimitSeconds, startRateLimit } = useRateLimit()
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim()

  useEffect(() => {
    if (!clientId) return
    let active = true
    const element = container.current
    const callback = async ({ credential }) => {
      if (!active || disabled || inFlight.current || rateLimitSeconds > 0) return
      setError('')
      if (!credential) {
        setError('Google did not return a sign-in credential. Please try again.')
        return
      }
      inFlight.current = true
      setPending(true)
      try {
        await loginWithGoogle(credential)
        if (active) navigate(location.state?.from ? { pathname: location.state.from.pathname, search: location.state.from.search, hash: location.state.from.hash } : '/home', { replace: true })
      } catch (failure) {
        if (active) {
          setError(getApiError(failure, 'Unable to sign in with Google. Please try again.'))
          startRateLimit(getRateLimitSeconds(failure))
        }
      } finally {
        inFlight.current = false
        if (active) setPending(false)
      }
    }
    credentialCallback = callback
    loadGoogle(clientId).then((google) => {
      if (!active) return
      google.renderButton(element, {
        type: 'standard', text: 'continue_with', theme: 'outline', size: 'large',
      })
    }).catch((failure) => { if (active) setError(failure.message) })
    return () => {
      active = false
      if (credentialCallback === callback) credentialCallback = undefined
      element?.replaceChildren()
    }
  }, [clientId, disabled, loginWithGoogle, navigate, location.state, rateLimitSeconds, startRateLimit])

  return (
    <div className="mt-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-stone-200" />
        <span className="text-xs text-ink/40">or continue with</span>
        <div className="h-px flex-1 bg-stone-200" />
      </div>
      <div inert={disabled || pending || rateLimitSeconds > 0} aria-busy={pending} className="flex justify-center">
        <div ref={container} />
      </div>
      {!clientId && <p role="status" className="text-center text-sm text-ink/50">Google sign-in is currently unavailable.</p>}
      {pending && <p role="status" className="mt-3 text-center text-sm">Signing in with Google...</p>}
      {rateLimitSeconds > 0 && <p role="status" className="mt-3 text-center text-sm">Try again in {rateLimitSeconds}s</p>}
      {error && <p role="alert" className="mt-3 text-center text-sm text-red-600">{error}</p>}
    </div>
  )
}
