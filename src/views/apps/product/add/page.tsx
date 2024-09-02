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

import createProductSchema from './create-form'
import { setData } from '@/redux-store/slices/productSlice'

const AddProductActions = () => {
  // States
  const router = useRouter()

  const dispatch = useDispatch()
  const { productValidationSchema, defaultValues } = createProductSchema

  const [vendors, setVendors] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])

  const {
    register,

    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(productValidationSchema),
    defaultValues
  })

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get-all-product`, { withCredentials: true })

      dispatch(setData(response.data.products)) // Ensure `setData` action is correctly set
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
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/add-product`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true,
        })
        .then(res => {
          toast.success('Product Added Successfully!')
          fetchProducts()
          router.push('/apps/products')
        })
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Something went wrong!')
    }
  }

  // Fetch vendors when the component mounts

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
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get-category`, { withCredentials: true })

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

  return (
    <Card>
      <CardHeader
        title='Add Product'
        titleTypographyProps={{
          variant: 'h5',
          color: 'primary'
        }}
      />
      <CardContent className='sm:!p-12'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth className='mbe-4'>
                <InputLabel id='category-select'>Select Category</InputLabel>
                <Select
                  fullWidth
                  label='Select Category'
                  {...register('category')}
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
                  label='Select Category'
                  {...register('category')}
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
            <Grid item xs={12} md={4}>
              <TextField {...register('product_id')} fullWidth id='outlined-basic' label='Product ID' />
              <FormHelperText className='text-red-600'>{errors.product_id?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Product Name' {...register('product_name')} />
              <FormHelperText className='text-red-600'>{errors.product_name?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='MRP' {...register('mrp')} />
              <FormHelperText className='text-red-600'>{errors.mrp?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='IGST' {...register('igst')} />
              <FormHelperText className='text-red-600'>{errors.igst?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='HSN' {...register('hsn')} />
              <FormHelperText className='text-red-600'>{errors.hsn?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Manufacturer' {...register('manufacturer')} />
              <FormHelperText className='text-red-600'>{errors.manufacturer?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Composition' {...register('composition')} />
              <FormHelperText className='text-red-600'>{errors.composition?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Packing Type' {...register('packing_type')} />
              <FormHelperText className='text-red-600'>{errors.packing_type?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Packaging' {...register('packaging')} />
              <FormHelperText className='text-red-600'>{errors.packaging?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Schedule' {...register('Schedule')} />
              <FormHelperText className='text-red-600'>{errors.Schedule?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Usage' {...register('usage')} />
              <FormHelperText className='text-red-600'>{errors.usage?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='About Salt' {...register('about_salt')} />
              <FormHelperText className='text-red-600'>{errors.about_salt?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id='outlined-basic'
                label='Mechanism Of Action'
                {...register('mechanism_of_action')}
              />
              <FormHelperText className='text-red-600'>{errors.mechanism_of_action?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Pharmacokinets' {...register('pharmacokinets')} />
              <FormHelperText className='text-red-600'>{errors.pharmacokinets?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Onset of Action' {...register('onset_of_action')} />
              <FormHelperText className='text-red-600'>{errors.onset_of_action?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Duration of Action' {...register('duration_of_action')} />
              <FormHelperText className='text-red-600'>{errors.duration_of_action?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Half Life' {...register('half_life')} />
              <FormHelperText className='text-red-600'>{errors.half_life?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Side Effects' {...register('side_effects')} />
              <FormHelperText className='text-red-600'>{errors.side_effects?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Contra-indications' {...register('contra_indications')} />
              <FormHelperText className='text-red-600'>{errors.contra_indications?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id='outlined-basic'
                label='Special Precautions while taking'
                {...register('special_precautions_while_taking')}
              />
              <FormHelperText className='text-red-600'>
                {errors.special_precautions_while_taking?.message}
              </FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id='outlined-basic'
                label='Pregnancy Related Information'
                {...register('pregnancy_related_information')}
              />
              <FormHelperText className='text-red-600'>{errors.pregnancy_related_information?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id='outlined-basic'
                label='Product and Alcohol Interaction'
                {...register('product_and_alcohol_interaction')}
              />
              <FormHelperText className='text-red-600'>
                {errors.product_and_alcohol_interaction?.message}
              </FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id='outlined-basic'
                label='Old Age Related Information'
                {...register('old_age_related_information')}
              />
              <FormHelperText className='text-red-600'>{errors.old_age_related_information?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id='outlined-basic'
                label='Breast Feeding Related Information'
                {...register('breast_feeding_related_information')}
              />
              <FormHelperText className='text-red-600'>
                {errors.breast_feeding_related_information?.message}
              </FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id='outlined-basic'
                label='Children Related Information'
                {...register('children_related_information')}
              />
              <FormHelperText className='text-red-600'>{errors.children_related_information?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Indications' {...register('indications')} />
              <FormHelperText className='text-red-600'>{errors.indications?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Interactions' {...register('interactions')} />
              <FormHelperText className='text-red-600'>{errors.interactions?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Typical Dosage' {...register('typical_dosage')} />
              <FormHelperText className='text-red-600'>{errors.typical_dosage?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id='outlined-basic'
                label='Storage Requirements'
                {...register('storage_requirements')}
              />
              <FormHelperText className='text-red-600'>{errors.storage_requirements?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id='outlined-basic'
                label='Effects of Missed Dosage'
                {...register('effects_of_missed_dosage')}
              />
              <FormHelperText className='text-red-600'>{errors.effects_of_missed_dosage?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id='outlined-basic'
                label='Effects of Overdose'
                {...register('effects_of_overdose')}
              />
              <FormHelperText className='text-red-600'>{errors.effects_of_overdose?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Expert Advice' {...register('expert_advice')} />
              <FormHelperText className='text-red-600'>{errors.expert_advice?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='How to Use' {...register('how_to_use')} />
              <FormHelperText className='text-red-600'>{errors.how_to_use?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Faqs' {...register('faqs')} />
              <FormHelperText className='text-red-600'>{errors.faqs?.message}</FormHelperText>
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

export default AddProductActions
