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
import Category from '@/views/apps/category'

import { setSubCategoryData } from '@/redux-store/slices/subCategorySlice'
import SubCategory from '@/views/apps/sub-category'
import SecSubCategory from '@/views/apps/secondarySubCategories'
import { setSecondarySubCategoryData } from '@/redux-store/slices/SecondarySlice'


const RolesApp = () => {


  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const data = useSelector((state: any) => state?.secondarySubCategory?.data)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchSubCategory = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/secondary-sub-category/get-sub-category`, { withCredentials: true })

        dispatch(setSecondarySubCategoryData(response.data.subCategories))
      } catch (err) {
        console.error('Failed to fetch sub categories', err)
        setError('Failed to fetch Sub Admins')
      } finally {
        setLoading(false)
      }
    }

    fetchSubCategory()
  }, [dispatch])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <div>{error}</div>
  }



  return <SecSubCategory userData={data} />
}

export default RolesApp
