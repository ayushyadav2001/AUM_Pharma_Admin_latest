/* eslint-disable react-hooks/exhaustive-deps */
"use client"



import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux'

import Loader from '@/views/Loader/Loader'


import { setEditStockAdjustmentData, setStockActivityTableData, setStockAdjustmentTableData } from '@/redux-store/slices/StockAdjustmentSlice'
import ViewStockAdjustmentActions from '@/views/apps/stock-adjustment/view/page'




const StockAdjustmentView = () => {

  const { id } = useParams()




  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const data = useSelector((state: any) => state?.stockAdjustment?.editData)

  const dispatch = useDispatch()

  const fetchStockAdjustment = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stock-adjust/get-adjustment/${id}`, { withCredentials: true })

      dispatch(setEditStockAdjustmentData(response.data.data)) // Ensure `setData` action is correctly set
      dispatch(setStockAdjustmentTableData(response.data.productDetails)) // Ensure `setData` action is correctly set
      dispatch(setStockActivityTableData(response.data.data.adjustmentHistory)) // Ensure `setData` action is correctly set
    } catch (err) {
      console.error('Failed to fetch products', err) // Log the error for debugging
      setError('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {


    fetchStockAdjustment()
  }, [dispatch])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <div>{error}</div>
  }

  return <ViewStockAdjustmentActions stockData={data} />
}

export default StockAdjustmentView
