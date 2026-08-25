import { useState } from 'react'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer/Footer'
import { Navbar } from '../../components/layout/Navbar/Navbar'
import { useCart } from '../../hooks/useCart'
import { formatCurrency } from '../../utils/formatCurrency'
import { getApiError } from '../../services/api'

export function CartPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading,
    isError,
    error,
    mutationError,
    isUpdating,
    refetch,
  } = useCart()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce((total, item) => total + Number(item.price || 0) * item.quantity, 0)

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <Navbar open={menuOpen} setOpen={setMenuOpen} forceScrolledStyle />

      <main className="mx-auto min-h-[70vh] max-w-6xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">

        {/* Page header */}
        <div className="mb-10">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E67E22]">Your selection</p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-display text-3xl font-normal text-[#111827] sm:text-4xl">
              Shopping Cart
              {items.length > 0 && (
                <span className="ml-3 align-middle text-base font-normal text-[#9CA3AF]">
                  ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </span>
              )}
            </h1>
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                disabled={isUpdating}
                className="text-xs font-medium text-[#9CA3AF] transition hover:text-red-400"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {mutationError && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {getApiError(mutationError, 'Could not update your cart. Please try again.')}
          </div>
        )}

        {isLoading ? (
          <section className="mb-12 rounded-3xl border border-[#E9E4DF] bg-white py-16 text-center">
            <p className="text-sm text-[#6B7280]">Loading your cart…</p>
          </section>
        ) : isError ? (
          <section className="mb-12 rounded-3xl border border-red-100 bg-red-50 px-6 py-14 text-center">
            <p className="text-sm text-red-600">
              {getApiError(error, 'Could not load your cart.')}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-full bg-[#1F2937] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </section>
        ) : items.length === 0 ? (
          <section className="rounded-3xl border border-[#E9E4DF] bg-white text-center mb-12">
            <div className="mx-auto mb-5 mt-7    grid size-14 place-items-center rounded-full bg-[#E67E22]/10 text-[#E67E22]">
              <ShoppingBag size={24} strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-2xl text-[#111827]">Your cart is empty</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#6B7280]">
              Explore our collection of premium Nigerian fabrics and find something beautiful.
            </p>
            <Link
              to="/shop"
              className="mt-7 mb-7 inline-flex items-center gap-2 rounded-full bg-[#1F2937]  py-3  text-sm font-semibold text-white transition hover:bg-[#E67E22]"
            >
              Browse collection <ArrowRight size={15} />
            </Link>
          </section>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">

            {/* Cart items */}
            <section className="space-y-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-[#EEEAE6] bg-white p-4 sm:gap-5 sm:p-5"
                >
                  {/* Image — fixed square, compact */}
                  <Link
                    to={`/shop/product/${item.id}`}
                    className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:h-24 sm:w-24"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-stone-300">
                        <ShoppingBag size={20} />
                      </div>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        {item.categoryLabel && (
                          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E67E22]">
                            {item.categoryLabel}
                          </p>
                        )}
                        <Link
                          to={`/shop/product/${item.id}`}
                          className="block truncate font-display text-base font-normal text-[#111827] transition hover:text-[#E67E22] sm:text-lg"
                        >
                          {item.name}
                        </Link>
                        {(item.brand || item.sku) && (
                          <p className="mt-0.5 text-xs text-[#C4BDB6]">
                            {item.brand || `SKU: ${item.sku}`}
                          </p>
                        )}
                      </div>
                      {/* Price — top right */}
                      <div className="shrink-0 text-right">
                        <p className="font-semibold text-[#111827]">
                          {formatCurrency(Number(item.price || 0) * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="mt-0.5 text-xs text-[#C4BDB6]">
                            {formatCurrency(item.price)} each
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Controls row */}
                    <div className="flex items-center justify-between">
                      <div className="flex h-8 items-center rounded-full border border-[#E5E7EB] bg-[#FAF9F7] px-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isUpdating}
                          aria-label={`Decrease ${item.name} quantity`}
                          className="grid size-6 place-items-center rounded-full text-[#6B7280] transition hover:bg-white hover:text-[#111827] disabled:opacity-30"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold text-[#111827]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isUpdating}
                          aria-label={`Increase ${item.name} quantity`}
                          className="grid size-6 place-items-center rounded-full text-[#6B7280] transition hover:bg-white hover:text-[#111827]"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        disabled={isUpdating}
                        className="flex items-center gap-1 text-xs text-[#C4BDB6] transition hover:text-red-400"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {/* Promo code row
              <div className="flex gap-2 rounded-2xl border border-[#EEEAE6] bg-white p-4">
                <div className="flex flex-1 items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#FAF9F7] px-4 py-2">
                  <Tag size={14} className="shrink-0 text-[#C4BDB6]" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code"
                    className="min-w-0 flex-1 bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#C4BDB6]"
                  />
                </div>
                <button
                  type="button"
                  className="rounded-full border border-[#E5E7EB] px-5 py-2 text-sm font-medium text-[#6B7280] transition hover:border-[#E67E22] hover:text-[#E67E22]"
                >
                  Apply
                </button>
              </div> */}
            </section>

            {/* Order summary */}
            <aside className=" mb-12 rounded-2xl border border-[#E9E4DF] bg-white p-6 lg:sticky lg:top-28">
              <h2 className="font-display text-xl text-[#111827]">Order summary</h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">
                    Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                  </span>
                  <span className="font-medium text-[#111827]">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Delivery</span>
                  <span className="text-xs text-[#9CA3AF]">Calculated at checkout</span>
                </div>
              </div>

              <div className="my-5 border-t border-[#F0EBE5]" />

              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-[#111827]">Total</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#111827]">{formatCurrency(subtotal)}</p>
                  <p className="text-xs text-[#9CA3AF]">Excl. delivery</p>
                </div>
              </div>

              <button
                type="button"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#E67E22] py-3.5 text-sm font-semibold text-white transition hover:bg-[#d4711f] active:scale-[0.98]"
              >
                Proceed to checkout <ArrowRight size={15} />
              </button>

              <Link
                to="/shop"
                className="mt-3 block py-2 text-center text-sm font-medium text-[#9CA3AF] transition hover:text-[#E67E22]"
              >
                Continue shopping
              </Link>

              {/* Trust badge */}
              <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#FAF9F7] px-4 py-3">
                <Shield size={14} className="shrink-0 text-[#C4BDB6]" />
                <p className="text-xs leading-5 text-[#9CA3AF]">
                  Secure checkout. Delivery confirmed before payment.
                </p>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default CartPage
