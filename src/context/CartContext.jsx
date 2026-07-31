import { createContext, useMemo, useState } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const value = useMemo(() => ({ items, setItems }), [items])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
