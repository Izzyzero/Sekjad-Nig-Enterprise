// export const cartInitialState = { items: [] }
import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find((item) => item.id === action.payload.id)
      if (existing) {
        existing.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
    },
    updateCartQuantity: (state, action) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload.id)
      if (item) item.quantity = Math.max(1, action.payload.quantity)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, updateCartQuantity, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
