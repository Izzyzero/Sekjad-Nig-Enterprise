import { api } from './api'

/**
 * Expected shape:
 * {
 *   totalRevenue: number,
 *   totalOrders: number,
 *   totalProducts: number,
 *   totalCustomers: number,
 *   revenueChangePct: number,
 *   ordersChangePct: number,
 *   revenueByDay: [{ date: '2026-08-01', revenue: 120000 }, ...],
 *   recentOrders: [{ id, customerName, total, status, createdAt }, ...]
 * }
 */
export async function getDashboardStats(params = {}) {
  const { range = '30d' } = params
  const { data } = await api.get('/admin/dashboard', { params: { range } })
  return data
}

export default { getDashboardStats }
