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



import { setHomeSectionData } from '@/redux-store/slices/homeSlice'
import HomSectionIndexing from '@/views/apps/homeSection/homeSectionIndexing/HomeSectionIndexing'


const CategoryIndex = () => {


  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const data = useSelector((state: any) => state?.homeSection?.data)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/home-section/get-all-section`, { withCredentials: true })

        dispatch(setHomeSectionData(response.data.sections))
      } catch (err) {
        console.error('Failed to fetch sections', err)
        setError('Failed to fetch sections')
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



  return <HomSectionIndexing tableData={data} />
}

export default CategoryIndex
