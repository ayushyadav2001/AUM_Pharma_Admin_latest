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
const homeSectionSlice = createSlice({
  name: 'Home Slice',
  initialState,
  reducers: {
    // Set the entire products data
    setHomeSectionData: (state, action: PayloadAction<[]>) => {
      state.data = action.payload
    },

    // Set edit data

    setEditHomeSectionData: (state, action: PayloadAction<[]>) => {
      state.editData = action.payload
    }
  }
})

// Export actions and reducer
export const { setHomeSectionData, setEditHomeSectionData } = homeSectionSlice.actions
export default homeSectionSlice.reducer
