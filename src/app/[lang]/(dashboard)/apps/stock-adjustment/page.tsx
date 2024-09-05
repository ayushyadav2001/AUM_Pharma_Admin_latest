'use client'
/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable react-hooks/exhaustive-deps */

// Component Imports
import { useEffect, useState } from 'react'

import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'



import Loader from '@/views/Loader/Loader'


import StockAdjustmentList from '@/views/apps/stock-adjustment'
import { setStockAdjustmentData } from '@/redux-store/slices/StockAdjustmentSlice'

// import { setData } from '@/redux-store/slices/productSlice'
// import ProductList from '@/views/apps/products'

const UserListApp = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const data = useSelector((state: any) => state?.stockAdjustment?.data)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stock-adjust/get-all-adjustment`, { withCredentials: true })

        dispatch(setStockAdjustmentData(response.data.data)) // Ensure `setData` action is correctly set
      } catch (err) {
        console.error('Failed to fetch products', err) // Log the error for debugging
        setError('Failed to fetch products')
      } finally {
        setLoading(false)
      }
    }

    fetchStocks()
  }, [dispatch])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <div>{error}</div>
  }

  return <StockAdjustmentList userData={data} />
}

export default UserListApp
