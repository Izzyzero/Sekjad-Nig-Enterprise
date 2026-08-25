import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../../../components/layout/Navbar/Navbar'
import { Footer } from '../../../components/layout/Footer/Footer'
import { Package, User, Heart, ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'
import { useWishlist } from '../../../hooks/useWishlist'
import { useCart } from '../../../hooks/useCart'
import { getApiError } from '../../../services/api'
import { formatCurrency } from '../../../utils/formatCurrency'

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

// ── Mock wishlist data (replace with API data when backend is ready) ─────────
export function Wishlist() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [justAdded, setJustAdded] = useState(null)
  const { isAuthenticated } = useAuth()
  const { items, remove, clear, isLoading, isError, error, mutationError, isUpdating, refetch } = useWishlist()
  const { addToCart: addProductToCart, isUpdating: isCartUpdating } = useCart()

  const addToCart = (product) => {
    addProductToCart(product)
    setJustAdded(product.id)
    window.setTimeout(() => setJustAdded(null), 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-charcoal h-9" />
      <Navbar open={menuOpen} setOpen={setMenuOpen} isAuthenticated={isAuthenticated} navBackground="bg-white shadow-sm"  forceScrolledStyle={true} />

      <MobileAccountTabs active="Wishlist" />

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
        <Link to="/" className="lg:hidden inline-flex items-center gap-1.5 text-sm text-charcoal/50 hover:text-charcoal mb-6 transition-colors">
          <ArrowLeft size={15} /> Back to store
        </Link>

        <div className="flex gap-10">
          <AccountNav active="Wishlist" />

          <div className="flex-1 min-w-0 space-y-5">

            {/* Page header */}
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-charcoal text-xl font-semibold">My Wishlist</h1>
                <p className="text-sm text-charcoal/45 mt-0.5">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
              </div>
              {items.length > 0 && (
                <button type="button" onClick={clear} disabled={isUpdating} className="text-xs text-charcoal/40 transition hover:text-red-500 disabled:opacity-50">
                  Clear all
                </button>
              )}
            </div>

            {mutationError && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {getApiError(mutationError, 'Could not update your wishlist.')}
              </div>
            )}

            {isLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm text-charcoal/50">
                Loading your wishlist…
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-14 text-center">
                <p className="text-sm text-red-600">{getApiError(error, 'Could not load your wishlist.')}</p>
                <button type="button" onClick={() => refetch()} className="bg-charcoal mt-5 rounded-full px-5 py-2.5 text-sm font-semibold text-white">
                  Try again
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
                <Heart size={36} className="mx-auto mb-3 text-charcoal/20" strokeWidth={1.4} />
                <p className="text-charcoal font-semibold mb-1">Your wishlist is empty</p>
                <p className="text-sm text-charcoal/40 mb-6">Save items you love to find them here later.</p>
                <Link to="/shop" className="bg-orange inline-flex rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d4711f]">
                  Browse products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group">
                  <div className="relative">
                    <Link to={`/shop/product/${item.id}`} className="block aspect-square overflow-hidden bg-stone-100">
                      <img src={item.image} alt={item.name}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      disabled={isUpdating}
                      aria-label={`Remove ${item.name} from wishlist`}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-charcoal/50 hover:text-red-500 shadow-sm transition-colors"
                    >
                      <Trash2 size={14} strokeWidth={1.8} />
                    </button>
                  </div>

                  <div className="p-3.5">
                    <Link to={`/shop/product/${item.id}`} className="text-sm font-semibold text-charcoal hover:text-orange transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-1.5 mt-1 mb-3">
                      <span className="text-orange text-sm font-bold">{formatCurrency(item.price)}</span>
                      {item.compareAtPrice && <span className="text-xs text-charcoal/30 line-through">{formatCurrency(item.compareAtPrice)}</span>}
                    </div>
                    <button
                      type="button"
                      disabled={isCartUpdating}
                      onClick={() => addToCart(item)}
                      className={`w-full inline-flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition-colors
                        ${justAdded === item.id
                          ? 'bg-green-500 text-white'
                          : 'bg-charcoal text-white hover:bg-orange'}`}
                    >
                      <ShoppingCart size={13} strokeWidth={1.8} />
                      {justAdded === item.id ? 'Added ✓' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Wishlist
