import { useState } from 'react'
import { Search } from 'lucide-react'
import { useAdminOrders } from '../../../hooks/useOrders'
import { useDebounce } from '../../../hooks/useDebounce'
import { AdminOrderTable } from './AdminOrderTable'
import { ProductPagination } from '../../../components/products/ProductPagination'
import { ORDER_STATUSES } from '../../../components/admin/OrdersStatusBadge'

const PAGE_SIZE = 12

export function AdminOrdersPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading, isError, refetch } = useAdminOrders({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch,
    status,
  })

  const orders = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, data?.totalPages ?? Math.ceil(total / PAGE_SIZE))

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-[#111827] text-2xl font-normal sm:text-3xl">Orders</h1>
        <p className="text-[#6B7280] mt-1 text-sm">{total} orders total</p>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search size={16} className="text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by order number or customer..."
            className="focus:border-[#E67E22]/60 w-full rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-4 text-sm text-[#111827] outline-none"
          />
        </div>

        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          className="focus:border-[#E67E22]/60 rounded-full border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#111827] outline-none"
        >
          <option value="all">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {isError && (
        <div className="rounded-2xl border border-red-100 bg-red-50/50 px-8 py-16 text-center">
          <p className="text-[#111827] mb-2 font-medium">Couldn&apos;t load orders.</p>
          <button type="button" onClick={refetch} className="text-[#E67E22] text-sm font-semibold underline">
            Try Again
          </button>
        </div>
      )}

      {!isError && isLoading && (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-8 py-16 text-center text-sm text-[#6B7280]">
          Loading orders…
        </div>
      )}

      {!isError && !isLoading && orders.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#E5E7EB] px-8 py-16 text-center">
          <p className="text-[#111827] font-medium">No orders found</p>
          <p className="text-[#6B7280] mt-1 text-sm">Try adjusting your search or status filter.</p>
        </div>
      )}

      {!isError && !isLoading && orders.length > 0 && (
        <>
          <AdminOrderTable orders={orders} />
          <ProductPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}

export default AdminOrdersPage
