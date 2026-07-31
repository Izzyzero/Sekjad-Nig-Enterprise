import { createContext, useMemo, useState } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([])
  const value = useMemo(() => ({ items, setItems }), [items])
  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  )
}
