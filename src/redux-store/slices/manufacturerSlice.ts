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
const manufacturerSlice = createSlice({
  name: 'Manufacturers',
  initialState,
  reducers: {
    // Set the entire products data
    setManufacturersData: (state, action: PayloadAction<[]>) => {
      state.data = action.payload
    },

    // Set edit data

    setManufacturersEditData: (state, action: PayloadAction<[]>) => {
      state.editData = action.payload
    }
  }
})

// Export actions and reducer
export const { setManufacturersData, setManufacturersEditData } = manufacturerSlice.actions
export default manufacturerSlice.reducer
