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
const trendingTodaySlice = createSlice({
  name: 'Category',
  initialState,
  reducers: {
    // Set the entire products data
    setTrendingTodayData: (state, action: PayloadAction<[]>) => {
      state.data = action.payload
    },

    // Set edit data

    setEditTrendingTodayData: (state, action: PayloadAction<[]>) => {
      state.editData = action.payload
    }
  }
})

// Export actions and reducer
export const { setTrendingTodayData, setEditTrendingTodayData } = trendingTodaySlice.actions
export default trendingTodaySlice.reducer
