// React Imports
import { useEffect, useState } from 'react'

// import type { ChangeEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// import IconButton from '@mui/material/IconButton'
// import InputAdornment from '@mui/material/InputAdornment'

// Third-party Imports

// Type Imports

// Component Imports

import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'

import axios from 'axios'

// import { yupResolver } from '@hookform/resolvers/yup'

// import { useForm } from 'react-hook-form'

import DirectionalIcon from '@components/DirectionalIcon'
import FileUploaderSingle from '../ProductFileUpload/FileUploaderSingle'

// import createProductSchema from '../add/create-form'
type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
  register: any
  errors: any
  setValue: any
  handleSubmit: any
  onSubmit: any
}

// Vars

const StepPersonalDetails = ({
  activeStep,
  handleNext,
  handlePrev,
  steps,
  register,
  errors,
  setValue,
  handleSubmit,
  onSubmit
}: Props) => {
  const [vendors, setVendors] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])

  // const { productValidationSchema, defaultValues } = createProductSchema

  // const {
  //   register,

  //   setValue,
  //   handleSubmit,
  //   formState: { errors }
  // } = useForm({
  //   resolver: yupResolver(productValidationSchema),
  //   defaultValues
  // })

  // const onSubmit = async (data: any) => {
  //   console.log('data', data)
  // }

  // console.log('errors', errors)

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendor/get-all-vendor`, { withCredentials: true })

      setVendors(response.data.data)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get-category-by-status`, { withCredentials: true })

      setCategory(response.data.categories)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  const fetchSubCategory = async (id: any) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-category/get-sub-category-by-category/${id}`
      )

      setSubCategory(response.data.subCategories)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  useEffect(() => {
    fetchCategory()
    fetchVendors()
  }, [])

  // Vars

  // States

  // const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false)

  // const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth {...register('product_id')} id='outlined-basic' label='Product ID' />
              <FormHelperText className='text-red-600'>{errors.product_id?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth {...register('product_name')} id='outlined-basic' label='Product Name' />
              <FormHelperText className='text-red-600'>{errors.product_name?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth {...register('mrp')} id='outlined-basic' label='MRP' />
              <FormHelperText className='text-red-600'>{errors.mrp?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth {...register('igst')} id='outlined-basic' label='IGST' />
              <FormHelperText className='text-red-600'>{errors.igst?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth {...register('hsn')} id='outlined-basic' label='HSN' />
              <FormHelperText className='text-red-600'>{errors.hsn?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth {...register('manufacturer')} id='outlined-basic' label='Manufacturer' />
              <FormHelperText className='text-red-600'>{errors.manufacturer?.message}</FormHelperText>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth className='mbe-4'>
                <InputLabel id='category-select'>Select Category</InputLabel>
                <Select
                  fullWidth
                  label='Select Category'
                  onChange={(e: any) => {
                    setValue('category', e.target?.value)
                    fetchSubCategory(e.target?.value)
                  }}
                  labelId='category-select'
                >
                  {category?.map((category: any) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText className='text-red-600'>{errors.category?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth className='mbe-4'>
                <InputLabel id='category-select'>Select Sub Category</InputLabel>
                <Select
                  fullWidth
                  defaultValue=''
                  label='Select Category'
                  onChange={(e: any) => {


                    setValue('sub_category', e.target?.value)
                  }}
                  labelId='category-select'
                >
                  {subCategory?.map((category: any) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText className='text-red-600'>{errors.sub_category?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth className='mbe-4'>
                <InputLabel id='vendor-select'>Select Vendor</InputLabel>
                <Select
                  fullWidth
                  defaultValue=''
                  label='Select Vendor'
                  onChange={(e: any) => {


                    setValue('vendor_id', e.target?.value)
                  }}
                  labelId='vendor-select'
                >
                  {vendors?.map((vendor: any) => (
                    <MenuItem key={vendor._id} value={vendor._id}>
                      {vendor.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText className='text-red-600'>{errors.vendor_id?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <InputLabel id='prod-image-select'>Select product image</InputLabel>
              <FormControl fullWidth className='mbe-4'>
                <div id='prod-image-select'>
                  <FileUploaderSingle setValue={setValue} fieldName={'product_image'} />
                </div>

                <FormHelperText className='text-red-600'>{errors.product_image?.message}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <div className='flex items-center justify-between'>
            <Button
              variant='outlined'
              color='secondary'
              disabled={activeStep === 0}
              onClick={handlePrev}
              startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
            >
              Previous
            </Button>
            <Button
              variant='contained'
              type='submit'
              color={activeStep === steps.length - 1 ? 'success' : 'primary'}
              onClick={handleNext}
              endIcon={
                activeStep === steps.length - 1 ? (
                  <i className='ri-check-line' />
                ) : (
                  <DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />
                )
              }
            >
              {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </Grid>
      </Grid>
    </form>
  )
}

export default StepPersonalDetails
