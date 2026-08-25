import { ChevronLeft, ChevronRight } from 'lucide-react'

function buildPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, total, current, current - 1, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const withEllipsis = []
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) withEllipsis.push('…')
    withEllipsis.push(page)
  })
  return withEllipsis
}

export function ProductPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  const pageList = buildPageList(currentPage, totalPages)

  return (
    <nav aria-label="Product pages" className="mt-12 flex items-center justify-between gap-4 sm:justify-center">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="border-[#E5E7EB] text-[#111827] flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition hover:border-[#E67E22]/50 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <ChevronLeft size={15} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="hidden items-center gap-1.5 sm:flex">
        {pageList.map((page, index) =>
          page === '…' ? (
            <span key={`e-${index}`} className="text-[#6B7280] px-1.5 text-sm">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`flex size-10 items-center justify-center rounded-full text-sm font-medium transition ${
                page === currentPage ? 'bg-[#E67E22] text-white' : 'text-[#6B7280] hover:bg-stone-100'
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <p className="text-[#6B7280] text-sm sm:hidden">
        Page <span className="text-[#111827] font-medium">{currentPage}</span> of {totalPages}
      </p>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="border-[#E5E7EB] text-[#111827] flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition hover:border-[#E67E22]/50 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={15} />
      </button>
    </nav>
  )
}

export default ProductPagination