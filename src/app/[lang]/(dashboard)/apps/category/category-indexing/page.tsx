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

// import CategoryIndexing from '@/views/apps/category/category-indexing/CategoryIndexing'
import { setCategoryData } from '@/redux-store/slices/categorySlice'
import CategoryIndexing from '@/views/apps/category/category-indexing/CategoryIndexing'


const CategoryIndex = () => {


  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const data = useSelector((state: any) => state?.category?.data)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get-category`, { withCredentials: true })

        dispatch(setCategoryData(response.data.categories))
      } catch (err) {
        console.error('Failed to fetch sub admins', err)
        setError('Failed to fetch Sub Admins')
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [dispatch])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <div>{error}</div>
  }



  return <CategoryIndexing tableData={data} />
}

export default CategoryIndex
