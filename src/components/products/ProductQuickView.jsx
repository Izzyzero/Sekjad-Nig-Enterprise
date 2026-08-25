import { useEffect, useState } from 'react'
import { X, Minus, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'

function formatNaira(value) {
  return `₦${Number(value).toLocaleString('en-NG')}`
}

export function ProductQuickView({ product, onClose }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] ?? null)

  useEffect(() => {
    const handleKeyDown = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!product) return null

  const handleAddToCart = () => addToCart(product, quantity)
  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('/cart')
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-black/50" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        className="relative flex max-h-[92vh] w-full flex-col overflow-y-auto rounded-t-3xl bg-white sm:max-w-3xl sm:flex-row sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="text-[#111827] absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 shadow-sm"
        >
          <X size={18} />
        </button>

        <div className="aspect-square shrink-0 bg-stone-100 sm:w-1/2">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="flex-1 p-6 sm:p-8">
          <p className="text-[#6B7280] mb-1 text-xs">{product.categoryLabel}</p>
          <h2 id="quick-view-title" className="font-display text-[#111827] mb-2 text-2xl">
            {product.name}
          </h2>

          <div className="mb-3 flex items-center gap-2">
            <span className="text-[#E67E22] text-lg font-bold">{formatNaira(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-[#6B7280] line-through">{formatNaira(product.compareAtPrice)}</span>
            )}
          </div>

          {product.availabilityText && (
            <p className="text-[#22C55E] mb-4 text-sm font-medium">{product.availabilityText}</p>
          )}

          {product.description && (
            <p className="text-[#6B7280] mb-5 text-sm leading-relaxed">{product.description}</p>
          )}

          {product.colors?.length > 0 && (
            <div className="mb-5">
              <p className="text-[#111827] mb-2 text-xs font-semibold uppercase tracking-wide">Color</p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    aria-pressed={selectedColor?.name === color.name}
                    aria-label={color.name}
                    className={`flex size-9 items-center justify-center rounded-full border-2 transition ${
                      selectedColor?.name === color.name ? 'border-[#E67E22]' : 'border-transparent'
                    }`}
                  >
                    <span className="size-6 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <p className="text-[#111827] mb-2 text-xs font-semibold uppercase tracking-wide">Quantity</p>
            <div className="border-[#E5E7EB] inline-flex items-center rounded-full border">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex size-11 items-center justify-center"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="flex size-11 items-center justify-center"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="border-[#E67E22] text-[#E67E22] flex-1 rounded-full border py-3 text-sm font-semibold transition hover:bg-[#E67E22]/5"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 rounded-full bg-[#E67E22] py-3 text-sm font-semibold text-white transition hover:bg-[#d4711f]"
              >
                Buy Now
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/shop/product/${product.id}`)}
              className="text-[#6B7280] hover:text-[#111827] text-sm font-medium underline"
            >
              View Full Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductQuickView
