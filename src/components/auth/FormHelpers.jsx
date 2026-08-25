export const FIELD_BASE =
  'w-full rounded-lg border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-orange/60'

/* eslint-disable react-refresh/only-export-components */
export function fieldClass(hasError, extra = '') {
  return `${FIELD_BASE} ${hasError ? 'border-red-400' : 'border-stone-300'} ${extra}`
}

export function FieldError({ message, center = false }) {
  if (!message) return null
  return <p className={`mt-1.5 text-xs text-red-500 ${center ? 'text-center' : ''}`}>{message}</p>
}
