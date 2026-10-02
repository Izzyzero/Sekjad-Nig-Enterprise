import { useMemo, useState } from 'react'
import { ArrowLeft, Check, Heart, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Navbar } from '../../components/layout/Navbar/Navbar'
import { Footer } from '../../components/layout/Footer/Footer'
import { useProduct } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import { getApiError } from '../../services/api'
import { isVariantAvailable } from '../../services/product.service'

const formatNaira = (value) => `₦${Number(value ?? 0).toLocaleString('en-NG')}`

export function ProductDetailsPage() {
  const { id } = useParams()
  const { data: product, isLoading, isError, refetch } = useProduct(id)
  const { data: categories = [] } = useCategories()
  const { items: cartItems, addToCartAsync, isUpdating } = useCart()
  const { isWishlisted, toggle } = useWishlist()
  const [quantity, setQuantity] = useState(1)
  const [selection, setSelection] = useState({ productId: id, galleryImage: '', variantIds: [], previewVariantId: '', added: false, error: '' })
  const [adding, setAdding] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const currentSelection = selection.productId === id ? selection : { productId: id, galleryImage: '', variantIds: [], previewVariantId: '', added: false, error: '' }
  const { galleryImage: selectedGalleryImage, variantIds: selectedVariantIds, previewVariantId, added, error: addError } = currentSelection
  const updateSelection = (updates) => setSelection((current) => ({
    ...(current.productId === id ? current : { productId: id, galleryImage: '', variantIds: [], previewVariantId: '', added: false, error: '' }),
    ...updates,
  }))
  const images = useMemo(
    () => (product ? [product.image, ...(product.gallery ?? [])].filter(Boolean) : []),
    [product]
  )
  const variants = product?.variants ?? []
  const previewVariant = variants.find((variant) => variant.variantId === previewVariantId)
  const activeImage = selectedGalleryImage || previewVariant?.image?.url || images[0]
  const activeImageAlt = selectedGalleryImage
    ? product?.imageAlt || product?.name
    : previewVariant?.image?.altText || previewVariant?.colorName || product?.imageAlt || product?.name
  const categoryName =
    product?.categoryLabel || categories.find((category) => category.id === product?.category)?.label
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const wishlisted = product ? isWishlisted(product.id) : false

  const handleAddToCart = async () => {
    if (adding || isUpdating) return
    updateSelection({ error: '', added: false })
    const selectedVariants = variants.filter((variant) => selectedVariantIds.includes(variant.variantId))
    if (variants.length > 0 && (!selectedVariants.length || selectedVariants.some((variant) => !isVariantAvailable(variant)))) {
      updateSelection({ error: 'Choose at least one available color before adding this product to your cart.' })
      return
    }
    setAdding(true)
    const failures = []
    let addedCount = 0
    try {
      for (const variant of selectedVariants) {
        try {
          const result = await addToCartAsync(product, quantity, variant.variantId)
          if (result === false) return
          addedCount += 1
        } catch (error) {
          failures.push(`${variant.colorName}: ${getApiError(error, 'Could not add this color.')}`)
        }
      }
      if (failures.length) {
        const prefix = addedCount
          ? `Added ${addedCount} selected color${addedCount === 1 ? '' : 's'}, but could not add `
          : 'Could not add '
        updateSelection({ error: `${prefix}${failures.join('; ')}` })
      } else if (addedCount > 0 || variants.length === 0) {
        updateSelection({ added: true })
        window.setTimeout(() => setSelection((current) =>
          current.productId === id ? { ...current, added: false } : current
        ), 1800)
      }
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar open={menuOpen} setOpen={setMenuOpen} cartCount={cartCount} navBackground="bg-white shadow-sm" forceScrolledStyle={true}/>

      <main className="mx-auto min-h-[70vh] max-w-7xl px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:pb-24">
        <Link
          to="/shop"
          className="mb-7 inline-flex items-center gap-2 py-2 text-sm font-medium text-[#6B7280] transition hover:text-[#E67E22]"
        >
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        {isLoading && (
          <div className="grid animate-pulse gap-10 lg:grid-cols-2">
            <div className="aspect-square rounded-2xl bg-stone-100" />
            <div className="space-y-5 py-4">
              <div className="h-4 w-28 rounded bg-stone-100" />
              <div className="h-10 w-3/4 rounded bg-stone-100" />
              <div className="h-6 w-36 rounded bg-stone-100" />
              <div className="h-28 rounded bg-stone-100" />
            </div>
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-16 text-center">
            <p className="mb-4 text-sm text-red-600">Could not load this product.</p>
            <button
              type="button"
              onClick={refetch}
              className="rounded-full bg-[#E67E22] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d4711f]"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !isError && product && (
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Image gallery */}
            <section>
              <div className="aspect-square overflow-hidden rounded-2xl bg-stone-100">
                <img
                  src={activeImage}
                  alt={activeImageAlt}
                  className="h-full w-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-3 overflow-x-auto pb-1">
                  {images.map((image) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => updateSelection({ galleryImage: image })}
                      aria-label="View gallery image"
                      aria-current={selectedGalleryImage === image || (!selectedGalleryImage && !previewVariant && activeImage === image)}
                      className={`size-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                        (selectedGalleryImage === image || (!selectedGalleryImage && !previewVariant && activeImage === image)) ? 'border-[#E67E22]' : 'border-transparent'
                      }`}
                    >
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              {variants.length > 0 && (
                <div className="mt-6">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]">Available colors</p>
                  <p className="mb-3 text-xs text-[#6B7280]">Select one or more colors. The quantity below applies to each selected color.</p>
                  <div className="flex flex-wrap gap-3">
                    {variants.map((variant) => {
                      const isSelected = selectedVariantIds.includes(variant.variantId)
                      const unavailable = !isVariantAvailable(variant)
                      return (
                        <button
                          key={variant.variantId}
                          type="button"
                          disabled={unavailable}
                          onClick={() => {
                            updateSelection({
                              variantIds: isSelected
                                ? selectedVariantIds.filter((variantId) => variantId !== variant.variantId)
                                : [...selectedVariantIds, variant.variantId],
                              previewVariantId: variant.variantId,
                              galleryImage: '',
                              error: '',
                            })
                          }}
                          aria-pressed={isSelected}
                          aria-label={`${variant.colorName}${unavailable ? ' (unavailable)' : ''}`}
                          className={`flex items-center gap-2 rounded-xl border-2 p-1.5 pr-3 text-left transition ${
                            isSelected ? 'border-[#E67E22] bg-[#E67E22]/5' : 'border-[#E5E7EB]'
                          } ${unavailable ? 'cursor-not-allowed opacity-40' : 'hover:border-[#E67E22]/60'}`}
                        >
                          {variant.image?.url ? (
                            <img src={variant.image.url} alt="" className="size-12 rounded-lg object-cover" />
                          ) : (
                            <span className="grid size-12 place-items-center rounded-lg bg-stone-100 text-[10px] text-[#6B7280]">No image</span>
                          )}
                          <span className="text-sm font-medium text-[#111827]">
                            {variant.colorName}{unavailable ? ' · Unavailable' : ''}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  {selectedVariantIds.length > 0 && (
                    <p className="mt-2 text-xs text-[#6B7280]">
                      {selectedVariantIds.length} color{selectedVariantIds.length === 1 ? '' : 's'} selected
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* Details */}
            <section className="lg:py-5">
              {categoryName && (
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#E67E22]">
                  {categoryName}
                </p>
              )}
              <h1 className="font-display text-3xl font-normal leading-tight text-[#111827] sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl font-bold text-[#E67E22]">{formatNaira(product.price)}</span>
                {product.compareAtPrice && (
                  <span className="text-base text-[#9CA3AF] line-through">
                    {formatNaira(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <p className="mt-7 text-sm leading-7 text-[#6B7280] sm:text-base">{product.description}</p>

              {(product.brand || product.sku) && (
                <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-[#F8F5F2] p-4 text-sm">
                  {product.brand && (
                    <div>
                      <dt className="text-xs text-[#6B7280]">Brand</dt>
                      <dd className="mt-1 font-medium text-[#111827]">{product.brand}</dd>
                    </div>
                  )}
                  {product.sku && (
                    <div>
                      <dt className="text-xs text-[#6B7280]">SKU</dt>
                      <dd className="mt-1 font-medium text-[#111827]">{product.sku}</dd>
                    </div>
                  )}
                </dl>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="flex h-12 items-center justify-between rounded-full border border-[#E5E7EB] px-2 sm:w-36">
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    className="grid size-9 place-items-center"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="text-sm font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => value + 1)}
                    className="grid size-9 place-items-center"
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={adding || isUpdating || (variants.length > 0 && !variants.some(isVariantAvailable))}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#1F2937] px-6 py-6 text-sm font-semibold text-white transition hover:bg-[#E67E22] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {adding || isUpdating ? 'Adding…' : added ? (
                    <>
                      <Check size={17} /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={17} /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => toggle(product)}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  aria-pressed={wishlisted}
                  className="grid size-12 shrink-0 place-items-center rounded-full border border-[#E5E7EB] transition hover:border-[#E67E22]/40"
                >
                  <Heart size={18} fill={wishlisted ? '#E67E22' : 'none'} color={wishlisted ? '#E67E22' : '#111827'} />
                </button>
              </div>
              {addError && <p role="alert" className="mt-3 text-sm text-red-600">{addError}</p>}
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default ProductDetailsPage
