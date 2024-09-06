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


const RolesApp = () => {


  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const data = useSelector((state: any) => state?.users?.data)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-admin/get-sub-admin`, { withCredentials: true })

        dispatch(setUsersData(response.data.subAdmins)) // Ensure `setData` action is correctly set
      } catch (err) {
        console.error('Failed to fetch sub admins', err) // Log the error for debugging
        setError('Failed to fetch Sub Admins')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [dispatch])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <div>{error}</div>
  }



  return <Users userData={data} />
}

export default RolesApp
