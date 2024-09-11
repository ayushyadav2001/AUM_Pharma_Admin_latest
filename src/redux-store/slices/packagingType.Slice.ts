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
const packagingTypeSlice = createSlice({
  name: 'Packaging Type',
  initialState,
  reducers: {
    // Set the entire products data
    setPackagingTypeData: (state, action: PayloadAction<[]>) => {
      state.data = action.payload
    },

    // Set edit data

    setEditPackagingTypeData: (state, action: PayloadAction<[]>) => {
      state.editData = action.payload
    }
  }
})

// Export actions and reducer
export const { setPackagingTypeData, setEditPackagingTypeData } = packagingTypeSlice.actions
export default packagingTypeSlice.reducer
