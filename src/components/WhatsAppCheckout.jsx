import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { MessageCircle } from 'lucide-react'
import { useRateLimit } from '../hooks/useRateLimit'
import { getApiError, getRateLimitSeconds } from '../services/api'
import { cartService } from '../services/cart.service'
import { loadCheckoutAttempt, saveCheckoutAttempt, prepareWhatsAppOrder, openWhatsAppOrder } from '../services/whatsapp-order.service'
import { formatCurrency } from '../utils/formatCurrency'

export function WhatsAppCheckout({ fingerprint, userId, disabled, onPreparing }) {
  const storageKey = `whatsapp-checkout:${userId}`
  const [attempt, setAttempt] = useState(() => loadCheckoutAttempt(window.sessionStorage, storageKey, fingerprint))
  const [preparing, setPreparing] = useState(false)
  const [error, setError] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const inFlight = useRef(false)
  const queryClient = useQueryClient()
  const { rateLimitSeconds, startRateLimit } = useRateLimit()
  const order = attempt.order

  useEffect(() => {
    saveCheckoutAttempt(window.sessionStorage, storageKey, attempt)
  }, [storageKey, attempt])

  const prepare = async () => {
    if (disabled || inFlight.current || rateLimitSeconds) return
    inFlight.current = true
    setPreparing(true)
    onPreparing(true)
    setError('')
    saveCheckoutAttempt(window.sessionStorage, storageKey, attempt)
    try {
      await cartService.get()
      const result = await prepareWhatsAppOrder(attempt.key)
      const next = { ...attempt, order: result }
      saveCheckoutAttempt(window.sessionStorage, storageKey, next)
      setAttempt(next)
      queryClient.invalidateQueries({ queryKey: ['customer-orders'] })
      openWhatsAppOrder(result.whatsappUrl)
    } catch (failure) {
      const fields = failure.response?.data?.errors?.map((item) => item.message).filter(Boolean).join(' ')
      setError(fields || getApiError(failure, 'Could not prepare your order. Please try again.'))
      startRateLimit(getRateLimitSeconds(failure, 900))
    } finally {
      inFlight.current = false
      setPreparing(false)
      onPreparing(false)
    }
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(order.message)
      setCopyStatus('Order copied.')
    } catch {
      setCopyStatus('Select and copy the order message below.')
    }
  }
  return <div className="mt-6 min-w-0 space-y-3 [overflow-wrap:anywhere]">
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    {!order ? <button type="button" onClick={prepare} disabled={disabled || preparing || rateLimitSeconds > 0} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#E67E22] py-3.5 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed">
      {preparing ? 'Preparing your order...' : rateLimitSeconds ? `Try again in ${rateLimitSeconds}s` : 'Order via WhatsApp'} <MessageCircle size={15} />
    </button> : <>
      <p role="status" className="text-sm text-[#111827]">Send your order in WhatsApp to arrange payment.</p>
      <p className="min-w-0 [overflow-wrap:anywhere] text-sm">Reference: <strong>{order.reference}</strong></p>
      <p className="text-sm">Items total: {formatCurrency(order.amount / 100, order.currency)} (excluding delivery). Payment pending.</p>
      <a href={order.whatsappUrl} className="block rounded-full bg-[#E67E22] py-3 text-center text-sm font-semibold text-white">Open WhatsApp</a>
      <button type="button" onClick={copy} className="text-sm font-semibold text-[#E67E22]">Copy order</button>
      {copyStatus && <p role="status" className="text-sm">{copyStatus}</p>}
      <details className="text-sm"><summary className="cursor-pointer">View order message</summary><textarea aria-label="Order message" readOnly value={order.message} rows={8} className="mt-2 block w-full min-w-0 max-w-full resize-y rounded-lg border p-2" onFocus={(event) => event.target.select()} /></details>
      <button type="button" disabled={disabled || preparing} className="text-sm underline disabled:opacity-60" onClick={() => {
        const next = { fingerprint, key: crypto.randomUUID(), order: null }
        saveCheckoutAttempt(window.sessionStorage, storageKey, next)
        setAttempt(next)
        setCopyStatus('')
        setError('')
      }}>Start a new order</button>
    </>}
  </div>
}
