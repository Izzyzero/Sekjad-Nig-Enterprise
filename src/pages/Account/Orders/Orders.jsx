import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../../../components/layout/Navbar/Navbar'
import { Footer } from '../../../components/layout/Footer/Footer'
import { useAuth } from '../../../hooks/useAuth'
import { useCustomerOrders } from '../../../hooks/useCustomerOrders'
import { getApiError } from '../../../services/api'
import { formatCurrency } from '../../../utils/formatCurrency'
import {
  Package, User, Heart, ArrowLeft, ChevronRight,
  X, Clock, CheckCircle, XCircle
} from 'lucide-react'

// ── Shared account sidebar ───────────────────────────────────────────────────
function AccountNav({ active }) {
  const links = [
    { label: 'My Profile', href: '/profile',  icon: User    },
    { label: 'Orders',     href: '/orders',   icon: Package },
    { label: 'Wishlist',   href: '/wishlist', icon: Heart   },
  ]
  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <nav className="sticky top-32 rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {links.map(({ label, href, icon: Icon }) => (
          <Link key={label} to={href}
            className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors border-b border-slate-100 last:border-0
              ${active === label
                ? 'bg-orange/5 text-orange border-l-2 border-l-orange'
                : 'text-charcoal/70 hover:text-charcoal hover:bg-slate-50'}`}>
            <Icon size={16} strokeWidth={1.8} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

function MobileAccountTabs({ active }) {
  const links = [
    { label: 'Profile', href: '/profile',  icon: User    },
    { label: 'Orders',  href: '/orders',   icon: Package },
    { label: 'Wishlist',href: '/wishlist', icon: Heart   },
  ]
  return (
    <div className="flex lg:hidden border-b border-slate-200 bg-white sticky top-[4.5rem] z-30">
      {links.map(({ label, href, icon: Icon }) => (
        <Link key={label} to={href}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-semibold tracking-wide transition-colors
            ${active === label ? 'text-orange border-b-2 border-orange' : 'text-charcoal/50 hover:text-charcoal'}`}>
          <Icon size={17} strokeWidth={1.8} />
          {label}
        </Link>
      ))}
    </div>
  )
}

// ── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  pending:   { label: 'Pending',    color: 'bg-amber-50 text-amber-600 border-amber-200',    icon: Clock       },
  successful: { label: 'Successful', color: 'bg-green-50 text-green-600 border-green-200', icon: CheckCircle },
  cancelled: { label: 'Cancelled',  color: 'bg-red-50 text-red-500 border-red-200',          icon: XCircle     },
}

const FILTERS = ['All', 'Successful', 'Pending', 'Cancelled']


