import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useWishlist } from '../../hooks/useWishlist'
import { useCart } from '../../hooks/useCart'

function formatNaira(value) {
  return `₦${Number(value).toLocaleString('en-NG')}`
}

export function ProductCard({ product }) {
  const { isWishlisted, toggle } = useWishlist()
  const { addToCart } = useCart()
  const wishlisted = isWishlisted(product.id)

  // Adjust this route to match your existing product-details route
  // (e.g. /shop/product/:id or /products/:slug — check your router).
  const detailHref = `/shop/product/${product.id}`

  return (
    <article className="group min-w-0">
      <div className="relative h-[260px] overflow-hidden rounded-xl bg-stone-200 sm:h-[320px] lg:h-[350px]">
        <Link to={detailHref} aria-label={product.name} className="block h-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={480}
            height={640}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </Link>

        <button
          type="button"
          onClick={() => toggle(product)}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white shadow-sm"
        >
          <Heart size={16} fill={wishlisted ? '#E67E22' : 'none'} color={wishlisted ? '#E67E22' : '#111827'} />
        </button>

      </div>

      <Link to={detailHref} className="text-[#111827] hover:text-[#E67E22] mb-2 mt-4 block truncate text-sm font-semibold transition-colors">
        {product.name}
      </Link>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-[#E67E22] font-bold">{formatNaira(product.price)}</span>
        {product.compareAtPrice && (
          <span className="text-sm text-gray-400 line-through">{formatNaira(product.compareAtPrice)}</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => addToCart(product)}
        className="w-full rounded-full bg-[#1F2937] py-3 text-xs font-semibold tracking-wide text-white transition hover:bg-[#E67E22]"
      >
        Add to Cart
      </button>
    </article>
  )
}

export default ProductCard
