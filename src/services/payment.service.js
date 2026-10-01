import { api } from './api.js'

const dataOf = (response) => response.data?.data ?? response.data

export const paymentService = {
  initialize: () => api.post('/payments/initialize').then(dataOf),
  verify: (reference) => api.get(`/payments/verify/${encodeURIComponent(reference)}`).then(dataOf),
}
