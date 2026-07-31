import { api } from './api'
export const cartService = { get: () => api('/cart'), add: (item) => api('/cart', { method: 'POST', body: JSON.stringify(item) }) }
