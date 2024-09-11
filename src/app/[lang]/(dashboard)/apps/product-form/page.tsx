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
import { setProductFormData } from '@/redux-store/slices/prductFormSlice'
import ProductForms from '@/views/apps/product-form'


const RolesApp = () => {


  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const data = useSelector((state: any) => state?.productForm?.data)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchPackagingType = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product-form/get-all-product-form`, { withCredentials: true })

        dispatch(setProductFormData(response.data.data)) // Ensure `setData` action is correctly set
      } catch (err) {
        console.error('Failed to fetch sub admins', err) // Log the error for debugging
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



  return <ProductForms userData={data} />
}

export default RolesApp
