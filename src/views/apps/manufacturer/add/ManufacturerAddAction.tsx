/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

// React Imports
import { useEffect, useState } from 'react'

// import { useRouter } from 'next/router'

import { useRouter } from 'next/navigation'

import { useDispatch } from 'react-redux'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'

// MUI Imports
// Third-party Imports

// import type { Theme } from '@mui/material/styles'

// Third-party Imports
// import type { SubmitHandler } from 'react-hook-form'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import axios from 'axios'

import { toast } from 'react-toastify'



// import createProductSchema from './create-form'


import { setData } from '@/redux-store/slices/customerSlice'
import createUserSchema from './create-form'
import FileUploaderSingle from '../../customers/ProductFileUpload/FileUploaderSingle'
import { setUsersData } from '@/redux-store/slices/userSlice'
import { setPackagingTypeData } from '@/redux-store/slices/packagingType.Slice'
import { setManufacturersData } from '@/redux-store/slices/manufacturerSlice'

const ManufacturerActions = () => {
  // States
  const router = useRouter()

  const dispatch = useDispatch()
  const { userValidationSchema, defaultValues } = createUserSchema




  const {
    register,

    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(userValidationSchema),
    defaultValues
  })



  const fetchLatestData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/manufacturer/get-all-manufacturer`, { withCredentials: true })

      dispatch(setManufacturersData(response.data.data)) // Ensure `setData` action is correctly set
    } catch (err) {
      console.error('Failed to fetch sub admins', err) // Log the error for debugging

    }
  }


  const onSubmit = async (data: any) => {








    try {
      const response = await axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/manufacturer/add-manufacturer`, data, { withCredentials: true })
        .then(res => {
          toast.success('Manufacturer Added Successfully!')
          fetchLatestData()
          router.push('/apps/manufacturer')
        })
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Something went wrong!')
    }
  }

  // Fetch vendors when the component mounts



  return (
    <Card>
      <CardHeader
        title='Add Manufacturer'
        titleTypographyProps={{
          variant: 'h5',
          color: 'primary'
        }}
      />
      <CardContent className='sm:!p-12'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6} className=' '>

            <Grid item xs={12} md={6}>
              <TextField
                error={!!errors.name} // `error` expects a boolean
                helperText={errors.name?.message?.toString() || ''}
                {...register('name')} fullWidth id='outlined-basic' label='Manufacturer Name' />

            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="number"
                error={!!errors.mobileNumber} // `error` expects a boolean
                helperText={errors.mobileNumber?.message?.toString() || ''}
                {...register('mobileNumber')} fullWidth id='outlined-basic' label='Mobile Number' />

            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="text"
                error={!!errors.address} // `error` expects a boolean
                helperText={errors.address?.message?.toString() || ''}
                {...register('address')} fullWidth id='outlined-basic' label='Address' />

            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                type="text"
                error={!!errors.postal_code} // `error` expects a boolean
                helperText={errors.postal_code?.message?.toString() || ''}
                {...register('postal_code')} fullWidth id='outlined-basic' label='Postal Code' />

            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                type="text"
                error={!!errors.city} // `error` expects a boolean
                helperText={errors.city?.message?.toString() || ''}
                {...register('city')} fullWidth id='outlined-basic' label='City' />

            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                type="text"
                error={!!errors.state} // `error` expects a boolean
                helperText={errors.state?.message?.toString() || ''}
                {...register('state')} fullWidth id='outlined-basic' label='State' />

            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                type="text"
                error={!!errors.country} // `error` expects a boolean
                helperText={errors.country?.message?.toString() || ''}
                {...register('country')} fullWidth id='outlined-basic' label='Country' />

            </Grid>









          </Grid>
          <div className='flex justify-center mt-4'>
            <Button type='submit' color='primary' variant='contained' className='capitalize'>
              Save
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ManufacturerActions
