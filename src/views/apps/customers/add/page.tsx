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

import FileUploaderSingle from '../ProductFileUpload/FileUploaderSingle'

// import createProductSchema from './create-form'

import createCustomerSchema from './create-form'
import { setData } from '@/redux-store/slices/customerSlice'

const AddCustomerActions = () => {
  // States
  const router = useRouter()

  const dispatch = useDispatch()
  const { customerValidationSchema, defaultValues } = createCustomerSchema

  const [vendors, setVendors] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [formats, setFormats] = useState([])

  const {
    register,

    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(customerValidationSchema),
    defaultValues
  })

   

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/get-customers`, { withCredentials: true })

      dispatch(setData(response.data.data))
    } catch (err) {
      console.error('Failed to fetch products', err) // Log the error for debugging
    } finally {
    }
  }

  const onSubmit = async (data: any) => {


    const formData = new FormData()

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        formData.append(key, data[key])
      }
    }

    try {
      const response = await axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/add-customer`, data, { withCredentials: true })
        .then(res => {
          toast.success('Customer Added Successfully!')
          fetchVendors()
          router.push('/apps/customers')
        })
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Something went wrong!')
    }
  }

  // Fetch vendors when the component mounts

  const fetchFormats = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/excel/get-all-format`, { withCredentials: true })

      setFormats(response.data.data)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  useEffect(() => {
    fetchFormats()
  }, [])

  return (
    <Card>
      <CardHeader
        title='Add Customer'
        titleTypographyProps={{
          variant: 'h5',
          color: 'primary'
        }}
      />
      <CardContent className='sm:!p-12'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <TextField {...register('firstName')} fullWidth id='outlined-basic' label='First Name' />
              <FormHelperText className='text-red-600'>{errors.firstName?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Last Name' {...register('lastName')} />
              <FormHelperText className='text-red-600'>{errors.lastName?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Email' {...register('email')} />
              <FormHelperText className='text-red-600'>{errors.email?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Mobile Number' {...register('mobileNumber')} />
              <FormHelperText className='text-red-600'>{errors.mobileNumber?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Street' {...register('street')} />
              <FormHelperText className='text-red-600'>{errors.street?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='City' {...register('city')} />
              <FormHelperText className='text-red-600'>{errors.city?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='State' {...register('state')} />
              <FormHelperText className='text-red-600'>{errors.state?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Postal Code' {...register('postalCode')} />
              <FormHelperText className='text-red-600'>{errors.postalCode?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Country' {...register('country')} />
              <FormHelperText className='text-red-600'>{errors.country?.message}</FormHelperText>
            </Grid>
          </Grid>
          <div className='flex justify-end'>
            <Button type='submit' color='primary' variant='contained' className='capitalize'>
              Save
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddCustomerActions
