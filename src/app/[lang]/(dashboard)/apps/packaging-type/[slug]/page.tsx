"use client"
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'





import { useParams } from 'next/navigation'

import { useDispatch, useSelector } from 'react-redux'

import axios from 'axios'


import Loader from '@/views/Loader/Loader'
import { setEditPackagingTypeData } from '@/redux-store/slices/packagingType.Slice'
import EditPackageTypeActions from '@/views/apps/packageType/edit/PackagingTypeAddAction'


const Page = () => {



  const { slug } = useParams()




  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const data = useSelector((state: any) => state?.packagingType?.editData)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchPackaging = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package-type/get-packaging/${slug}`, { withCredentials: true })

        dispatch(setEditPackagingTypeData(response.data.data)) // Ensure `setData` action is correctly set
      } catch (err) {
        console.error('Failed to fetch category', err) // Log the error for debugging
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

  if (error) {
    return <div>{error}</div>
  }


  return (
    <div>
      <EditPackageTypeActions data={data} id={slug} />
    </div>
  )
}

export default Page
