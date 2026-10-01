import { api } from './api'

export async function sendContactMessage(details) {
  const { data } = await api.post('/contact', details, { skipAuthRefresh: true, timeout: 15000 })
  if (data?.success !== true) throw new Error('Unable to send your message. Please try again.')
  return data
}
