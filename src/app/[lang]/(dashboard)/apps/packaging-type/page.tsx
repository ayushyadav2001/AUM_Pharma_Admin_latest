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

import PackageTypes from '@/views/apps/packageType'


const RolesApp = () => {


  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const data = useSelector((state: any) => state?.packagingType?.data)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchPackagingType = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package-type/get-all-packaging`, { withCredentials: true })

        dispatch(setPackagingTypeData(response.data.data)) // Ensure `setData` action is correctly set
      } catch (err) {
        console.error('Failed to fetch Packing type', err) // Log the error for debugging
        setError('Failed to fetch Sub Admins')
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



  return <PackageTypes userData={data} />
}

export default RolesApp
