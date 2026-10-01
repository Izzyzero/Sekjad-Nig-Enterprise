export function ProductTags({ tags, className = '' }) {
  const values = (Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',') : [])
    .map((tag) => String(tag ?? '').trim())
    .filter(Boolean)

  if (values.length === 0) return null

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`} aria-label="Product tags">
      {values.map((tag, index) => (
        <span key={`${tag}-${index}`} className="rounded-full bg-[#E67E22] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white shadow-sm">
          {tag}
        </span>
      ))}
    </div>
  )
}
