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

const AddUserActions = () => {
  // States
  const router = useRouter()

  const dispatch = useDispatch()
  const { userValidationSchema, defaultValues } = createUserSchema


  const [roleOption, setRoleOptions] = useState([])
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const genderOptions = [
    {
      label: "Male",
      value: "male"
    },
    {
      label: "Female",
      value: "female"
    },
    {
      label: "Other",
      value: "others"
    }
  ]

  const {
    register,

    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(userValidationSchema),
    defaultValues
  })



  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-admin/get-sub-admin`, { withCredentials: true })

      dispatch(setUsersData(response.data.subAdmins)) // Ensure `setData` action is correctly set
    } catch (err) {
      console.error('Failed to fetch sub admins', err) // Log the error for debugging

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
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-admin/add-sub-admin`, formData, { withCredentials: true })
        .then(res => {
          toast.success('User Added Successfully!')
          fetchUsers()
          router.push('/apps/users')
        })
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Something went wrong!')
    }
  }

  // Fetch vendors when the component mounts

  const fetchFormats = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/role/get-roles`, { withCredentials: true })

      const transformedRoles = response.data.roles.map((role: any) => ({
        label: role.roleName,  // label as roleName
        value: role._id,       // value as _id
      }));

      setRoleOptions(transformedRoles);  //
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
        title='Add User'
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
                <InputLabel id='role-select'>Select Role</InputLabel>
                <Select
                  fullWidth
                  defaultValue=''
                  label='Select Role'
                  onChange={(e: any) => {


                    setValue('role', e.target?.value)
                  }}
                  labelId='role-select'
                >
                  {roleOption?.map((vendor: any) => (
                    <MenuItem key={vendor.value} value={vendor.value}>
                      {vendor.label}
                    </MenuItem>
                  ))}
                </Select>

                {/* <FormHelperText className='text-red-600'>{errors?.vendor_id?.message}</FormHelperText> */}

                <FormHelperText className='text-red-600'>
                  {typeof errors?.role?.message === 'string' ? errors.role.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField {...register('firstName')} fullWidth id='outlined-basic' label='First Name' />
              <FormHelperText className='text-red-600'>{errors.firstName?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Last Name' {...register('lastName')} />
              <FormHelperText className='text-red-600'>{errors.lastName?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' type='email' label='Email' {...register('email')} />
              <FormHelperText className='text-red-600'>{errors.email?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Mobile Number' {...register('phoneNumber')} />
              <FormHelperText className='text-red-600'>{errors.phoneNumber?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()} aria-label='toggle password visibility'>
                      <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                    </IconButton>
                  </InputAdornment>
                )
              }} fullWidth id='outlined-basic' type={isPasswordShown ? 'text' : 'password'} label='Password' {...register('password')} />
              <FormHelperText className='text-red-600'>{errors.password?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth className='mbe-4'>
                <InputLabel id='gender-select'>Select Gender</InputLabel>
                <Select
                  fullWidth
                  defaultValue=''
                  label='Select Gender'
                  onChange={(e: any) => {


                    setValue('gender', e.target?.value)
                  }}
                  labelId='gender-select'
                >
                  {genderOptions?.map((vendor: any) => (
                    <MenuItem key={vendor.value} value={vendor.value}>
                      {vendor.label}
                    </MenuItem>
                  ))}
                </Select>

                {/* <FormHelperText className='text-red-600'>{errors?.vendor_id?.message}</FormHelperText> */}

                <FormHelperText className='text-red-600'>
                  {typeof errors?.gender?.message === 'string' ? errors.gender.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField fullWidth id='outlined-basic' label='Username' {...register('username')} />
              <FormHelperText className='text-red-600'>{errors.username?.message}</FormHelperText>
            </Grid>


            <Grid item xs={12} md={12}>
              <InputLabel id='prod-image-select'>Select Profile Picture</InputLabel>
              <FormControl fullWidth className='mbe-4'>
                <div id='prod-image-select'>
                  <FileUploaderSingle setValue={setValue} fieldName={'profilePicture'} />
                </div>

                <FormHelperText className='text-red-600'>{errors.profilePicture?.message}</FormHelperText>
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

export default AddUserActions
