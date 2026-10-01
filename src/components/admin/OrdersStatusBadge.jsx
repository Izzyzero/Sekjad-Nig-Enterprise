import { STATUS_LABELS } from '../../utils/orderStatus'

const STATUS_STYLES = {
  successful: 'bg-[#22C55E]/10 text-[#22C55E]',
  pending: 'bg-amber-50 text-amber-600',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-purple-50 text-purple-600',
  delivered: 'bg-[#22C55E]/10 text-[#22C55E]',
  cancelled: 'bg-[#EF4444]/10 text-[#EF4444]',
}

export function OrderStatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? 'bg-stone-100 text-[#6B7280]'
  const label = STATUS_LABELS[status] ?? status

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {label}
    </span>
  )
}

export default OrderStatusBadge
