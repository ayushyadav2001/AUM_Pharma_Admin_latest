/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { useSelector, useDispatch } from 'react-redux'

import axios from 'axios'

import Loader from '@/views/Loader/Loader'

import { setEditTrendingTodayData } from '@/redux-store/slices/trendingTodaySlice'
import EditTrendingToday from '@/views/apps/trending-today/edit/EditTrendingToday'

const Page = () => {
  const { slug } = useParams()

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const data = useSelector((state: any) => state?.trendingToday?.editData)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/trending-today/get-trending-banner/${slug}`,
          {
            withCredentials: true
          }
        )

        dispatch(setEditTrendingTodayData(response.data.data)) // Ensure `setData` action is correctly set
      } catch (err) {
        console.error('Failed to fetch category', err) // Log the error for debugging
        setError('Failed to fetch category')
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

  return (
    <div>
      <EditTrendingToday data={data} id={slug} />
    </div>
  )
}

export default Page
