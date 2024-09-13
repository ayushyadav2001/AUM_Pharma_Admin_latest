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
const productFormSlice = createSlice({
  name: 'Packaging Type',
  initialState,
  reducers: {
    // Set the entire products data
    setProductFormData: (state, action: PayloadAction<[]>) => {
      state.data = action.payload
    },

    // Set edit data

    setEditProductFormData: (state, action: PayloadAction<[]>) => {
      state.editData = action.payload
    }
  }
})

// Export actions and reducer
export const { setProductFormData, setEditProductFormData } = productFormSlice.actions
export default productFormSlice.reducer
