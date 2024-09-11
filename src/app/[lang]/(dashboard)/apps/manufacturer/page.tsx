"use client"
/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import axios from 'axios'

import Roles from '@views/apps/roles'

// Data Imports

import Loader from '@/views/Loader/Loader'

import Users from '@/views/apps/users'
import { setUsersData } from '@/redux-store/slices/userSlice'
import { setPackagingTypeData } from '@/redux-store/slices/packagingType.Slice'
import PackagingTypes from '@/views/apps/packaging-type'
import Manufacturers from '@/views/apps/manufacturer'
import { setManufacturersData } from '@/redux-store/slices/manufacturerSlice'


const RolesApp = () => {


  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const data = useSelector((state: any) => state?.manufacturers?.data)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchPackagingType = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/manufacturer/get-all-manufacturer`, { withCredentials: true })

        dispatch(setManufacturersData(response.data.data)) // Ensure `setData` action is correctly set
      } catch (err) {
        console.error('Failed to fetch sub manufacturer', err) // Log the error for debugging
        setError('Failed to fetch Sub manufacturer')
      } finally {
        setLoading(false)
      }
    }

    fetchPackagingType()
  }, [dispatch])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <div>{error}</div>
  }



  return <Manufacturers userData={data} />
}

export default RolesApp
