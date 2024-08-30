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
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
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

import createProductSchema from './create-form'
import { setData } from '@/redux-store/slices/vendorSlice'

const AddVendorActions = () => {
  // States
  const router = useRouter()

  const dispatch = useDispatch()
  const { supplierValidationSchema, defaultValues } = createProductSchema

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
    resolver: yupResolver(supplierValidationSchema),
    defaultValues
  })

  console.log('errors', errors)

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendor/get-all-vendor`, { withCredentials: true })

      dispatch(setData(response.data.data))
    } catch (err) {
      console.error('Failed to fetch products', err) // Log the error for debugging
    } finally {
    }
  }

  const onSubmit = async (data: any) => {
    console.log(data)

    const formData = new FormData()

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        formData.append(key, data[key])
      }
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendor/add-vendor`, data, { withCredentials: true, }).then(res => {
        toast.success('Vendor Added Successfully!')
        fetchVendors()
        router.push('/apps/vendors')
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
        title='Add Vendor'
        titleTypographyProps={{
          variant: 'h5',
          color: 'primary'
        }}
      />
      <Divider />
      <CardContent className='sm:!p-12'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            {/* Basic Details */}
            <Grid item xs={12}>
              <Typography variant='body2' className='font-medium' color='text.primary'>
                1. Basic Details
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField {...register('name')} fullWidth id='outlined-basic' label='Vendor Name' />
              <FormHelperText className='text-red-600'>{errors.name?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' type='number'
                placeholder='123-456-7890' label='Phone Number' {...register('phoneNumber')} />
              <FormHelperText className='text-red-600'>{errors.phoneNumber?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Email' {...register('email')} />
              <FormHelperText className='text-red-600'>{errors.email?.message}</FormHelperText>
            </Grid>


            {/* Address Details */}
            <Grid item xs={12}>
              <Typography variant='body2' className='font-medium' color='text.primary'>
                2. Address Details
              </Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField fullWidth id='outlined-basic'
                multiline
                minRows={2} label='Address' {...register('addressLine')} />
              <FormHelperText className='text-red-600'>{errors.addressLine?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='State' {...register('state')} />
              <FormHelperText className='text-red-600'>{errors.state?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='City' {...register('city')} />
              <FormHelperText className='text-red-600'>{errors.city?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' type='number' label='Pin Code' {...register('pinCode')} />
              <FormHelperText className='text-red-600'>{errors.pinCode?.message}</FormHelperText>
            </Grid>

            {/* Identification and Licenses */}
            <Grid item xs={12}>
              <Typography variant='body2' className='font-medium' color='text.primary'>
                3. Identification and Licenses
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' type='text' label='GST Number' {...register('gstNumber')} />
              <FormHelperText className='text-red-600'>{errors.gstNumber?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' type='text' label='PAN Number' {...register('panNumber')} />
              <FormHelperText className='text-red-600'>{errors.panNumber?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='DL Number' {...register('dlNumber')} />
              <FormHelperText className='text-red-600'>{errors.dlNumber?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Food License Number' {...register('foodLicenseNumber')} />
              <FormHelperText className='text-red-600'>{errors.foodLicenseNumber?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='MSME Number' {...register('msmeNumber')} />
              <FormHelperText className='text-red-600'>{errors.msmeNumber?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='FSS Number' {...register('fssNumber')} />
              <FormHelperText className='text-red-600'>{errors.fssNumber?.message}</FormHelperText>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant='body2' className='font-medium' color='text.primary'>
                4. Contact Person Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Name' {...register('contactPersonName')} />
              <FormHelperText className='text-red-600'>{errors.contactPersonName?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' type='number'
                placeholder='123-456-7890' label='Mobile Number' {...register('contactPersonMobileNumber')} />
              <FormHelperText className='text-red-600'>{errors.contactPersonMobileNumber?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' type='number'
                placeholder='123-456-7890' label='Phone Number' {...register('contactPersonPhoneNumber')} />
              <FormHelperText className='text-red-600'>{errors.contactPersonPhoneNumber?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' className='font-medium' color='text.primary'>
                5. Assign Excel Format
              </Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl fullWidth className='mbe-4'>
                <InputLabel id='format-select'>Select Format</InputLabel>
                <Select
                  fullWidth
                  label='Select Format'
                  {...register('format')}
                  onChange={(e: any) => setValue('format', e.target?.value)}
                  labelId='format-select'
                >
                  {formats?.map((category: any) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.formatName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText className='text-red-600'>{errors.format?.message}</FormHelperText>
              </FormControl>
            </Grid>
            {/* Financials */}
            <Grid item xs={12}>
              <Typography variant='body2' className='font-medium' color='text.primary'>
                6. Financials
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Payable' {...register('payable')} />
              <FormHelperText className='text-red-600'>{errors.payable?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Due' {...register('due')} />
              <FormHelperText className='text-red-600'>{errors.due?.message}</FormHelperText>
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

export default AddVendorActions
