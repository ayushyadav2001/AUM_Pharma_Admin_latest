/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-async-client-component */
"use client"

// Next Imports
import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

// Type Imports
import { useDispatch, useSelector } from 'react-redux'

import axios from 'axios'



// Component Imports



import PreviewInvoice from '@/views/apps/purchase-orders/view-invoice/page'
import Loader from '@/views/Loader/Loader'

import { setInvoiceData } from '@/redux-store/slices/invoicePreviewSlice'


const PreviewInvoicePage = ({ params }: { params: { id: string } }) => {
  // Vars
  const { id } = useParams()




  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const invoiceData = useSelector((state: any) => state?.invoice?.data)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/purchase-orders/get-purchase-order/${id}`, { withCredentials: true })

        dispatch(setInvoiceData(response.data.data)) // Ensure `setData` action is correctly set
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


  return invoiceData ? <PreviewInvoice invoiceData={invoiceData} id={params.id} /> : null
}

export default PreviewInvoicePage
