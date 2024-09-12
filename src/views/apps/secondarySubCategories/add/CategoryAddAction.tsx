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
import { setCategoryData } from '@/redux-store/slices/categorySlice'
import { setSecondarySubCategoryData } from '@/redux-store/slices/SecondarySlice'

const AddSecondarySubCategoryActions = () => {
  // States
  const router = useRouter()

  const dispatch = useDispatch()
  const { categoryValidationSchema, defaultValues } = createUserSchema

  const [categoryOptions, setCategoryOptions] = useState([])



  const {
    register,

    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<any>({
    resolver: yupResolver(categoryValidationSchema),
    defaultValues
  })



  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-category/get-sub-category`, { withCredentials: true })

      dispatch(setCategoryData(response.data.subCategories))


      const transformedRoles = response.data.subCategories.map((role: any) => ({
        label: role.name,
        value: role._id,
      }));

      setCategoryOptions(transformedRoles);
    } catch (err) {
      console.error('Failed to fetch sub admins', err)

    } finally {

    }
  }

  const fetchSubCategory = async () => {
    try {

      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/secondary-sub-category/get-sub-category`, { withCredentials: true })

      dispatch(setSecondarySubCategoryData(response.data.subCategories))
    } catch (err) {
      console.error('Failed to fetch sub categories', err)

    }
  }

  const onSubmit = async (data: any) => {
    try {
      const response = await axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/secondary-sub-category/add-category`, data, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(res => {
          toast.success('Sub Category Added Successfully!')
          fetchSubCategory()
          router.push('/apps/secondary-sub-category')
        })
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Something went wrong!')
    }
  }





  useEffect(() => {
    fetchCategory()
  }, [])

  return (
    <Card>
      <CardHeader
        title='Add Secondary Sub Categories'
        titleTypographyProps={{
          variant: 'h5',
          color: 'primary'
        }}
      />
      <CardContent className='sm:!p-12'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth className='mbe-4'>
                <InputLabel id='role-select'>Select Sub Category</InputLabel>
                <Select
                  fullWidth
                  defaultValue=''
                  label='Select Category'
                  onChange={(e: any) => {



                    setValue('subCategory', e.target?.value)
                  }}
                  labelId='role-select'
                >
                  {categoryOptions?.map((vendor: any) => (
                    <MenuItem key={vendor.value} value={vendor.value}>
                      {vendor.label}
                    </MenuItem>
                  ))}
                </Select>



                <FormHelperText className='text-red-600'>
                  {typeof errors?.subCategory?.message === 'string' ? errors.subCategory.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField placeholder='Enter category name' {...register('name')} fullWidth id='outlined-basic' label='Secondary Category name' />
              <FormHelperText className='text-red-600'>{errors.name?.message as string}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField fullWidth
                multiline
                minRows={1} id='outlined-basic' placeholder='Enter Category description' label='Secondary Sub Category Description' {...register('description')} />
              <FormHelperText className='text-red-600'>{errors.description?.message as string}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={12}>
              <InputLabel id='prod-image-select'>Choose Secondary Sub Category Image</InputLabel>
              <FormControl fullWidth className='mbe-4'>
                <div id='prod-image-select'>
                  <FileUploaderSingle setValue={setValue} fieldName={'image'} />
                </div>

                <FormHelperText className='text-red-600'>{errors.image?.message as string}</FormHelperText>
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

export default AddSecondarySubCategoryActions
