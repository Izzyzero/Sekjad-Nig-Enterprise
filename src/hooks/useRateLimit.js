import { useEffect, useState } from 'react'

export function useRateLimit() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (seconds <= 0) return undefined
    const timer = window.setTimeout(() => setSeconds((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearTimeout(timer)
  }, [seconds])

  return { rateLimitSeconds: seconds, startRateLimit: setSeconds }
}
