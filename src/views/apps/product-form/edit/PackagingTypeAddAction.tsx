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
import { setProductFormData } from '@/redux-store/slices/prductFormSlice'

const EditProductFormActions = ({ data, id }: { data?: any, id?: any }) => {
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
    defaultValues: {
      name: data?.name
    }
  })



  const fetchPackagingType = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product-form/get-all-product-form`, { withCredentials: true })

      dispatch(setProductFormData(response.data.data)) // Ensure `setData` action is correctly set
    } catch (err) {
      console.error('Failed to fetch product-form', err) // Log the error for debugging

    } finally {

    }
  }


  const onSubmit = async (data: any) => {

    try {
      const response = await axios
        .put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product-form/update-product-form/${id}`, data, { withCredentials: true })
        .then(res => {
          toast.success('Product Form Updated Successfully!')
          fetchPackagingType()
          router.push('/apps/product-form')
        })
    } catch (error) {
      console.error('Error adding product-form:', error)
      toast.error('Something went wrong!')
    }
  }

  // Fetch vendors when the component mounts



  return (
    <Card>
      <CardHeader
        title='Edit Product Form'
        titleTypographyProps={{
          variant: 'h5',
          color: 'primary'
        }}
      />
      <CardContent className='sm:!p-12'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6} className='flex justify-center mb-4'>

            <Grid item xs={12} md={6}>
              <TextField

                defaultValue={data?.name}

                error={!!errors.name} // `error` expects a boolean
                helperText={errors.name?.message?.toString() || ''}
                {...register('name')} fullWidth id='outlined-basic' label='Product Form' placeholder='Enter your product Form' />

            </Grid>









          </Grid>
          <div className='flex justify-center'>
            <Button type='submit' color='primary' variant='contained' className='capitalize'>
              Update
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default EditProductFormActions
