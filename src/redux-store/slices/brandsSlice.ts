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
const brandsSlice = createSlice({
  name: 'Brands',
  initialState,
  reducers: {
    // Set the entire products data
    setBrandsData: (state, action: PayloadAction<[]>) => {
      state.data = action.payload
    },

    // Set edit data

    setEditBrandsData: (state, action: PayloadAction<[]>) => {
      state.editData = action.payload
    }
  }
})

// Export actions and reducer
export const { setBrandsData, setEditBrandsData } = brandsSlice.actions
export default brandsSlice.reducer
