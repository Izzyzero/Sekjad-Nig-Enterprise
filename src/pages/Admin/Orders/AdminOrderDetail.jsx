import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useAdminOrder, useConfirmWhatsAppOrder, useUpdateOrderStatus } from '../../../hooks/useOrders'
import { OrderStatusBadge } from '../../../components/admin/OrdersStatusBadge'
import { ORDER_STATUSES } from '../../../utils/orderStatus'
import { isWhatsAppOrder } from '../../../services/order.service'

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
  const confirmWhatsAppOrder = useConfirmWhatsAppOrder()
  const pendingStatusValues = new Set(['pending', 'awaiting_payment', 'awaiting-payment', 'unpaid', 'not_paid'])
  const orderPaymentStatus = String(order?.paymentStatus ?? order?.status ?? '').trim().toLowerCase()
  const isPendingWhatsAppOrder =
    pendingStatusValues.has(orderPaymentStatus) &&
    isWhatsAppOrder(order)

  if (isLoading) return <p className="text-[#6B7280] text-sm">Loading order…</p>
  if (isError || !order) return <p className="text-[#EF4444] text-sm">Couldn&apos;t load this order.</p>

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/orders" className="text-[#6B7280] hover:text-[#111827] mb-6 inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft size={15} /> Back to Orders
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display break-all text-[#111827] text-2xl font-normal">Order #{order.orderNumber ?? order.id}</h1>
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

        {isPendingWhatsAppOrder && (
          <button
            type="button"
            onClick={() => confirmWhatsAppOrder.mutate(id)}
            disabled={confirmWhatsAppOrder.isPending}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#E67E22] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d76a14] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CheckCircle2 size={15} />
            {confirmWhatsAppOrder.isPending ? 'Confirming payment...' : 'Confirm WhatsApp order as paid'}
          </button>
        )}
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <h3 className="text-[#111827] mb-3 text-sm font-semibold">Customer</h3>
          <p className="text-[#111827] text-sm">{order.customerName}</p>
          <p className="break-all text-[#6B7280] text-sm">{order.customerEmail}</p>
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
          {order.items.length === 0 && (
            <li className="px-5 py-5 text-sm text-[#6B7280]">No items were included with this order.</li>
          )}
          {order.items.map((item) => (
            <li key={item.id} className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] px-5 py-3.5 last:border-none">
              <div className="flex min-w-0 items-center gap-3">
                <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                  {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0">
                  <p className="break-words text-[#111827] text-sm font-medium">{item.name}</p>
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
