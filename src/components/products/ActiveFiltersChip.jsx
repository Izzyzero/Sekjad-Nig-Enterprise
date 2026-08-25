import { X } from 'lucide-react'
import { useCategories } from '../../hooks/useCategories'

function formatNaira(value) {
  return `₦${Number(value).toLocaleString('en-NG')}`
}

export function ActiveFilterChips({ filters, onRemove, onClearAll }) {
  const { data: categories = [] } = useCategories()
  const chips = []

  if (filters.search) {
    chips.push({ key: 'search', label: `"${filters.search}"` })
  }
  if (filters.category && filters.category !== 'all') {
    const label = categories.find((c) => c.slug === filters.category)?.label ?? filters.category
    chips.push({ key: 'category', label })
  }
  if (filters.minPrice || filters.maxPrice) {
    const min = filters.minPrice ? formatNaira(filters.minPrice) : '₦0'
    const max = filters.maxPrice ? formatNaira(filters.maxPrice) : 'Any'
    chips.push({ key: 'price', label: `${min} - ${max}` })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 px-5 pb-2 sm:px-8">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onRemove(chip.key)}
          className="bg-[#E67E22]/10 text-[#E67E22] flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition hover:bg-[#E67E22]/20"
        >
          {chip.label}
          <X size={12} />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-[#6B7280] hover:text-[#111827] text-xs font-medium underline"
      >
        Clear All
      </button>
    </div>
  )
}

export default ActiveFilterChips
