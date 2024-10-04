/* eslint-disable react-hooks/exhaustive-deps */
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
  Checkbox,
  FormControl,
  FormControlLabel,
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

import FileUploaderSingle from '../../customers/ProductFileUpload/FileUploaderSingle'
import { setUsersData } from '@/redux-store/slices/userSlice'
import { setCategoryData } from '@/redux-store/slices/categorySlice'
import createBrandsSchema from './create-form'
import { setBrandsData } from '@/redux-store/slices/brandsSlice'

const EditTrendingToday = ({ data, id }: { data?: any; id?: any }) => {
  // States
  const router = useRouter()

  const dispatch = useDispatch()
  const { brandsValidationSchema, defaultValues } = createBrandsSchema

  const {
    register,

    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver<any>(brandsValidationSchema),
    defaultValues
  })

  useEffect(() => {
    setValue('title', data.title)
    setValue('link', data.link)
  }, [])

  const fetchBrands = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}//trending-today/get-all-trending-banner`,
        {
          withCredentials: true
        }
      )

      dispatch(setBrandsData(response.data.data))
    } catch (err) {
      console.error('Failed to fetch Banners', err) // Log the error for debugging
    }
  }

  const onSubmit = async (data: any) => {
    try {
      // Create FormData instance
      const formData = new FormData()

      // Loop through data and append it to FormData
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          if (key === 'banner' && data[key] instanceof File) {
            // If the key is 'image' and is a File, append it as a file
            formData.append(key, data[key])
          } else {
            // Append other data normally
            formData.append(key, data[key])
          }
        }
      }

      // POST request using axios
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/trending-today/update-trending-banner/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data' // Important for file uploads
          }
        }
      )

      // Handle success response
      if (response.status === 200) {
        toast.success(`Banner Updated Successfully! Message: ${response.data.message}`)
        fetchBrands() // Fetch updated brands list
        router.push('/apps/trending-today') // Redirect to the brands page
      }
    } catch (error: any) {
      // Handle error responses
      console.error('Error adding brand:', error)

      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Error: ${error.response.data.message}`)
      } else {
        toast.error('Something went wrong!')
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title='Add Brand'
        titleTypographyProps={{
          variant: 'h5',
          color: 'primary'
        }}
      />
      <CardContent className='sm:!p-12'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={12}>
              <TextField {...register('title')} fullWidth id='outlined-basic' label='Title' />
              <FormHelperText className='text-red-600'>{errors.title?.message as string}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField {...register('link')} fullWidth id='outlined-basic' label='Link' />
              <FormHelperText className='text-red-600'>{errors.link?.message as string}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={12}>
              <InputLabel id='prod-image-select'>Select Banner</InputLabel>
              <FormControl fullWidth className='mbe-4'>
                <div id='prod-image-select'>
                  <FileUploaderSingle setValue={setValue} fieldName={'banner'} />
                </div>

                <FormHelperText className='text-red-600'>{errors.banner?.message as string}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <div className='flex justify-end'>
            <Button type='submit' color='primary' variant='contained' className='capitalize'>
              Update
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default EditTrendingToday
