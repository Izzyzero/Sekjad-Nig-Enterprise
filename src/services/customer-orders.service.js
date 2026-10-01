import { api } from './api.js'

const imageOf = (value) => typeof value === 'string' ? value : value?.url ?? ''

export const normalizeCustomerOrders = (response) => {
  const body = response?.data ?? response
  const records = Array.isArray(body?.data) ? body.data : []
  return {
    orders: records.map(normalizeCustomerOrder),
    pagination: body?.pagination ?? { page: 1, limit: 10, total: records.length, pages: 1 },
  }
}

export const normalizeCustomerOrder = (order) => ({
  id: order._id,
  number: order.reference ?? order._id,
  date: order.createdAt,
  paidAt: order.paidAt,
  status: String(order.status ?? 'pending').toLowerCase(),
  paymentStatus: order.paymentStatus,
  total: Number(order.amount ?? 0) / 100,
  currency: order.currency ?? 'NGN',
  items: (order.items ?? []).map((item, index) => ({
    id: item._id ?? `${order._id}-${index}`,
    name: item.title ?? 'Product',
    quantity: Number(item.quantity ?? 1),
    price: Number(item.unitAmount ?? 0) / 100,
    image: imageOf(item.imageUrl),
  })),
})

export const customerOrdersService = {
  list: (page = 1) => api.get('/orders', { params: { page, limit: 10 } }).then(normalizeCustomerOrders),
  get: (id) => api.get(`/orders/${encodeURIComponent(id)}`).then((response) => normalizeCustomerOrder(response.data?.data ?? response.data)),
}
