import { useState } from 'react'
import { useCategories } from '../../hooks/useCategories'

export const COLORS = [
  { name: 'Black', hex: '#111827' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gold', hex: '#D4A017' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Green', hex: '#16A34A' },
  { name: 'Purple', hex: '#9333EA' },
  { name: 'Pink', hex: '#EC4899' },
]

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[#E5E7EB] py-5 first:pt-0 last:border-none">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-[#111827] mb-3 flex w-full items-center justify-between text-sm font-semibold"
        aria-expanded={open}
      >
        {title}
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
      </button>
      {open && children}
    </div>
  )
}

export function ProductFilters({ draft, onChangeDraft, onApply, onClearAll }) {
  const { data = [] } = useCategories()
  const categories = [{ id: 'all', slug: 'all', label: 'All Products' }, ...data]
  const setField = (key, value) => onChangeDraft({ ...draft, [key]: value })

  return (
    <div>
      <FilterSection title="Category">
        <ul className="space-y-1">
          {categories.map((category) => (
            <li key={category.id ?? category.slug}>
              <button
                type="button"
                onClick={() => setField('category', category.slug)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  draft.category === category.slug
                    ? 'bg-[#E67E22]/10 text-[#E67E22]'
                    : 'text-[#6B7280] hover:bg-stone-100 hover:text-[#111827]'
                }`}
              >
                {category.label}
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Price">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label htmlFor="min-price" className="text-[#6B7280] mb-1 block text-xs">
              Minimum
            </label>
            <input
              id="min-price"
              type="number"
              min="0"
              inputMode="numeric"
              value={draft.minPrice}
              onChange={(e) => setField('minPrice', e.target.value)}
              placeholder="₦0"
              className="focus:border-[#E67E22]/60 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] outline-none"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="max-price" className="text-[#6B7280] mb-1 block text-xs">
              Maximum
            </label>
            <input
              id="max-price"
              type="number"
              min="0"
              inputMode="numeric"
              value={draft.maxPrice}
              onChange={(e) => setField('maxPrice', e.target.value)}
              placeholder="₦150,000"
              className="focus:border-[#E67E22]/60 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] outline-none"
            />
          </div>
        </div>
      </FilterSection>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onClearAll}
          className="text-[#111827] flex-1 rounded-full border border-[#E5E7EB] py-2.5 text-sm font-medium transition hover:border-[#6B7280]"
        >
          Clear All
        </button>
        <button
          type="button"
          onClick={onApply}
          className="flex-1 rounded-full bg-[#E67E22] py-2.5 text-sm font-semibold text-white transition hover:bg-[#d4711f]"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}

export default ProductFilters
