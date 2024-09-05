import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

// Define the initial state type
interface ProductState {
  data: []
  editData: []
}

// Define the initial state
const initialState: ProductState = {
  data: [],
  editData: []
}

// Create the  Slice
const stockSlice = createSlice({
  name: 'Stock',
  initialState,
  reducers: {
    // Set the entire products data
    setStockData: (state, action: PayloadAction<[]>) => {
      state.data = action.payload
    },

    // Set edit data

    setEditData: (state, action: PayloadAction<[]>) => {
      state.editData = action.payload
    }
  }
})

// Export actions and reducer
export const { setStockData, setEditData } = stockSlice.actions
export default stockSlice.reducer
