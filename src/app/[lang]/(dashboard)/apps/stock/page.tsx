'use client'
/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable react-hooks/exhaustive-deps */

// Component Imports
import { useEffect, useState } from 'react'

import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'



import Loader from '@/views/Loader/Loader'
import StockList from '@/views/apps/stock'
import { setStockData } from '@/redux-store/slices/StockSlice'

// import { setData } from '@/redux-store/slices/productSlice'
// import ProductList from '@/views/apps/products'

const UserListApp = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const stockData = useSelector((state: any) => state?.stock?.data)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stock/get-all`, { withCredentials: true })

        dispatch(setStockData(response.data.data)) // Ensure `setData` action is correctly set
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

  return <StockList userData={stockData} />
}

export default UserListApp
