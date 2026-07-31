import { api } from './api'
export const reviewService = { list: (productId) => api(`/products/${productId}/reviews`) }
