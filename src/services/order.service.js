import { api } from './api'
export const orderService = { list: () => api('/orders'), create: (order) => api('/orders', { method: 'POST', body: JSON.stringify(order) }) }
