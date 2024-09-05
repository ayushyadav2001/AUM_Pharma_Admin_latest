// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import chatReducer from '@/redux-store/slices/chat'
import calendarReducer from '@/redux-store/slices/calendar'
import kanbanReducer from '@/redux-store/slices/kanban'
import emailReducer from '@/redux-store/slices/email'
import productReducer from '@/redux-store/slices/productSlice'

import vendorReducer from '@/redux-store/slices/vendorSlice'

import customerReducer from '@/redux-store/slices/customerSlice'

import purchaseOrderSlice from '@/redux-store/slices/purchaseOrderSlice'

import invoiceSlice from '@/redux-store/slices/invoicePreviewSlice'
import StockSlice from './slices/StockSlice'
import StockAdjustmentSlice from './slices/StockAdjustmentSlice'

export const store = configureStore({
  reducer: {
    chatReducer,
    calendarReducer,
    kanbanReducer,
    emailReducer,
    products: productReducer,
    vendor: vendorReducer,
    customer: customerReducer,
    purchaseOrders: purchaseOrderSlice,
    invoice: invoiceSlice,
    stock: StockSlice,
    stockAdjustment: StockAdjustmentSlice
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
