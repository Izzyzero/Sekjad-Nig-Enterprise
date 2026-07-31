import { api } from './api'
export const wishlistService = { get: () => api('/wishlist') }
