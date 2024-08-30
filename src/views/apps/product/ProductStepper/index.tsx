/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

// React Imports
import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import { useDispatch } from 'react-redux'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepConnector from '@mui/material/StepConnector'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { yupResolver } from '@hookform/resolvers/yup'

import axios from 'axios'

import { useForm } from 'react-hook-form'

// Component Imports
import StepPersonalDetails from './BasicInformation'
import StepPropertyDetails from './ProductDetails'
import StepPropertyFeatures from './HealthInformationDetails'
import StepPropertyArea from './AdditionalInformationDetails'
import StepPriceDetails from './StepPriceDetails'

// Styled Component Imports
import StepperWrapper from '@core/styles/stepper'
import StepperCustomDot from '@components/stepper-dot'

import createProductSchema from '../add/create-form'

import { setData } from '@/redux-store/slices/productSlice'

// Vars
const steps = [
  {
    title: 'Basic Information',
    subtitle: 'Product Overview'
  },
  {
    title: 'Product Details',
    subtitle: 'Detailed Specifications'
  },
  {
    title: 'Health Information',
    subtitle: 'Health & Safety Information'
  },
  {
    title: 'Additional Information',
    subtitle: 'Usage & Documentation'
  }
]

const getStepContent = (
  step: number,
  handleNext: () => void,
  handlePrev: () => void,
  register: any,
  errors: any,
  setValue: any,
  handleSubmit: any,
  onSubmit: any
) => {
  const Tag =
    step === 0
      ? StepPersonalDetails
      : step === 1
        ? StepPropertyDetails
        : step === 2
          ? StepPropertyFeatures
          : step === 3
            ? StepPropertyArea
            : StepPriceDetails

  return (
    <Tag
      activeStep={step}
      handleNext={handleNext}
      handlePrev={handlePrev}
      steps={steps}
      register={register}
      errors={errors}
      setValue={setValue}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
    />
  )
}

// Styled Components
const ConnectorHeight = styled(StepConnector)(() => ({
  '& .MuiStepConnector-line': {
    minHeight: 20
  }
}))

const ProductListingWizard = () => {
  // States
  const [activeStep, setActiveStep] = useState<number>(0)

  const dispatch = useDispatch()
  const router = useRouter()

  // form validation

  // const { productValidationSchema, defaultValues } = createProductSchema

  const { basicInfoSchema, productDetailsSchema, healthInfoSchema, additionalInfoSchema } = createProductSchema

  const { basicInfoDefaultValues, productDetailsDefaultValues, healthInfoDefaultValues, additionalInfoDefaultValues } =
    createProductSchema

  const schemaMap = [basicInfoSchema, productDetailsSchema, healthInfoSchema, additionalInfoSchema]

  const defaultValuesMap = [
    basicInfoDefaultValues,
    productDetailsDefaultValues,
    healthInfoDefaultValues,
    additionalInfoDefaultValues
  ]

  // const validationSchema = schemaMap[activeStep]
  // const defaultValues = defaultValuesMap[activeStep]

  const getSchemaAndDefaultValues = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return { schema: basicInfoSchema, defaultValues: basicInfoDefaultValues }
      case 1:
        return { schema: productDetailsSchema, defaultValues: productDetailsDefaultValues }
      case 2:
        return { schema: healthInfoSchema, defaultValues: healthInfoDefaultValues }
      case 3:
        return { schema: additionalInfoSchema, defaultValues: additionalInfoDefaultValues }
      default:
        return { schema: basicInfoSchema, defaultValues: basicInfoDefaultValues }
    }
  }

  const { schema: validationSchema, defaultValues } = getSchemaAndDefaultValues(activeStep)

  const {
    register,

    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<any>({
    resolver: yupResolver(basicInfoSchema),
    defaultValues: basicInfoDefaultValues
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
    console.log('data', data)

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

  console.log('errors', errors)

  // const handleNext = () => {
  // if (activeStep !== steps.length - 1) {
  //   setActiveStep(activeStep + 1)
  // } else {
  //   alert('Submitted..!!')
  // }
  // }

  // const handleNext = handleSubmit(() => {
  //   setActiveStep(prevActiveStep => prevActiveStep + 1)
  // })

  const handleNext = handleSubmit(data => {
    // If it's the last step, handle final submission
    if (activeStep === steps.length - 1) {
      onSubmit(data)
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1)
    }
  })

  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }

  return (
    <Card className='flex flex-col lg:flex-row'>
      <CardContent className='max-lg:border-be lg:border-ie lg:min-is-[300px]'>
        <StepperWrapper className='bs-full'>
          <Stepper activeStep={activeStep} connector={<ConnectorHeight />} orientation='vertical'>
            {steps.map((step, index) => {
              return (
                <Step key={index}>
                  <StepLabel className='p-0' StepIconComponent={StepperCustomDot}>
                    <div className='step-label cursor-pointer'>
                      <Typography className='step-number'>{`0${index + 1}`}</Typography>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <CardContent className='flex-1 pbs-5'>
        {getStepContent(activeStep, handleNext, handlePrev, register, errors, setValue, handleSubmit, onSubmit)}
      </CardContent>
    </Card>
  )
}

export default ProductListingWizard
