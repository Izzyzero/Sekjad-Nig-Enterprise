import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { MessageCircle } from 'lucide-react'
import { useRateLimit } from '../hooks/useRateLimit'
import { getApiError, getRateLimitSeconds } from '../services/api'
import { cartService } from '../services/cart.service'
import { loadCheckoutAttempt, saveCheckoutAttempt, prepareWhatsAppOrder, openWhatsAppOrder } from '../services/whatsapp-order.service'
import { formatCurrency } from '../utils/formatCurrency'
import { useRequireAuth } from '../hooks/useRequireAuth'

export function WhatsAppCheckout({ fingerprint, userId, disabled, onPreparing }) {
  const requireAuth = useRequireAuth()
  const storageKey = `whatsapp-checkout:${userId}`
  const [attempt, setAttempt] = useState(() => loadCheckoutAttempt(window.sessionStorage, storageKey, fingerprint))
  const [preparing, setPreparing] = useState(false)
  const [error, setError] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const inFlight = useRef(false)
  const queryClient = useQueryClient()
  const { rateLimitSeconds, startRateLimit } = useRateLimit()
  const order = attempt.order
  const paymentStatus = order?.paymentStatus ?? order?.status ?? 'pending'

  useEffect(() => {
    saveCheckoutAttempt(window.sessionStorage, storageKey, attempt)
  }, [storageKey, attempt])

  const prepare = async () => {
    if (!requireAuth('/checkout')) return
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
      <p className="text-sm">Items total: {formatCurrency(order.amount / 100, order.currency)} (excluding delivery). Payment status: <strong>{String(paymentStatus).replaceAll('_', ' ')}</strong>.</p>
      {order.items?.length > 0 && (
        <ul className="space-y-2 rounded-xl border border-[#E9E4DF] p-3">
          {order.items.map((item, index) => (
            <li key={item.variantId ? `${item.id ?? item.productId ?? index}-${item.variantId}` : item.id ?? index} className="flex items-center gap-3 text-sm">
              {(item.variantImageUrl || item.imageUrl) && <img src={item.variantImageUrl || item.imageUrl} alt="" className="size-12 shrink-0 rounded-lg object-cover" />}
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{item.title ?? item.name ?? 'Product'}</span>
                {item.colorName && <span className="block text-xs text-[#6B7280]">Color: {item.colorName}</span>}
              </span>
              <span className="shrink-0 text-right text-xs text-[#6B7280]">
                <span className="block">Qty: {item.quantity}</span>
                <span className="block font-medium text-[#111827]">
                  {formatCurrency((Number(item.unitAmount ?? 0) / 100) * Number(item.quantity ?? 1), order.currency)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
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
