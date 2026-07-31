import { api } from './api'
export const paymentService = { initialize: (details) => api('/payments', { method: 'POST', body: JSON.stringify(details) }) }
