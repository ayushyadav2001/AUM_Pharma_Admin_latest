/* eslint-disable react-hooks/exhaustive-deps */
"use client"

// Data Imports

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { useDispatch, useSelector } from 'react-redux'

import axios from 'axios'


import Loader from '@/views/Loader/Loader'

import { setEditData } from '@/redux-store/slices/purchaseOrderSlice'
import ViewPurchaseOrdersActions from '@/views/apps/purchase-orders/view/page'




const ProductViewApp = () => {
  const { id } = useParams()




  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const purchaseOrder = useSelector((state: any) => state?.purchaseOrders?.editData)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/purchase-orders/get-purchase-order/${id}`, { withCredentials: true })

        dispatch(setEditData(response.data.data)) // Ensure `setData` action is correctly set
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

  return <ViewPurchaseOrdersActions tableData={purchaseOrder} />
}

export default ProductViewApp
