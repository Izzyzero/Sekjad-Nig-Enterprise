import { api } from './api.js'

const imageOf = (value) => typeof value === 'string' ? value : value?.url ?? ''

export const isWhatsAppOrder = (order) => {
  if (!order || typeof order !== 'object') return false

  const sourceCandidates = [
    order?.source,
    order?.orderSource,
    order?.channel,
    order?.checkoutMethod,
    order?.mode,
    order?.type,
    order?.salesChannel,
    order?.checkoutType,
    order?.paymentMethod,
    order?.orderType,
    order?.origin,
    order?.sourceType,
  ]
    .filter(Boolean)
    .map((value) => String(value).trim().toLowerCase())

  const normalized = sourceCandidates.concat(
    [
      String(order?.whatsappUrl ?? '').trim().toLowerCase(),
      String(order?.whatsappMessage ?? '').trim().toLowerCase(),
      String(order?.message ?? '').trim().toLowerCase(),
    ]
  )

  return normalized.some((value) => (
    value.includes('whatsapp') ||
    value.includes('wa') ||
    value.includes('whatsapp_order') ||
    value.includes('whatsappcheckout') ||
    value.includes('chat')
  ))
}

export const normalizeAdminOrder = (order) => ({
  ...order,
  id: order.id ?? order._id,
  orderNumber: order.orderNumber ?? order.reference ?? order._id,
  customerName: [order.user?.firstName, order.user?.lastName].filter(Boolean).join(' ') || order.customerName || '—',
  customerEmail: order.user?.email ?? order.customerEmail ?? '',
  customerPhone: order.user?.phone ?? order.customerPhone,
  paymentStatus: order.paymentStatus ?? order.status ?? 'pending',
  status: order.status ?? (order.paymentStatus === 'paid' ? 'successful' : order.paymentStatus ?? 'pending'),
  total: order.total ?? Number(order.amount ?? 0) / 100,
  items: (order.items ?? []).map((item, index) => ({
    ...item,
    id: item.id ?? item._id ?? `${order.id ?? order._id}-${index}`,
    name: item.name ?? item.title ?? item.product?.name ?? 'Product',
    variantId: item.variantId ?? null,
    colorName: item.colorName ?? null,
    quantity: Number(item.quantity ?? 1),
    price: item.price ?? Number(item.unitAmount ?? 0) / 100,
    image: imageOf(item.variantImageUrl ?? item.image ?? item.imageUrl ?? item.product?.image),
  })),
})

/**
 * GET /api/v1/admin/orders
 * Expected shape: { items: Order[], total, page, limit, pages }
 */
export async function getOrders(params = {}) {
  const { page = 1, limit = 10, status } = params
  const { data } = await api.get('/admin/orders', {
    params: {
      page,
      limit,
      status: ['successful', 'pending', 'cancelled'].includes(status) ? status : undefined,
    },
  })
  return data?.data ?? data
}

export async function getOrder(id) {
  const { data } = await api.get(`/admin/orders/${encodeURIComponent(id)}`)
  const order = data?.data ?? data
  return normalizeAdminOrder(order)
}

export async function updateOrderStatus(id, status) {
  const { data } = await api.patch(`/admin/orders/${id}/status`, { status })
  return data
}

export async function confirmWhatsAppOrder(id) {
  const { data } = await api.patch(`/admin/orders/${encodeURIComponent(id)}/whatsapp-confirm`)
  return data?.data ?? data
}

export default { getOrders, getOrder, updateOrderStatus, confirmWhatsAppOrder }
