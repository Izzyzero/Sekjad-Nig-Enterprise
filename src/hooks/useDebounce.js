// import { useEffect, useState } from 'react'

// export function useDebounce(value, delay = 300) {
//   const [debouncedValue, setDebouncedValue] = useState(value)
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedValue(value), delay)
//     return () => clearTimeout(timer)
//   }, [value, delay])
//   return debouncedValue
// }
import { useEffect, useState } from 'react'

export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}