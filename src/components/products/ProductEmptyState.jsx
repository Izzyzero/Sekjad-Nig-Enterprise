export function ProductEmptyState({ variant = 'search', onClearSearch, onClearFilters, onBrowseCategories }) {
  if (variant === 'search') {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 px-8 py-20 text-center">
        <p className="font-display text-ink mb-2 text-xl">No fabrics found</p>
        <p className="text-ink/50 mb-6 text-sm">Try searching for another fabric or category.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onClearSearch}
            className="border-stone-300 text-ink rounded-full border px-6 py-2.5 text-sm font-medium transition hover:border-stone-400"
          >
            Clear Search
          </button>
          <button
            type="button"
            onClick={onBrowseCategories}
            className="bg-[#E67E22] rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d4711f]"
          >
            Browse Categories
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-dashed border-stone-300 px-8 py-20 text-center">
      <p className="font-display text-ink mb-2 text-xl">No products match your filters.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onClearFilters}
          className="border-stone-300 text-ink rounded-full border px-6 py-2.5 text-sm font-medium transition hover:border-stone-400"
        >
          Clear Filters
        </button>
        <button
          type="button"
          onClick={onBrowseCategories}
          className="bg-[#E67E22] rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d4711f]"
        >
          View All Products
        </button>
      </div>
    </div>
  )
}

export default ProductEmptyState