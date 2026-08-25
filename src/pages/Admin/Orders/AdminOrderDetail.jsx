import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAdminOrder, useUpdateOrderStatus } from '../../../hooks/useOrders'
import { OrderStatusBadge, ORDER_STATUSES } from '../../../components/admin/OrdersStatusBadge'

function formatNaira(value) {
  return `₦${Number(value).toLocaleString('en-NG')}`
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function AdminOrderDetailPage() {
  const { id } = useParams()
  const { data: order, isLoading, isError } = useAdminOrder(id)
  const updateStatus = useUpdateOrderStatus()

  if (isLoading) return <p className="text-[#6B7280] text-sm">Loading order…</p>
  if (isError || !order) return <p className="text-[#EF4444] text-sm">Couldn&apos;t load this order.</p>

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/orders" className="text-[#6B7280] hover:text-[#111827] mb-6 inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft size={15} /> Back to Orders
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[#111827] text-2xl font-normal">Order #{order.orderNumber ?? order.id}</h1>
          <p className="text-[#6B7280] mt-1 text-sm">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mb-6 rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <h3 className="text-[#111827] mb-3 text-sm font-semibold">Update Status</h3>
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              disabled={updateStatus.isPending || s === order.status}
              onClick={() => updateStatus.mutate({ id, status: s })}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed ${
                s === order.status
                  ? 'border-[#E67E22] bg-[#E67E22]/10 text-[#E67E22]'
                  : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#E67E22]/40'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <h3 className="text-[#111827] mb-3 text-sm font-semibold">Customer</h3>
          <p className="text-[#111827] text-sm">{order.customerName}</p>
          <p className="text-[#6B7280] text-sm">{order.customerEmail}</p>
          {order.customerPhone && <p className="text-[#6B7280] text-sm">{order.customerPhone}</p>}
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <h3 className="text-[#111827] mb-3 text-sm font-semibold">Shipping Address</h3>
          <p className="text-[#6B7280] text-sm leading-relaxed">{order.shippingAddress ?? '—'}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] px-5 py-4">
          <h3 className="text-[#111827] text-sm font-semibold">Items</h3>
        </div>
        <ul>
          {(order.items ?? []).map((item) => (
            <li key={item.id} className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-3.5 last:border-none">
              <div className="flex items-center gap-3">
                <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                  {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                </div>
                <div>
                  <p className="text-[#111827] text-sm font-medium">{item.name}</p>
                  <p className="text-[#6B7280] text-xs">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="text-[#111827] text-sm font-medium">{formatNaira(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-[#111827] font-semibold">Total</span>
          <span className="text-[#E67E22] font-display text-lg font-semibold">{formatNaira(order.total)}</span>
        </div>
      </div>
    </div>
  )
}

export default AdminOrderDetailPage
