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
const subCategorySlice = createSlice({
  name: 'Sub Category',
  initialState,
  reducers: {
    // Set the entire products data
    setSubCategoryData: (state, action: PayloadAction<[]>) => {
      state.data = action.payload
    },

    // Set edit data

    setEditSubCategoryData: (state, action: PayloadAction<[]>) => {
      state.editData = action.payload
    }
  }
})

// Export actions and reducer
export const { setSubCategoryData, setEditSubCategoryData } = subCategorySlice.actions
export default subCategorySlice.reducer
