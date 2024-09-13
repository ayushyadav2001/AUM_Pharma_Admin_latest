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

const EditManufacturerActions = ({ data, id }: { data?: any, id?: any }) => {
  // States
  const router = useRouter()

  const dispatch = useDispatch()
  const { userValidationSchema, defaultValues } = createUserSchema




  const {
    register,

    setValue,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(userValidationSchema),
    defaultValues: {
      name: data.name,
      address: data?.address,
      city: data?.city,
      state: data?.state,
      postal_code: data?.postal_code,
      country: data?.country
    }
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
        .put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/manufacturer/update-manufacturer/${id}`, data, { withCredentials: true })
        .then(res => {
          toast.success('Manufacturer Updated Successfully!')
          fetchLatestData()
          router.push('/apps/manufacturer')
        })
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Something went wrong!')
    }
  }

  // Fetch vendors when the component mounts

  useEffect(() => {
    if (data) {
      reset({
        name: data?.name || "",
        address: data?.address || "",
        city: data?.city || "",
        state: data?.state || "",
        postal_code: data?.postal_code || "",
        country: data?.country || ""
      });
    }
  }, [data, reset]);

  return (
    <Card>
      <CardHeader
        title='Edit Manufacturer'
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
                InputLabelProps={{
                  shrink: !!data?.name
                }} defaultValue={data?.name}
                {...register('name')} fullWidth id='outlined-basic' label='Manufacturer Name' />

            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                InputLabelProps={{
                  shrink: !!data?.address
                }} defaultValue={data?.address}
                type="text"
                error={!!errors.address} // `error` expects a boolean
                helperText={errors.address?.message?.toString() || ''}
                {...register('address')} fullWidth id='outlined-basic' label='Address' />

            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                type="number"
                InputLabelProps={{
                  shrink: !!data?.postal_code
                }} defaultValue={data?.postal_code}
                error={!!errors.postal_code} // `error` expects a boolean
                helperText={errors.postal_code?.message?.toString() || ''}
                {...register('postal_code')} fullWidth id='outlined-basic' label='Postal Code' />

            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                InputLabelProps={{
                  shrink: !!data?.city
                }} defaultValue={data?.city}
                type="text"
                error={!!errors.city} // `error` expects a boolean
                helperText={errors.city?.message?.toString() || ''}
                {...register('city')} fullWidth id='outlined-basic' label='City' />

            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                InputLabelProps={{
                  shrink: !!data?.state
                }} defaultValue={data?.state}
                type="text"
                error={!!errors.state} // `error` expects a boolean
                helperText={errors.state?.message?.toString() || ''}
                {...register('state')} fullWidth id='outlined-basic' label='State' />

            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                type="text"
                InputLabelProps={{
                  shrink: !!data?.country
                }} defaultValue={data?.country}
                error={!!errors.country} // `error` expects a boolean
                helperText={errors.country?.message?.toString() || ''}
                {...register('country')} fullWidth id='outlined-basic' label='Country' />

            </Grid>









          </Grid>
          <div className='flex justify-center mt-4'>
            <Button type='submit' color='primary' variant='contained' className='capitalize'>
              Update
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default EditManufacturerActions
