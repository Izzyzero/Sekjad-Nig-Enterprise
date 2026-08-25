// export const wishlistInitialState = { items: [] }
import { createSlice } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [] },
  reducers: {
    toggleWishlistItem: (state, action) => {
      const exists = state.items.find((item) => item.id === action.payload.id)
      if (exists) {
        state.items = state.items.filter((item) => item.id !== action.payload.id)
      } else {
        state.items.push(action.payload)
      }
    },
  },
})

export const { toggleWishlistItem } = wishlistSlice.actions
export default wishlistSlice.reducer