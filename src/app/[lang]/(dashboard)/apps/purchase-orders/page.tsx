'use client'
/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable react-hooks/exhaustive-deps */

// Component Imports
import { useEffect, useState } from 'react'

import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'



import Loader from '@/views/Loader/Loader'
import PurchaseOrderList from '@/views/apps/purchase-orders'
import { setData } from '@/redux-store/slices/purchaseOrderSlice'

const UserListApp = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const purchaseOrders = useSelector((state: any) => state?.purchaseOrders?.data)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/purchase-orders/get-all-order`, { withCredentials: true })

        dispatch(setData(response.data.data)) // Ensure `setData` action is correctly set
      } catch (err) {
        console.error('Failed to fetch products', err) // Log the error for debugging
        setError('Failed to fetch products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [dispatch])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <div>{error}</div>
  }

  return <PurchaseOrderList userData={purchaseOrders} />
}

export default UserListApp
