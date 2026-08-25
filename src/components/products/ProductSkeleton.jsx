export function ProductSkeleton() {
  return (
    <div className="animate-pulse" role="status" aria-label="Loading product">
      <div className="mb-3 aspect-[3/4] rounded-xl bg-stone-200" />
      <div className="mb-2 h-3.5 w-3/4 rounded bg-stone-200" />
      <div className="mb-2 h-3 w-1/3 rounded bg-stone-200" />
      <div className="h-4 w-1/2 rounded bg-stone-200" />
    </div>
  )
}

export function ProductSkeletonGrid({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
}

export default ProductSkeleton