import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { Navbar } from '../../components/layout/Navbar/Navbar'
import { Footer } from '../../components/layout/Footer/Footer'
import { useAuth } from '../../hooks/useAuth'
import { useDebounce } from '../../hooks/useDebounce'
import { useProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'

import { CategoryNav } from '../../components/products/CategoryNav'
import { ProductSearch } from '../../components/products/ProductSearch'
import { ActiveFilterChips } from '../../components/products/ActiveFiltersChip'
import { ProductFilters } from '../../components/products/ProductFilters'
import { ProductGrid } from '../../components/products/ProductGrid'
import { ProductPagination } from '../../components/products/ProductPagination'
import { ProductSkeletonGrid } from '../../components/products/ProductSkeleton'
import { ProductEmptyState } from '../../components/products/ProductEmptyState'
import { ProductErrorState } from '../../components/products/ProductErrorState'
// import {productService} from '../../services/product.service'

const PAGE_SIZE = 12

export function ShopPage() {
  const { isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const resultsTopRef = useRef(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()

  // ── URL-derived filter state ──
  const category = searchParams.get('category') || 'all'    
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const search = searchParams.get('search') || ''

  const [searchInput, setSearchInput] = useState(search)
  const debouncedSearch = useDebounce(searchInput, 400)

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Draft filters for the sidebar/drawer — only commit to the URL on Apply,
  // so typing a price range doesn't refetch on every keystroke.
  const [draftFilters, setDraftFilters] = useState({ category, minPrice, maxPrice })

  // ── Sync debounced search text into the URL ──
  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (debouncedSearch.trim()) next.set('search', debouncedSearch.trim())
      else next.delete('search')
      next.delete('page')
      return next
    }, { replace: true })
  }, [debouncedSearch]) // eslint-disable-line react-hooks/exhaustive-deps

  const setParam = (key, value, { resetPage = true } = {}) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (!value || value === 'all') next.delete(key)
      else next.set(key, value)
      if (resetPage) next.delete('page')
      return next
    })
  }

  const applyFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      const apply = (key, value) => {
        if (!value || value === 'all') next.delete(key)
        else next.set(key, value)
      }
      apply('category', draftFilters.category)
      apply('minPrice', draftFilters.minPrice)
      apply('maxPrice', draftFilters.maxPrice)
      next.delete('page')
      return next
    })
    setMobileFiltersOpen(false)
  }

  const clearAllFilters = () => {
    setSearchInput('')
    setDraftFilters({ category: 'all', minPrice: '', maxPrice: '' })
    setSearchParams({})
  }

  const removeChip = (key) => {
    if (key === 'search') {
      setSearchInput('')
      setParam('search', '')
    } else if (key === 'category') {
      setDraftFilters((d) => ({ ...d, category: 'all' }))
      setParam('category', '')
    } else if (key === 'price') {
      setDraftFilters((d) => ({ ...d, minPrice: '', maxPrice: '' }))
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.delete('minPrice')
        next.delete('maxPrice')
        next.delete('page')
        return next
      })
    }
  }

  const goToPage = (nextPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (nextPage <= 1) next.delete('page')
      else next.set('page', String(nextPage))
      return next
    })
    resultsTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const selectedCategory = categories.find((item) => item.slug === category || item.id === category)
  const queryFilters = useMemo(
    () => ({ page, limit: PAGE_SIZE, search, category: selectedCategory?.id, minPrice, maxPrice }),
    [page, search, selectedCategory?.id, minPrice, maxPrice]
  )

  const categoryReady = category === 'all' || (!categoriesLoading && !!selectedCategory)
  const { data, isLoading, isFetching, isError, refetch } = useProducts(queryFilters, { enabled: categoryReady })

  const products = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, data?.totalPages ?? Math.ceil(total / PAGE_SIZE))

  const hasActiveFilters = !!search || category !== 'all' || !!minPrice || !!maxPrice
  const isFilteredEmpty = !isLoading && !isError && products.length === 0 && hasActiveFilters
  const isSearchEmpty = isFilteredEmpty && !!search

  return (
    <div className="min-h-screen bg-white">
      <Navbar open={mobileMenuOpen} setOpen={setMobileMenuOpen} isAuthenticated={isAuthenticated} navBackground="bg-white shadow-sm" 
        forceScrolledStyle={true} />

      <main className="pt-22 sm:pt-22">
        {/* ── Shop Header ── */}
        <section className="border-b border-[#E5E7EB] bg-[#F8F5F2]/60 px-5 py-8 sm:px-8 sm:py-10">
          <div className="mx-auto max-w-7xl">
            <nav aria-label="Breadcrumb" className="text-[#6B7280] mb-3 text-xs">
              <Link to="/" className="hover:text-[#E67E22]">Home</Link>
              <span className="mx-1.5">/</span>
              <span className="text-[#111827]">Shop</span>
            </nav>
            <h1 className="font-display text-[#111827] mb-2 text-2xl font-normal sm:text-3xl lg:text-4xl">
              Explore Our Collection
            </h1>
            <p className="text-[#6B7280] max-w-xl text-sm leading-relaxed">
              Discover premium fabrics carefully selected for weddings, celebrations, traditional occasions, and everyday elegance.
            </p>
          </div>
        </section>

        {/* ── Search ── */}
        <section className="mx-auto max-w-3xl px-5 pt-6 sm:px-8">
          <ProductSearch
            value={searchInput}
            onChange={setSearchInput}
            onSubmit={(term) => {
              setSearchInput(term)
              setParam('search', term)
            }}
            onSelectCategory={(slug) => {
              setDraftFilters((d) => ({ ...d, category: slug }))
              setParam('category', slug)
            }}
          />
        </section>

        {/* ── Category Nav ── */}
        <div className="mt-6">
          <CategoryNav
            activeCategory={category}
            onSelect={(slug) => {
              setDraftFilters((d) => ({ ...d, category: slug }))
              setParam('category', slug)
            }}
          />
        </div>

        {/* ── Active Filter Chips ── */}
        <ActiveFilterChips
          filters={{ search, category, minPrice, maxPrice }}
          onRemove={removeChip}
          onClearAll={clearAllFilters}
        />

        <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          {/* ── Results Header ── */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <p className="text-[#6B7280] text-sm">
              {search ? (
                <>Search results for &ldquo;{search}&rdquo; — <span className="text-[#111827] font-medium">{total} products found</span></>
              ) : (
                <span className="text-[#111827] font-medium">{total} Products</span>
              )}
            </p>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="border-[#E5E7EB] text-[#111827] flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium lg:hidden"
              >
                <SlidersHorizontal size={15} />
                Filter
              </button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            {/* ── Desktop Filter Sidebar ── */}
            <aside className="hidden lg:block">
              <div className="sticky top-32">
                <ProductFilters
                  draft={draftFilters}
                  onChangeDraft={setDraftFilters}
                  onApply={applyFilters}
                  onClearAll={clearAllFilters}
                />
              </div>
            </aside>

            {/* ── Product Grid ── */}
            <div ref={resultsTopRef}>
              {isError && <ProductErrorState onRetry={refetch} />}

              {!isError && isLoading && <ProductSkeletonGrid count={PAGE_SIZE} />}

              {!isError && !isLoading && isFilteredEmpty && (
                <ProductEmptyState
                  variant={isSearchEmpty ? 'search' : 'filters'}
                  onClearSearch={() => {
                    setSearchInput('')
                    setParam('search', '')
                  }}
                  onClearFilters={clearAllFilters}
                  onBrowseCategories={() => document.querySelector('nav[aria-label="Product categories"]')?.scrollIntoView({ behavior: 'smooth' })}
                />
              )}

              {!isError && !isLoading && !isFilteredEmpty && products.length > 0 && (
                <div className={isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
                  <ProductGrid products={products} />
                  <ProductPagination currentPage={page} totalPages={totalPages} onPageChange={goToPage} />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* ── Mobile Filter Drawer ── */}
      <div
        aria-hidden="true"
        onClick={() => setMobileFiltersOpen(false)}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 lg:hidden ${
          mobileFiltersOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter products"
        className={`fixed inset-y-0 right-0 z-50 flex w-80 max-w-[88vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <p className="font-display text-[#111827] text-lg">Filters</p>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Close filters"
            className="text-[#6B7280] hover:text-[#111827] flex size-9 items-center justify-center rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <ProductFilters
            draft={draftFilters}
            onChangeDraft={setDraftFilters}
            onApply={applyFilters}
            onClearAll={clearAllFilters}
          />
        </div>
      </div>

    </div>
  )
}

export default ShopPage
