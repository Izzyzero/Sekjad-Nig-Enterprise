import { useRef, useState } from 'react'
import { sendContactMessage } from '../services/contact.service'

export function useContactForm() {
  const busy = useRef(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const send = async (details) => {
    if (busy.current) return
    busy.current = true
    setSending(true)
    setSent(false)
    setError('')
    try {
      await sendContactMessage(details)
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send your message. Please try again.')
    } finally {
      busy.current = false
      setSending(false)
    }
  }

  return { send, sending, sent, error }
}
