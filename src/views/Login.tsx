'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'

// Third-party Imports

import { useForm } from 'react-hook-form'


import type { SubmitHandler } from 'react-hook-form'

import classnames from 'classnames'

import { yupResolver } from '@hookform/resolvers/yup';

// Formik Imports

import * as yup from 'yup'

import axios, { isAxiosError } from 'axios';

// Type Imports
import { toast } from 'react-toastify'

import type { Mode } from '@core/types'
import type { Locale } from '@/configs/i18n'

// Component Imports
import Logo from '@components/layout/shared/Logo'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'


// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

type ErrorType = {
  message: string[]
}






const validationSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
})


type FormValues = yup.InferType<typeof validationSchema>;

const Login = ({ mode }: { mode: Mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)

  // Vars
  const darkImg = '/images/pages/auth-v2-mask-1-dark.png'
  const lightImg = '/images/pages/auth-v2-mask-1-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  // Hooks
  const router = useRouter()

  // const searchParams = useSearchParams()

  const { lang: locale } = useParams()
  const { settings } = useSettings()

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });



  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors }
  // } = useForm<FormData>({
  //   resolver: valibotResolver(schema),
  //   defaultValues: {
  //     email: 'admin@materialize.com',
  //     password: 'admin'
  //   }
  // })

  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    try {
      console.log("data", data)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/login`, data);

      if (response.status === 200) {
        // Handle successful login
        toast.success('Login successful!');

        // Save data in session storage
        const { token, user } = response.data;

        sessionStorage.setItem('authToken', token);

        sessionStorage.setItem('user', JSON.stringify(user));

        router.push("/en/dashboards/crm");
      } else {
        // Handle unsuccessful login
        // setErrorState({ message: [response.data.message || 'Login failed. Please try again.'] });

        toast.error(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      // Handle API errors
      if (isAxiosError(error) && error.response) {

        // setErrorState({ message: [error.response.data.message || 'An error occurred.'] });

        toast.error(error.response.data.message || 'An error occurred.');
      } else {
        // setErrorState({ message: ['An unexpected error occurred.'] });

        toast.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <div className='pli-6 max-lg:mbs-40 lg:mbe-24'>
          <img
            src={characterIllustration}
            alt='character-illustration'
            className='max-bs-[673px] max-is-full bs-auto'
          />
        </div>
        <img src={authBackground} className='absolute bottom-[4%] z-[-1] is-full max-md:hidden' />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset]'>
          <div>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}!👋🏻`}</Typography>
            <Typography>Sign in to start managing your Pharmacy admin panel.</Typography>
          </div>
          <Alert icon={false} className='bg-[var(--mui-palette-primary-lightOpacity)] hidden'>
            <Typography variant='body2' color='primary'>
              Email: <span className='font-medium'>admin@materialize.com</span> / Pass:{' '}
              <span className='font-medium'>admin</span>
            </Typography>
          </Alert>

          <form
            noValidate
            action={() => { }}
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-5'
          >
            <TextField
              {...register('email')}
              fullWidth
              autoFocus
              placeholder='Enter you email'
              type='email'
              label='Email'
              onChange={e => {
                setValue('email', e.target.value);
                errorState !== null && setErrorState(null);
              }}
              error={!!errors.email || !!errorState}
              helperText={errors.email?.message || errorState?.message[0]}
            />
            <TextField
              {...register('password')}
              fullWidth
              label='Password'
              placeholder='Enter you password'

              id='login-password'
              type={isPasswordShown ? 'text' : 'password'}
              onChange={e => {
                setValue('password', e.target.value);
                errorState !== null && setErrorState(null);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()} aria-label='toggle password visibility'>
                      <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <div className='flex justify-between hidden items-center flex-wrap gap-x-3 gap-y-1'>
              <FormControlLabel control={<Checkbox defaultChecked />} label='Remember me' />
              <Typography
                className='text-end'
                color='primary'
                component={Link}
                href={getLocalizedUrl('/forgot-password', locale as Locale)}
              >
                Forgot password?
              </Typography>
            </div>
            <Button fullWidth variant='contained' type='submit'>
              Log In
            </Button>
            <div className='flex justify-center hidden items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Typography component={Link} href={getLocalizedUrl('/register', locale as Locale)} color='primary'>
                Create an account
              </Typography>
            </div>
          </form>
          <Divider className='gap-3 hidden'>or</Divider>

        </div>
      </div>
    </div>
  )
}

export default Login
