import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
})

/**
 * GET /api/admin/orders
 * Expected shape: { items: Order[], total, page, totalPages }
 * Order: { id, orderNumber, customerName, customerEmail, items: [...],
 *          total, status, paymentStatus, createdAt }
 */
export async function getOrders(params = {}) {
  const { page = 1, limit = 12, search, status, sort } = params
  const { data } = await api.get('/admin/orders', {
    params: {
      page,
      limit,
      search: search || undefined,
      status: status && status !== 'all' ? status : undefined,
      sort: sort || undefined,
    },
  })
  return data
}

export async function getOrder(id) {
  const { data } = await api.get(`/admin/orders/${id}`)
  return data
}

export async function updateOrderStatus(id, status) {
  const { data } = await api.patch(`/admin/orders/${id}/status`, { status })
  return data
}

export default { getOrders, getOrder, updateOrderStatus }