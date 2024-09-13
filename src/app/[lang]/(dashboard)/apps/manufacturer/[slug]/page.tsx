"use client"
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { useDispatch, useSelector } from 'react-redux'

import axios from 'axios'


import Loader from '@/views/Loader/Loader'

import { setManufacturersEditData } from '@/redux-store/slices/manufacturerSlice'
import EditManufacturerActions from '@/views/apps/manufacturer/edit/EditManufacturerAddAction'



const Page = () => {

  const { slug } = useParams()




  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const data = useSelector((state: any) => state?.manufacturers?.editData)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchPackaging = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/manufacturer/get-all-manufacturer/${slug}`, { withCredentials: true })

        dispatch(setManufacturersEditData(response.data.data)) // Ensure `setData` action is correctly set
      } catch (err) {
        console.error('Failed to fetch Manufacturer', err) // Log the error for debugging
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
      <EditManufacturerActions data={data} id={slug} />
    </div>
  )
}

export default Page
