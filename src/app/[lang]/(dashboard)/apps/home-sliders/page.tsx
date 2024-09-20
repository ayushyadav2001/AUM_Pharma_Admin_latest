"use client"
/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import axios from 'axios'

import Roles from '@views/apps/roles'

// Data Imports

import Loader from '@/views/Loader/Loader'
import { setRolesData } from '@/redux-store/slices/rolesSlice'
import { setHomeSectionData } from '@/redux-store/slices/homeSlice'
import HomeSectionList from '@/views/apps/homeSection'
import { setHomeSliderData } from '@/redux-store/slices/homeSliderSlice'
import HomeSliderList from '@/views/apps/home-slider'


const RolesApp = () => {


  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const data = useSelector((state: any) => state?.homeSlider?.data)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/home-banners/add-banner`, { withCredentials: true })

        dispatch(setHomeSliderData(response.data.banners)) // Ensure `setData` action is correctly set
      } catch (err) {
        console.error('Failed to fetch products', err) // Log the error for debugging
        setError('Failed to fetch products')
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



  return <HomeSliderList userData={data} />
}

export default RolesApp
