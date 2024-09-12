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
import createUserSchema from './create-form'
import FileUploaderSingle from '../../customers/ProductFileUpload/FileUploaderSingle'
import { setUsersData } from '@/redux-store/slices/userSlice'
import { setCategoryData } from '@/redux-store/slices/categorySlice'

const EditCategoryActions = ({ data, id }: { data?: any, id?: any }) => {
  // States
  const router = useRouter()

  const dispatch = useDispatch()
  const { categoryValidationSchema, defaultValues } = createUserSchema

  const {
    register,

    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<any>({
    resolver: yupResolver(categoryValidationSchema),
    defaultValues: {
      name: data?.name || '', // Default value for category name
      description: data?.description || '', // Default value for description
      add_to_header: data?.add_to_header || false, // Checkbox default value
      add_to_banner: data?.add_to_banner || false, // Checkbox default value

    }
  })


  useEffect(() => {
    // Set default values when data is available
    if (data) {
      setValue('name', data.name)
      setValue('description', data.description)
      setValue('add_to_header', data.add_to_header)
      setValue('add_to_banner', data.add_to_banner)

    }
  }, [data])


  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get-category-by-status`, { withCredentials: true })

      dispatch(setCategoryData(response.data.categories))
    } catch (err) {
      console.error('Failed to fetch sub admins', err)

    } finally {

    }
  }





  const onSubmit = async (data: any) => {
    try {
      const response = await axios
        .put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/update-category/${id}`, data, {
          withCredentials: true,

        })
        .then(res => {
          toast.success('Category Updated Successfully!')
          fetchCategory()
          router.push('/apps/category')
        })
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Something went wrong!')
    }
  }





  return (
    <Card>
      <CardHeader
        title='Edit Category'
        titleTypographyProps={{
          variant: 'h5',
          color: 'primary'
        }}
      />
      <CardContent className='sm:!p-12'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>

            <Grid item xs={12} md={4}>
              <TextField InputLabelProps={{
                shrink: !!data?.name // Shrink the label if there is a value in the data
              }} defaultValue={data?.name} placeholder='Enter category name' {...register('name')} fullWidth id='outlined-basic' label='Category name' />
              <FormHelperText className='text-red-600'>{errors.name?.message as string}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField fullWidth
                multiline
                InputLabelProps={{
                  shrink: !!data?.description // Shrink the label if there is a value in the data
                }}
                minRows={1} id='outlined-basic' placeholder='Enter Category description' label='Category Description' {...register('description')} />
              <FormHelperText className='text-red-600'>{errors.description?.message as string}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked={!!data?.add_to_header}

                      onChange={(e) => setValue('add_to_header', e.target.checked)}

                    />
                  }
                  label='Add to header'
                />
                <FormHelperText>
                  Mark the checkbox if you want to display this category on the website header.
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox defaultChecked={!!data?.add_to_banner} onChange={(e) => setValue('add_to_banner', e.target.checked)} />
                  }
                  label='Add to Banners'
                />
                <FormHelperText>
                  Mark the checkbox if you want to display this category on the website popular categories.
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <InputLabel id='prod-image-select'>Choose Category Image</InputLabel>
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
              Update
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default EditCategoryActions
