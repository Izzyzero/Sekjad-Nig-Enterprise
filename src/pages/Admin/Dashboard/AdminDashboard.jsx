import { useState } from 'react'
import { DollarSign, ShoppingBag, Package, Users } from 'lucide-react'
import { useDashboardStats } from '../../../hooks/useDashboard'
import { StatCard } from '../../../components/admin/StatCard'
import { RecentOrdersList } from '../../../components/admin/RecentOrderList'

const RANGE_OPTIONS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
]

function formatNaira(value) {
  return `₦${Number(value ?? 0).toLocaleString('en-NG')}`
}

export function AdminDashboardPage() {
  const [range, setRange] = useState('30d')
  const { data, isLoading, isError, refetch } = useDashboardStats(range)

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[#111827] text-2xl font-normal sm:text-3xl">Dashboard</h1>
          <p className="text-[#6B7280] mt-1 text-sm">Overview of your store&apos;s performance</p>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="focus:border-[#E67E22]/60 rounded-full border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#111827] outline-none"
        >
          {RANGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {isError && (
        <div className="rounded-2xl border border-red-100 bg-red-50/50 px-8 py-14 text-center">
          <p className="text-[#111827] mb-2 font-medium">Couldn&apos;t load dashboard data.</p>
          <button type="button" onClick={refetch} className="text-[#E67E22] text-sm font-semibold underline">
            Try Again
          </button>
        </div>
      )}

      {!isError && isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-stone-100" />
          ))}
        </div>
      )}

      {!isError && !isLoading && data && (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Revenue" value={formatNaira(data.totalRevenue)} changePct={data.revenueChangePct} icon={DollarSign} />
            <StatCard label="Total Orders" value={data.totalOrders ?? 0} changePct={data.ordersChangePct} icon={ShoppingBag} />
            <StatCard label="Total Products" value={data.totalProducts ?? 0} icon={Package} />
            <StatCard label="Total Customers" value={data.totalCustomers ?? 0} icon={Users} />
          </div>

          <RecentOrdersList orders={data.recentOrders} />
        </>
      )}
    </div>
  )
}

export default AdminDashboardPage
