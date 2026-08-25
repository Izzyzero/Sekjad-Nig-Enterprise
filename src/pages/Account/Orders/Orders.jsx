import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../../../components/layout/Navbar/Navbar'
import { Footer } from '../../../components/layout/Footer/Footer'
import { useAuth } from '../../../hooks/useAuth'
import {
  Package, User, Heart, ArrowLeft, ChevronRight,
  X, MapPin, Clock, CheckCircle, Truck, XCircle, RefreshCw
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
  confirmed: { label: 'Confirmed',  color: 'bg-blue-50 text-blue-600 border-blue-200',       icon: RefreshCw   },
  shipped:   { label: 'Shipped',    color: 'bg-purple-50 text-purple-600 border-purple-200', icon: Truck       },
  delivered: { label: 'Delivered',  color: 'bg-green-50 text-green-600 border-green-200',    icon: CheckCircle },
  cancelled: { label: 'Cancelled',  color: 'bg-red-50 text-red-500 border-red-200',          icon: XCircle     },
}

const FILTERS = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

// ── Mock orders (replace with API data when backend is ready) ────────────────
const MOCK_ORDERS = [
  {
    id: 'SKJ-2024-001',
    date: '12 Jul 2025',
    status: 'delivered',
    total: '₦80,000',
    address: '14 Balogun Street, Lagos Island',
    items: [
      { name: 'Royal Blue Brocade', qty: 2, price: '₦30,000', img: 'https://i.pinimg.com/1200x/e1/f0/e9/e1f0e962fce266ae8745f73c5c0284e3.jpg' },
      { name: 'Gold Beaded Lace',   qty: 1, price: '₦50,000', img: 'https://i.pinimg.com/1200x/b9/4e/54/b94e54ecf54f780dffd36325ef247542.jpg' },
    ],
  },
  {
    id: 'SKJ-2024-002',
    date: '28 Jul 2025',
    status: 'shipped',
    total: '₦40,000',
    address: '7 Akin Adesola Street, Victoria Island',
    items: [
      { name: '3D Sego', qty: 1, price: '₦40,000', img: 'https://i.pinimg.com/1200x/dd/c6/0d/ddc60d6a5d42c1424291bc13d5a6cd65.jpg' },
    ],
  },
  {
    id: 'SKJ-2024-003',
    date: '3 Aug 2025',
    status: 'pending',
    total: '₦65,000',
    address: '22 Admiralty Way, Lekki Phase 1',
    items: [
      { name: 'Swiss Lace Set', qty: 1, price: '₦65,000', img: 'https://i.pinimg.com/1200x/3b/8c/1c/3b8c1c7103ce2f9e3da28ca26ddb5145.jpg' },
    ],
  },
  {
    id: 'SKJ-2024-004',
    date: '5 Aug 2025',
    status: 'cancelled',
    total: '₦18,500',
    address: '3 Herbert Macaulay Way, Yaba',
    items: [
      { name: 'Deep Navy Senator', qty: 1, price: '₦18,500', img: 'https://i.pinimg.com/1200x/89/57/3d/89573de8bb6ce6ce53190277715c56ca.jpg' },
    ],
  },
]

// ── Order detail modal ───────────────────────────────────────────────────────
function OrderModal({ order, onClose }) {
  const { label, color, icon: StatusIcon } = STATUS[order.status]
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal/40 mb-0.5">Order</p>
            <p className="text-charcoal font-display font-semibold">{order.id}</p>
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
            <span className="text-xs text-charcoal/40">{order.date}</span>
          </div>

          {/* items */}
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.name} className="flex items-center gap-4">
                <img src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-charcoal truncate">{item.name}</p>
                  <p className="text-xs text-charcoal/45 mt-0.5">Qty: {item.qty}</p>
                </div>
                <p className="text-sm font-bold text-orange shrink-0">{item.price}</p>
              </div>
            ))}
          </div>

          {/* divider */}
          <div className="border-t border-slate-100" />

          {/* delivery address */}
          <div className="flex gap-3">
            <MapPin size={16} className="text-orange mt-0.5 shrink-0" strokeWidth={1.8} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-0.5">Delivery Address</p>
              <p className="text-sm text-charcoal">{order.address}</p>
            </div>
          </div>

          {/* total */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-sm font-medium text-charcoal/60">Order Total</p>
            <p className="text-base font-bold text-charcoal">{order.total}</p>
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
  const { isAuthenticated } = useAuth()

  const filtered = MOCK_ORDERS.filter((o) =>
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
              <p className="text-sm text-charcoal/45 mt-0.5">{MOCK_ORDERS.length} orders placed</p>
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
            {filtered.length === 0 && (
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
              {filtered.map((order) => {
                const { label, color, icon: StatusIcon } = STATUS[order.status]
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
                          <img key={i} src={item.img} alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-white bg-stone-100" />
                        ))}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-charcoal">{order.id}</p>
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${color}`}>
                            <StatusIcon size={11} strokeWidth={2} />
                            {label}
                          </span>
                        </div>
                        <p className="text-xs text-charcoal/40 mt-1">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''} · {order.date}
                        </p>
                        <p className="text-sm font-bold text-charcoal mt-1">{order.total}</p>
                      </div>

                      <ChevronRight size={17} className="text-charcoal/25 group-hover:text-orange shrink-0 mt-1 transition-colors" strokeWidth={2} />
                    </div>
                  </button>
                )
              })}
            </div>

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