import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', onConfirm, onCancel, loading }) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => e.key === 'Escape' && onCancel()
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-5">
      <div aria-hidden="true" onClick={onCancel} className="absolute inset-0 bg-black/50" />
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="relative w-full max-w-sm rounded-2xl bg-white p-6">
        <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-red-50 text-red-500">
          <AlertTriangle size={20} />
        </div>
        <h3 id="confirm-title" className="text-[#111827] mb-1.5 text-lg font-semibold">{title}</h3>
        <p className="text-[#6B7280] mb-6 text-sm leading-relaxed">{description}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="border-[#E5E7EB] text-[#111827] flex-1 rounded-full border py-2.5 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog