import { useCategories } from '../../hooks/useCategories'

export function CategoryNav({ activeCategory, onSelect }) {
  const { data = [] } = useCategories()
  const categories = [{ id: 'all', slug: 'all', label: 'All Products' }, ...data]

  return (
    <nav aria-label="Product categories" className="border-b border-stone-100">
      <div className="scrollbar-none flex gap-2 overflow-x-auto px-5 py-3 sm:justify-center sm:px-8">
        {categories.map((category) => {
          const isActive = activeCategory === category.slug
          return (
            <button
              key={category.id ?? category.slug}
              type="button"
              onClick={() => onSelect(category.slug)}
              aria-current={isActive ? 'true' : undefined}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#E67E22] text-white'
                  : 'text-[#111827]/60 hover:bg-stone-100 hover:text-[#111827]'
              }`}
            >
              {category.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default CategoryNav
