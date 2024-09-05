import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

// Define the initial state type
interface ProductState {
  data: []
  editData: []
  stockedJustData: []
  activityData: []
}

// Define the initial state
const initialState: ProductState = {
  data: [],
  editData: [],
  stockedJustData: [],
  activityData: []
}

// Create the  Slice
const stockAdjustmentSlice = createSlice({
  name: 'Stock Adjustment',
  initialState,
  reducers: {
    // Set the entire products data
    setStockAdjustmentData: (state, action: PayloadAction<[]>) => {
      state.data = action.payload
    },

    // Set edit data

    setEditStockAdjustmentData: (state, action: PayloadAction<[]>) => {
      state.editData = action.payload
    },
    setStockAdjustmentTableData: (state, action: PayloadAction<[]>) => {
      state.stockedJustData = action.payload
    },
    setStockActivityTableData: (state, action: PayloadAction<[]>) => {
      state.activityData = action.payload
    }
  }
})

// Export actions and reducer
export const {
  setStockAdjustmentData,
  setEditStockAdjustmentData,
  setStockAdjustmentTableData,
  setStockActivityTableData
} = stockAdjustmentSlice.actions
export default stockAdjustmentSlice.reducer
