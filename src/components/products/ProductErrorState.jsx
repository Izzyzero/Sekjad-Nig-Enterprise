export function ProductErrorState({ onRetry }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50/50 px-8 py-20 text-center">
      <p className="font-display text-ink mb-2 text-xl">Something went wrong.</p>
      <p className="text-ink/50 mb-6 text-sm">
        We couldn&apos;t load our collection right now. Please try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="bg-[#E67E22] rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d4711f]"
      >
        Try Again
      </button>
    </div>
  )
}

export default ProductErrorState