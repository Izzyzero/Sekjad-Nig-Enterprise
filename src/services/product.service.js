import { api } from './api'
export const productService = { list: () => api('/products'), get: (id) => api(`/products/${id}`) }
