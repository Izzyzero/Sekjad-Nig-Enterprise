import { api } from './api.js'

const unwrapCart = (response) => {
  const body = response?.data ?? response ?? {}
  return body?.data ?? body?.cart ?? body
}

const imageUrl = (image) => (typeof image === 'string' ? image : image?.url ?? '')

export const normalizeCart = (response) => {
  const cart = unwrapCart(response)
  const items = Array.isArray(cart?.items)
    ? cart.items
        .filter(Boolean)
        .map((item) => {
          const product = item.product && typeof item.product === 'object' ? item.product : {}
          const selectedImage = imageUrl(item.selectedImage)
          return {
            ...product,
            id: item.productId ?? product.id ?? product._id,
            productId: item.productId ?? product.id ?? product._id,
            cartItemId: item.cartItemId,
            variantId: item.variantId ?? null,
            colorName: item.colorName ?? null,
            selectedImage: selectedImage || null,
            name: item.name ?? item.title ?? product.name ?? product.title ?? '',
            image: selectedImage || imageUrl(product.image),
            categoryLabel:
              product.categoryLabel ??
              product.categories?.[0]?.label ??
              product.categories?.[0]?.name ??
              '',
            quantity: Number(item.quantity ?? 1),
            price: Number(item.price ?? 0),
          }
        })
    : []

  return {
    ...cart,
    items,
    itemCount: cart?.itemCount ?? items.reduce((total, item) => total + item.quantity, 0),
    subtotal: Number(cart?.subtotal ?? 0),
    currency: cart?.currency ?? items[0]?.currency ?? 'NGN',
  }
}

export const cartService = {
  get: () => api.get('/cart').then(normalizeCart),
  addItem: ({ productId, variantId, quantity = 1 }) =>
    api.post('/cart/items', {
      productId,
      ...(variantId ? { variantId } : {}),
      quantity,
    }).then(normalizeCart),
  updateItemQuantity: (cartItemId, quantity) =>
    api.patch(`/cart/items/${encodeURIComponent(cartItemId)}`, { quantity }).then(normalizeCart),
  removeItem: (cartItemId) =>
    api.delete(`/cart/items/${encodeURIComponent(cartItemId)}`).then(normalizeCart),
  clear: () => api.delete('/cart').then(normalizeCart),
}
