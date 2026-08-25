import { api } from './api'

const unwrapWishlist = (response) => {
  const body = response?.data ?? response ?? {}
  return body?.data ?? body?.wishlist ?? body
}

const normalizeProduct = (product = {}) => ({
  ...product,
  id: product.id ?? product._id,
  name: product.name ?? product.title ?? '',
  image: typeof product.image === 'string' ? product.image : product.image?.url ?? '',
})

export const normalizeWishlist = (response) => {
  const wishlist = unwrapWishlist(response)
  const items = Array.isArray(wishlist?.products)
    ? wishlist.products.filter(Boolean).map(normalizeProduct)
    : []

  return {
    ...wishlist,
    items,
    productCount: wishlist?.productCount ?? items.length,
  }
}

export const wishlistService = {
  get: () => api.get('/wishlist').then(normalizeWishlist),
  addProduct: (productId) =>
    api.post('/wishlist/items', { productId }).then(normalizeWishlist),
  removeProduct: (productId) =>
    api.delete(`/wishlist/items/${productId}`).then(normalizeWishlist),
  clear: () => api.delete('/wishlist').then(normalizeWishlist),
}
