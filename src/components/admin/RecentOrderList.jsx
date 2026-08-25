import { Link } from 'react-router-dom'
import { OrderStatusBadge } from './OrdersStatusBadge'

function formatNaira(value) {
  return `₦${Number(value).toLocaleString('en-NG')}`
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
}

export function RecentOrdersList({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E5E7EB] px-6 py-10 text-center">
        <p className="text-[#6B7280] text-sm">No recent orders yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
        <h3 className="text-[#111827] font-semibold">Recent Orders</h3>
        <Link to="/admin/orders" className="text-[#E67E22] text-sm font-medium hover:underline">
          View all
        </Link>
      </div>
      <ul>
        {orders.map((order) => (
          <li key={order.id} className="border-b border-[#E5E7EB] px-5 py-3.5 last:border-none">
            <Link to={`/admin/orders/${order.id}`} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[#111827] truncate text-sm font-medium">{order.customerName}</p>
                <p className="text-[#6B7280] text-xs">#{order.orderNumber ?? order.id} · {formatDate(order.createdAt)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-[#111827] text-sm font-semibold">{formatNaira(order.total)}</span>
                <OrderStatusBadge status={order.status} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecentOrdersList
