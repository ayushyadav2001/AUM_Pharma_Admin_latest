'use client'
/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import axios from 'axios'

import Roles from '@views/apps/roles'

// Data Imports

import Loader from '@/views/Loader/Loader'

import { setUsersData } from '@/redux-store/slices/userSlice'
import Brands from '@/views/apps/brands'
import { setBrandsData } from '@/redux-store/slices/brandsSlice'

const BrandsApp = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const data = useSelector((state: any) => state?.brands?.data)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/brands/get-all-brand`, {
          withCredentials: true
        })

        dispatch(setBrandsData(response.data.brands)) // Ensure `setData` action is correctly set
      } catch (err) {
        console.error('Failed to fetch Brands', err) // Log the error for debugging
        setError('Failed to fetch Sub Admins')
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [dispatch])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <div>{error}</div>
  }

  return <Brands userData={data} />
}

export default BrandsApp
