/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useEffect, useState } from 'react'



import { useParams } from 'next/navigation'

import { useSelector, useDispatch } from 'react-redux'

import axios from 'axios'


import Loader from '@/views/Loader/Loader'


import { setEditSubCategoryData } from '@/redux-store/slices/subCategorySlice'
import EditSubCategoryActions from '@/views/apps/sub-category/edit/EdiAction'


const Page = () => {




  const { slug } = useParams()




  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const data = useSelector((state: any) => state?.subCategory?.editData)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-category/get-sub-category/${slug}`, { withCredentials: true })

        dispatch(setEditSubCategoryData(response.data.subCategory)) // Ensure `setData` action is correctly set
      } catch (err) {
        console.error('Failed to fetch category', err) // Log the error for debugging
        setError('Failed to fetch category')
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



  return (
    <div>
      <EditSubCategoryActions data={data} id={slug} />
    </div>
  )
}

export default Page
