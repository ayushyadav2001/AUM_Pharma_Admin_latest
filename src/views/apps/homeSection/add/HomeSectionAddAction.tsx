/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  TextField,
  IconButton,
  FormHelperText
} from '@mui/material'
// eslint-disable-next-line import/no-unresolved

// eslint-disable-next-line import/no-unresolved
// import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch } from 'react-redux'
import axios from 'axios'
import Select from 'react-select'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, useFieldArray } from 'react-hook-form'
import { toast } from 'react-toastify'

import sectionSchema from './schema'

// Define the schema and default values
const { sectionValidationSchema, defaultValues } = sectionSchema

const HomeSectionAdd = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [selectedOption, setSelectedOption] = useState<
    'banner' | 'product_slider' | 'category_slider' | 'prescription_component' | null
  >('banner')

  const [products, setProducts] = useState([])

  const [categories, setCategories] = useState([])

  // Initialize form handling with validation schema
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<any>({
    resolver: yupResolver(sectionValidationSchema),
    defaultValues
  })

  const {
    fields: bannerFields,
    append,
    remove
  } = useFieldArray({
    control,
    name: 'banners'
  })

  // Fetch product options for the Select component
  const fetchProductOptions = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get-all-product`, {
        withCredentials: true
      })

      setProducts(
        response.data.products.map((product: any) => ({
          value: product._id,
          label: product.product_name
        }))
      )
    } catch (err) {
      console.error('Failed to fetch products', err)
    }
  }

  const fetchCategoryOptions = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get-category-by-status`, {
        withCredentials: true
      })

      setCategories(
        response.data.categories.map((category: any) => ({
          value: category._id,
          label: category.name
        }))
      )
    } catch (err) {
      console.error('Failed to fetch products', err)
    }
  }

  // Handle form submission
  const onSubmit = async (data: any) => {
    console.log('submitted', data)

    // Create a FormData object to handle file uploads
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('type', data.type)

    // Append banners or products based on the type
    if (data.type === 'banner') {
      data.banners.forEach((banner: any, index: number) => {
        formData.append(`banner_image`, banner.imageUrl[0])
        formData.append(`linkUrl${index}`, banner.linkUrl)
      })
    } else if (data.type === 'product_slider') {
      data.products.forEach((product: any, index: number) => {
        formData.append('products[]', product) // Assuming products is an array of product IDs
      })
    } else if (data.type === 'category_slider') {
      data.categories.forEach((category: any, index: number) => {
        formData.append('categories[]', category)
      })
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/home-section/add-section`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success('Section added successfully!')
      setTimeout(() => {
        router.push('/apps/homeSections')
      }, 2000)
    } catch (err) {
      console.error('Failed to submit', err)
    }
  }

  // Fetch product options on component mount
  useEffect(() => {
    if (selectedOption === 'product_slider') {
      fetchProductOptions()
    }

    if (selectedOption === 'category_slider') {
      fetchCategoryOptions()
    }
  }, [selectedOption])

  return (
    <div>
      <Card>
        <CardHeader title='Add Home Section' className='pbe-4' />
        <Divider />
        <CardContent className='h-screen'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-wrap items-center gap-4'>
              <TextField
                label='Title'
                {...register('title')}
                error={Boolean(errors.title)}
                helperText={errors.title?.message as string}
                fullWidth
              />
            </div>
            <br />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedOption === 'banner'}
                  onChange={() => {
                    if (selectedOption !== 'banner') {
                      setValue('products', [])
                      setValue('categories', [])
                      setValue('type', 'banner')
                      setValue('banners', [{ imageUrl: null, linkUrl: '' }])
                      setSelectedOption('banner')
                    }
                  }}
                />
              }
              label='Add Banners'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedOption === 'product_slider'}
                  onChange={() => {
                    if (selectedOption !== 'product_slider') {
                      setSelectedOption('product_slider')
                      setValue('banners', [])
                      setValue('categories', [])
                      setValue('type', 'product_slider')
                    }
                  }}
                />
              }
              label='Add Products'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedOption === 'category_slider'}
                  onChange={() => {
                    if (selectedOption !== 'category_slider') {
                      setSelectedOption('category_slider')
                      setValue('banners', [])
                      setValue('products', [])
                      setValue('type', 'category_slider')
                    }
                  }}
                />
              }
              label='Add Categories'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedOption === 'prescription_component'}
                  onChange={() => {
                    if (selectedOption !== 'prescription_component') {
                      setSelectedOption('prescription_component')
                      setValue('banners', [])
                      setValue('categories', [])

                      setValue('type', 'prescription_component')
                    }
                  }}
                />
              }
              label='Add Prescription'
            />
            <br />
            <br />
            {selectedOption === 'banner' && (
              <>
                {bannerFields.map((field: any, index: any) => {
                  return (
                    <div key={field.id} className='flex items-center gap-4 mb-4'>
                      <div>
                        <TextField
                          InputLabelProps={{ shrink: true }}
                          label='Banner File'
                          type='file'
                          {...register(`banners.${index}.imageUrl` as const)}
                          fullWidth

                          // error={Boolean(errors?.banners?.[index]?.imageUrl)}
                          // helperText={errors?.banners?.[index]?.imageUrl?.message as string}
                        />
                      </div>
                      <TextField label='Banner Link' {...register(`banners.${index}.linkUrl` as string)} fullWidth />
                      {bannerFields.length > 1 && (
                        <IconButton onClick={() => remove(index)} aria-label='Remove banner'>
                          <i className='ri-delete-bin-6-line'></i>
                        </IconButton>
                      )}
                    </div>
                  )
                })}

                {/* <div className='flex justify-end '>
                  <Button
                    startIcon={<i className='ri-add-large-fill'></i>}
                    onClick={() => append({ imageUrl: '', linkUrl: '' })}
                    variant='outlined'
                  >
                    Add More
                  </Button>
                </div> */}
              </>
            )}
            {selectedOption === 'product_slider' && (
              <div className='w-full'>
                <Select
                  isMulti
                  closeMenuOnSelect={false}
                  isClearable={false}
                  onChange={(e: any) => {
                    const selectedValues = e.map((option: any) => option.value)

                    setValue('products', selectedValues)
                  }}
                  options={products}
                />
                <div className='text-red-500 text-xs mt-2'>{errors?.products?.message as string}</div>
              </div>
            )}

            {selectedOption === 'category_slider' && (
              <div className='w-full'>
                <Select
                  isMulti
                  closeMenuOnSelect={false}
                  isClearable={false}
                  onChange={(e: any) => {
                    const selectedValues = e.map((option: any) => option.value)

                    setValue('categories', selectedValues)
                  }}
                  options={categories}
                />
                <div className='text-red-500 text-xs mt-2'>{errors?.categories?.message as string}</div>
              </div>
            )}

            <div className='flex justify-center items-center mt-[100px]'>
              <Button type='submit' color='primary' variant='contained' className='capitalize'>
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default HomeSectionAdd
