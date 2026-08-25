
import { useEffect, useRef, useState } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { useProductSuggestions } from '../../hooks/useProducts'

const POPULAR_SEARCHES = ['Aso Oke', 'Wedding Lace', 'Bridal Fabrics', 'Senator Materials']
const RECENT_SEARCHES_KEY = 'sekjad_recent_searches'

function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || []
  } catch {
    return []
  }
}

function pushRecentSearch(term) {
  const trimmed = term.trim()
  if (!trimmed) return
  const current = getRecentSearches().filter((t) => t.toLowerCase() !== trimmed.toLowerCase())
  const next = [trimmed, ...current].slice(0, 5)
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next))
  return next
}

export function ProductSearch({ value, onChange, onSubmit, onSelectCategory }) {
  const [focused, setFocused] = useState(false)
  const [recent, setRecent] = useState(getRecentSearches())
  const containerRef = useRef(null)

  const { data: suggestions, isFetching } = useProductSuggestions(value)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setFocused(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const commitSearch = (term) => {
    onSubmit(term)
    setRecent(pushRecentSearch(term))
    setFocused(false)
  }

  const showDropdown = focused

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search size={18} className="text-[#6B7280] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="search-suggestions"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitSearch(value)
            if (e.key === 'Escape') setFocused(false)
          }}
          placeholder="Search for lace, Aso Oke, Damask, Brocade..."
          className="focus:border-[#E67E22]/60 w-full rounded-full border border-[#E5E7EB] bg-white py-3.5 pl-11 pr-11 text-sm text-[#111827] outline-none placeholder:text-[#6B7280]"
        />
        {isFetching && (
          <Loader2 size={16} className="text-[#6B7280] absolute right-11 top-1/2 -translate-y-1/2 animate-spin" />
        )}
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear search"
            className="text-[#6B7280] hover:text-[#111827] absolute right-3.5 top-1/2 -translate-y-1/2"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          id="search-suggestions"
          className="absolute inset-x-0 top-full z-30 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-lg"
        >
          {value.trim().length > 1 ? (
            <>
              {suggestions?.products?.length > 0 && (
                <div className="mb-4">
                  <p className="text-[#6B7280] mb-2 text-[10px] font-semibold uppercase tracking-widest">Products</p>
                  {suggestions.products.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => commitSearch(product.name)}
                      className="text-[#111827] hover:bg-stone-50 block w-full rounded-lg px-2 py-2 text-left text-sm"
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
              )}

              {suggestions?.categories?.length > 0 && (
                <div className="mb-4">
                  <p className="text-[#6B7280] mb-2 text-[10px] font-semibold uppercase tracking-widest">Categories</p>
                  {suggestions.categories.map((category) => (
                    <button
                      key={category.slug}
                      type="button"
                      onClick={() => onSelectCategory(category.slug)}
                      className="text-[#111827] hover:bg-stone-50 block w-full rounded-lg px-2 py-2 text-left text-sm"
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              )}

              {!isFetching && !suggestions?.products?.length && !suggestions?.categories?.length && (
                <p className="text-[#6B7280] px-2 py-3 text-sm">No matches yet — press Enter to search anyway.</p>
              )}
            </>
          ) : (
            <>
              {recent.length > 0 && (
                <div className="mb-4">
                  <p className="text-[#6B7280] mb-2 text-[10px] font-semibold uppercase tracking-widest">Recent Searches</p>
                  {recent.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => commitSearch(term)}
                      className="text-[#111827] hover:bg-stone-50 block w-full rounded-lg px-2 py-2 text-left text-sm"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              )}
              <div>
                <p className="text-[#6B7280] mb-2 text-[10px] font-semibold uppercase tracking-widest">Popular Searches</p>
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => commitSearch(term)}
                    className="text-[#111827] hover:bg-stone-50 block w-full rounded-lg px-2 py-2 text-left text-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductSearch
