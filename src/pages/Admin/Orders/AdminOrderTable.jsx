import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { OrderStatusBadge } from '../../../components/admin/OrdersStatusBadge'

function formatNaira(value) {
  return `₦${Number(value).toLocaleString('en-NG')}`
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function AdminOrderTable({ orders }) {
  return (
    <div className="w-full max-w-full overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-[#E5E7EB] text-[#6B7280]">
            <th className="px-5 py-3.5 font-medium">Order</th>
            <th className="px-5 py-3.5 font-medium">Customer</th>
            <th className="px-5 py-3.5 font-medium">Date</th>
            <th className="px-5 py-3.5 font-medium">Total</th>
            <th className="px-5 py-3.5 font-medium">Status</th>
            <th className="px-5 py-3.5 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id ?? order._id} className="border-b border-[#E5E7EB] last:border-none">
              <td className="text-[#111827] px-5 py-3.5 font-medium">#{order.orderNumber ?? order.reference ?? order.id ?? order._id}</td>
              <td className="px-5 py-3.5">
                <p className="text-[#111827]">{[order.user?.firstName, order.user?.lastName].filter(Boolean).join(' ') || order.customerName || '—'}</p>
                <p className="text-[#6B7280] text-xs">{order.user?.email ?? order.customerEmail}</p>
              </td>
              <td className="text-[#6B7280] px-5 py-3.5">{formatDate(order.createdAt)}</td>
              <td className="text-[#111827] px-5 py-3.5 font-medium">{formatNaira(order.total ?? Number(order.amount ?? 0) / 100)}</td>
              <td className="px-5 py-3.5"><OrderStatusBadge status={order.status} /></td>
              <td className="px-5 py-3.5 text-right">
                <Link
                  to={`/admin/orders/${order.id ?? order._id}`}
                  aria-label={`View order ${order.orderNumber ?? order.reference ?? order.id ?? order._id}`}
                  className="text-[#6B7280] hover:bg-stone-100 hover:text-[#111827] inline-flex size-9 items-center justify-center rounded-lg"
                >
                  <Eye size={15} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminOrderTable
