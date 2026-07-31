import { useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : initialValue
  })

  const updateValue = (nextValue) => {
    setValue(nextValue)
    localStorage.setItem(key, JSON.stringify(nextValue))
  }

  return [value, updateValue]
}
