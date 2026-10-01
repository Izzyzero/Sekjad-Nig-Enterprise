import { useRef, useState } from 'react'
import { paymentService } from '../services/payment.service'
import { getApiError } from '../services/api'
import { useRequireAuth } from './useRequireAuth'

export function usePaystackRedirect() {
  const requireAuth = useRequireAuth()
  const inFlight = useRef(false)
  const [initializing, setInitializing] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  const startPayment = async () => {
    if (!requireAuth('/checkout')) return
    if (inFlight.current) return
    inFlight.current = true
    setInitializing(true)
    setPaymentError('')
    try {
      const payment = await paymentService.initialize()
      if (!payment?.reference || !payment?.authorizationUrl) throw new Error('Payment could not be started. Please try again.')
      const destination = new URL(payment.authorizationUrl)
      if (!['https:', 'http:'].includes(destination.protocol)) throw new Error('Invalid payment destination.')
      sessionStorage.setItem('checkoutPaymentReference', payment.reference)
      window.location.assign(payment.authorizationUrl)
    } catch (error) {
      setPaymentError(getApiError(error, 'Could not start payment. Please try again.'))
      inFlight.current = false
      setInitializing(false)
    }
  }

  return { startPayment, initializing, paymentError }
}
