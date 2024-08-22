
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
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Set the entire products data
    setData: (state, action: PayloadAction<[]>) => {
      state.data = action.payload
    },
    setProductData: (state, action: PayloadAction<[]>) => {
      state.data = action.payload
    },

    // Set edit data

    setEditData: (state, action: PayloadAction<[]>) => {
      state.editData = action.payload
    }
  }
})

// Export actions and reducer
export const { setData, setEditData, setProductData } = productSlice.actions
export default productSlice.reducer
