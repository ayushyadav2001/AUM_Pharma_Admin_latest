"use client"
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'





import { useParams } from 'next/navigation'

import { useDispatch, useSelector } from 'react-redux'

import axios from 'axios'


import Loader from '@/views/Loader/Loader'

import { setEditProductFormData } from '@/redux-store/slices/prductFormSlice'
import EditProductFormActions from '@/views/apps/product-form/edit/PackagingTypeAddAction'


const Page = () => {



  const { slug } = useParams()




  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const data = useSelector((state: any) => state?.productForm?.editData)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchPackaging = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product-form/get-product-form/${slug}`, { withCredentials: true })


        dispatch(setEditProductFormData(response.data.productForm)) // Ensure `setData` action is correctly set
      } catch (err) {
        console.error('Failed to fetch Product Form', err) // Log the error for debugging
        setError('Failed to fetch category')
      } finally {
        setLoading(false)
      }
    }


    fetchPackaging()
  }, [dispatch])

  if (loading) {
    return <Loader />
  }

  console.log("data", data)

  if (error) {
    return <div>{error}</div>
  }


  return (
    <div>
      <EditProductFormActions data={data} id={slug} />
    </div>
  )
}

export default Page