// ── Order detail modal ───────────────────────────────────────────────────────
function OrderModal({ order, onClose }) {
  const { label, color, icon: StatusIcon } = STATUS[order.status] ?? STATUS.pending
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal/40 mb-0.5">Order</p>
            <p className="text-charcoal font-display font-semibold">{order.number}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="text-charcoal/40 hover:text-charcoal transition-colors rounded-full p-1.5">
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>

        {/* body */}
        <div className="overflow-y-auto px-6 py-5 space-y-5">
          {/* status + date */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${color}`}>
              <StatusIcon size={12} strokeWidth={2} />
              {label}
            </span>
            <span className="text-xs text-charcoal/40">{order.date ? new Date(order.date).toLocaleDateString('en-NG') : ''}</span>
          </div>

          {/* items */}
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id ?? item.name} className="flex items-center gap-4">
                {item.image ? <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0" /> : <div className="grid w-16 h-16 place-items-center rounded-xl bg-stone-100 text-stone-300"><Package size={20} /></div>}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-charcoal truncate">{item.name}</p>
                  {item.colorName && <p className="text-xs text-charcoal/55 mt-0.5">Color: {item.colorName}</p>}
                  <p className="text-xs text-charcoal/45 mt-0.5">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-orange shrink-0">{formatCurrency(item.price, order.currency)}</p>
              </div>
            ))}
          </div>

          {/* divider */}
          <div className="border-t border-slate-100" />

          {order.paidAt && <p className="text-xs text-charcoal/50">Paid {new Date(order.paidAt).toLocaleDateString('en-NG')}</p>}

          {/* total */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-sm font-medium text-charcoal/60">Order Total</p>
            <p className="text-base font-bold text-charcoal">{formatCurrency(order.total, order.currency)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export function Orders() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [page, setPage] = useState(1)
  const { isAuthenticated } = useAuth()
  const { data, isPending, isError, error, refetch } = useCustomerOrders(page)
  const orders = data?.orders ?? []
  const pagination = data?.pagination

  const filtered = orders.filter((o) =>
    activeFilter === 'All' || o.status === activeFilter.toLowerCase()
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-charcoal h-9" />
      <Navbar open={menuOpen} setOpen={setMenuOpen} isAuthenticated={isAuthenticated} navBackground="bg-white shadow-sm"  forceScrolledStyle={true} />

      <MobileAccountTabs active="Orders" />

      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-14">
        <Link to="/" className="lg:hidden inline-flex items-center gap-1.5 text-sm text-charcoal/50 hover:text-charcoal mb-6 transition-colors">
          <ArrowLeft size={15} /> Back to store
        </Link>

        <div className="flex gap-10">
          <AccountNav active="Orders" />

          <div className="flex-1 min-w-0 space-y-5">

            {/* Page header */}
            <div>
              <h1 className="font-display text-charcoal text-xl font-semibold">My Orders</h1>
              <p className="text-sm text-charcoal/45 mt-0.5">{pagination?.total ?? 0} orders placed</p>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
              {FILTERS.map((f) => (
                <button key={f} type="button" onClick={() => setActiveFilter(f)}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors
                    ${activeFilter === f
                      ? 'bg-orange border-orange text-white'
                      : 'border-slate-200 bg-white text-charcoal/60 hover:border-charcoal/30 hover:text-charcoal'}`}>
                  {f}
                </button>
              ))}
            </div>

            {/* Empty state */}
            {isPending && <div role="status" className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-charcoal/50">Loading your orders...</div>}
            {isError && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-sm text-red-600">{getApiError(error, 'Could not load your orders.')} <button type="button" onClick={() => refetch()} className="ml-2 font-semibold underline">Try again</button></div>}
            {!isPending && !isError && filtered.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
                <Package size={36} className="mx-auto mb-3 text-charcoal/20" strokeWidth={1.4} />
                <p className="text-charcoal font-semibold mb-1">No {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} orders</p>
                <p className="text-sm text-charcoal/40 mb-6">
                  {activeFilter === 'All' ? "You haven't placed any orders yet." : `No orders with "${activeFilter}" status.`}
                </p>
                <Link to="/shop" className="bg-orange inline-flex rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d4711f]">
                  Start shopping
                </Link>
              </div>
            )}

            {/* Order list */}
            <div className="space-y-3">
              {!isPending && !isError && filtered.map((order) => {
                const { label, color, icon: StatusIcon } = STATUS[order.status] ?? STATUS.pending
                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="w-full bg-white rounded-2xl border border-slate-200 p-5 text-left hover:border-orange/30 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* item thumbnails */}
                      <div className="flex -space-x-2 shrink-0">
                        {order.items.slice(0, 3).map((item, i) => (
                          item.image ? <img key={item.id ?? i} src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border-2 border-white bg-stone-100" /> : <div key={item.id ?? i} className="grid w-12 h-12 place-items-center rounded-xl border-2 border-white bg-stone-100 text-stone-300"><Package size={18} /></div>
                        ))}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-charcoal">{order.number}</p>
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${color}`}>
                            <StatusIcon size={11} strokeWidth={2} />
                            {label}
                          </span>
                        </div>
                        <p className="text-xs text-charcoal/40 mt-1">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''} · {order.date ? new Date(order.date).toLocaleDateString('en-NG') : ''}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-charcoal/55">
                          {order.items.map((item) => `${item.name}${item.colorName ? ` · ${item.colorName}` : ''} × ${item.quantity}`).join(', ')}
                        </p>
                        <p className="text-sm font-bold text-charcoal mt-1">{formatCurrency(order.total, order.currency)}</p>
                      </div>

                      <ChevronRight size={17} className="text-charcoal/25 group-hover:text-orange shrink-0 mt-1 transition-colors" strokeWidth={2} />
                    </div>
                  </button>
                )
              })}
            </div>

            {!isPending && !isError && pagination && pagination.pages > 1 && (
              <nav aria-label="Order pages" className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm">
                <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1} className="font-medium text-orange disabled:text-charcoal/30">Previous</button>
                <span className="text-charcoal/60">Page {pagination.page} of {pagination.pages}</span>
                <button type="button" onClick={() => setPage((current) => Math.min(pagination.pages, current + 1))} disabled={page >= pagination.pages} className="font-medium text-orange disabled:text-charcoal/30">Next</button>
              </nav>
            )}

          </div>
        </div>
      </main>

      <Footer />

      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  )
}

export default Orders
