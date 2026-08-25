import { api } from './api'

const unwrapCart = (response) => {
  const body = response?.data ?? response ?? {}
  return body?.data ?? body?.cart ?? body
}

const imageUrl = (image) => (typeof image === 'string' ? image : image?.url ?? '')

export const normalizeCart = (response) => {
  const cart = unwrapCart(response)
  const items = Array.isArray(cart?.items)
    ? cart.items
        .filter((item) => item?.product)
        .map((item) => {
          const product = item.product
          return {
            ...product,
            id: product.id ?? product._id,
            cartItemId: item.id ?? item._id,
            name: product.name ?? product.title ?? '',
            image: imageUrl(product.image),
            categoryLabel:
              product.categoryLabel ??
              product.categories?.[0]?.label ??
              product.categories?.[0]?.name ??
              '',
            quantity: Number(item.quantity ?? 1),
          }
        })
    : []

  return {
    ...cart,
    items,
    itemCount: cart?.itemCount ?? items.reduce((total, item) => total + item.quantity, 0),
    subtotal:
      cart?.subtotal ??
      items.reduce((total, item) => total + Number(item.price ?? 0) * item.quantity, 0),
    currency: cart?.currency ?? items[0]?.currency ?? 'NGN',
  }
}

export const cartService = {
  get: () => api.get('/cart').then(normalizeCart),
  addItem: (productId, quantity = 1) =>
    api.post('/cart/items', { productId, quantity }).then(normalizeCart),
  updateItemQuantity: (productId, quantity) =>
    api.patch(`/cart/items/${productId}`, { quantity }).then(normalizeCart),
  removeItem: (productId) => api.delete(`/cart/items/${productId}`).then(normalizeCart),
  clear: () => api.delete('/cart').then(normalizeCart),
}
