'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { useRouter } from 'next/navigation'

import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MuiStepper from '@mui/material/Stepper'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

import type { StepperProps } from '@mui/material/Stepper'

// Third-party Imports
import { toast } from 'react-toastify'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'


// Component Imports
import axios from 'axios'

import StepperWrapper from '@core/styles/stepper'
import StepperCustomDot from '@components/stepper-dot'
import DirectionalIcon from '@components/DirectionalIcon'
import createProductSchema from './schema/add-product-schema'
import FileUploaderSingle from '../ProductFileUpload/FileUploaderSingle'

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

// Styled Components
const Stepper = styled(MuiStepper)<StepperProps>(({ theme }) => ({
  justifyContent: 'center',
  '& .MuiStep-root': {
    '&:first-of-type': {
      paddingInlineStart: 0
    },
    '&:last-of-type': {
      paddingInlineEnd: 0
    },
    [theme.breakpoints.down('md')]: {
      paddingInline: 0
    }
  }
}))





const ProductStepperLinear = () => {
  // States
  const [activeStep, setActiveStep] = useState(0)

  const [vendors, setVendors] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])




  const { basicInfoSchema, productDetailsSchema, healthInfoSchema, additionalInfoSchema } = createProductSchema

  const { basicInfoDefaultValues, productDetailsDefaultValues, healthDetailsDefaultValues, additionalInfoDefaultValues } =
    createProductSchema

  const [formData, setFormData] = useState({
    basicInfo: {},
    productDetails: {},
    healthDetails: {},
    additionalDetails: {},
  });


  // Hooks
  const {
    reset: basicInfoReset,
    control: basicInfoControl,
    setValue: basicSetValue,
    handleSubmit: handleBasicInfoSubmit,
    formState: { errors: basicInfoErrors }
  } = useForm({
    resolver: valibotResolver(basicInfoSchema),
    defaultValues: basicInfoDefaultValues
  })

  const {
    reset: productDetailsReset,
    control: productDetailsControl,
    handleSubmit: handleProductDetailSubmit,
    formState: { errors: productDetailsErrors }
  } = useForm({
    resolver: valibotResolver(productDetailsSchema),
    defaultValues: productDetailsDefaultValues
  })

  const {
    reset: healthInfoDetailsReset,
    control: healthDetailsControl,
    handleSubmit: handleHealthDetailsSubmit,
    formState: { errors: healthDetailsErrors }
  } = useForm({
    resolver: valibotResolver(healthInfoSchema),
    defaultValues: healthDetailsDefaultValues
  })


  // here






  const {
    reset: additionalDetailsReset,
    control: additionalControl,
    handleSubmit: handleAdditionSubmit,
    formState: { errors: additionalErrors }
  } = useForm({
    resolver: valibotResolver(additionalInfoSchema),
    defaultValues: additionalInfoDefaultValues
  })

  const router = useRouter()

  const collectFormData = async () => {

    const combinedData: any = { ...formData.basicInfo, ...formData.productDetails, ...formData.healthDetails, ...formData.additionalDetails };


    const formDataObj = new FormData();

    for (const key in combinedData) {

      if (Object.hasOwnProperty.call(combinedData, key)) {

        formDataObj.append(key, combinedData[key]);
      }
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/add-product`, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      });





      toast.success('Product Added Successfully!');
      fetchProducts();
      router.push('/apps/products');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Something went wrong!');
    }
  };

  const fetchProducts = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get-all-product`, { withCredentials: true });


    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };


  const onSubmit = (data: any) => {



    setFormData((prevData) => ({
      ...prevData,
      [activeStep === 0 ? 'basicInfo' : activeStep === 1 ? 'productDetails' : activeStep === 2 ? 'healthDetails' : 'additionalDetails']: data,
    }));

    // setActiveStep(prevActiveStep => prevActiveStep + 1)

    if (activeStep === steps.length - 1) {


      collectFormData();
      toast.success('Form Submitted')
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }



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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-category/get-sub-category-by-category/${id}`, { withCredentials: true }
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


  const handleReset = () => {
    setActiveStep(0)
    basicInfoReset(basicInfoDefaultValues)
    productDetailsReset(productDetailsDefaultValues)
    healthInfoDetailsReset(healthDetailsDefaultValues)
    additionalDetailsReset(additionalInfoDefaultValues)

  }

  const renderStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <form key={0} onSubmit={handleBasicInfoSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography className='font-medium' color='text.primary'>
                  {steps[0].title}
                </Typography>
                <Typography variant='body2'>{steps[0].subtitle}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={5}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name='product_id'
                      control={basicInfoControl}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          id='outlined-basic'
                          label='Product ID'
                          placeholder='Enter Product ID'
                          {...(basicInfoErrors.product_id && { error: true, helperText: basicInfoErrors.product_id.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name='product_name'
                      control={basicInfoControl}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          id='outlined-basic'
                          label='Product Name'
                          placeholder='Enter Product Name'
                          {...(basicInfoErrors.product_name && { error: true, helperText: basicInfoErrors.product_name.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name='mrp'
                      control={basicInfoControl}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          id='outlined-basic'
                          label='MRP'
                          placeholder='Enter MRP'
                          type='number'
                          {...(basicInfoErrors.mrp && { error: true, helperText: basicInfoErrors.mrp.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name='igst'
                      control={basicInfoControl}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          id='outlined-basic'
                          label='IGST'
                          placeholder='Enter IGST'
                          type='number'
                          {...(basicInfoErrors.igst && { error: true, helperText: basicInfoErrors.igst.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name='hsn'
                      control={basicInfoControl}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          id='outlined-basic'
                          label='HSN'
                          placeholder='Enter HSN'
                          {...(basicInfoErrors.hsn && { error: true, helperText: basicInfoErrors.hsn.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name='manufacturer'
                      control={basicInfoControl}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          id='outlined-basic'
                          label='Manufacturer'
                          placeholder='Enter Manufacturer'
                          {...(basicInfoErrors.manufacturer && { error: true, helperText: basicInfoErrors.manufacturer.message })}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Controller
                      name='category'
                      control={basicInfoControl}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormControl fullWidth className='mbe-4'>
                          <InputLabel id='category-select'>Select Category</InputLabel>
                          <Select
                            {...field}
                            fullWidth
                            label='Select Category'
                            onChange={(e) => {
                              field.onChange(e);
                              fetchSubCategory(e.target?.value);
                            }}
                            labelId='category-select'
                          >
                            {category?.map((category: any) => (
                              <MenuItem key={category?._id} value={category?._id}>
                                {category?.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText className='text-red-600'>{basicInfoErrors.category?.message}</FormHelperText>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name='sub_category'
                      control={basicInfoControl}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormControl fullWidth className='mbe-4'>
                          <InputLabel id='subcategory-select'>Select Sub Category</InputLabel>
                          <Select
                            {...field}
                            fullWidth
                            defaultValue=''
                            label='Select Sub Category'
                            onChange={(e) => field.onChange(e)}
                            labelId='subcategory-select'
                          >
                            {subCategory?.map((category: any) => (
                              <MenuItem key={category?._id} value={category?._id}>
                                {category?.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText className='text-red-600'>{basicInfoErrors.sub_category?.message}</FormHelperText>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name='vendor_id'
                      control={basicInfoControl}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormControl fullWidth className='mbe-4'>
                          <InputLabel id='vendor-select'>Select Vendor</InputLabel>
                          <Select
                            {...field}
                            fullWidth
                            defaultValue=''
                            label='Select Vendor'
                            onChange={(e) => field.onChange(e)}
                            labelId='vendor-select'
                          >
                            {vendors?.map((vendor: any) => (
                              <MenuItem key={vendor?._id} value={vendor?._id}>
                                {vendor?.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText className='text-red-600'>{basicInfoErrors.vendor_id?.message}</FormHelperText>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Controller
                      name='product_image'
                      control={basicInfoControl}
                      render={({ }) => (
                        <FormControl fullWidth className='mbe-4'>
                          <InputLabel id='prod-image-select'>Select Product Image</InputLabel>
                          <div id='prod-image-select'>
                            <FileUploaderSingle setValue={basicSetValue} fieldName={'product_image'} />
                          </div>
                          <FormHelperText className='text-red-600'>{basicInfoErrors.product_image?.message}</FormHelperText>
                        </FormControl>
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} className='flex justify-between'>
                <Button
                  variant='outlined'
                  disabled
                  color='secondary'
                  startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
                >
                  Back
                </Button>
                <Button
                  variant='contained'
                  type='submit'
                  endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
                >
                  Next
                </Button>
              </Grid>

            </Grid>
          </form>
        )

      case 1:
        return (
          <form key={1} onSubmit={handleProductDetailSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography className='font-medium' color='text.primary'>
                  {steps[2].title}
                </Typography>
                <Typography variant='body2'>{steps[2].subtitle}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='composition'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      type='text'
                      label='Composition'
                      placeholder='Enter product composition'
                      {...(productDetailsErrors.composition && { error: true, helperText: productDetailsErrors.composition.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='usage'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label='Usage'
                      placeholder='Enter product Usage'
                      {...(productDetailsErrors.usage && { error: true, helperText: productDetailsErrors.usage.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='packing_type'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id='packing-type'>Packing Type</InputLabel>
                      <Select
                        {...field}
                        id='packing-type'
                        label='Packing Type'
                        defaultValue=''
                      >
                        <MenuItem value='strip'>Strip</MenuItem>
                        <MenuItem value='bottle'>Bottle</MenuItem>
                        <MenuItem value='packet'>Packet</MenuItem>
                        <MenuItem value='prefilled syringe'>Prefilled Syringe</MenuItem>
                        <MenuItem value='tube'>Tube</MenuItem>
                        <MenuItem value='vial'>Vial</MenuItem>
                      </Select>
                      <FormHelperText className='text-red-600'>{productDetailsErrors.packing_type?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='packaging'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Packaging'
                      placeholder='Enter product Packaging'
                      {...(productDetailsErrors.packaging && { error: true, helperText: productDetailsErrors.packaging.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='Schedule'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label='Schedule'
                      placeholder='Enter product schedule'
                      {...(productDetailsErrors.Schedule && { error: true, helperText: productDetailsErrors.Schedule.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='about_salt'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label='About Salt'
                      placeholder='Enter product about salt'
                      {...(productDetailsErrors.about_salt && { error: true, helperText: productDetailsErrors.about_salt.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='mechanism_of_action'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label='Mechanism of Action'
                      placeholder='Enter mechanism of action'
                      {...(productDetailsErrors.mechanism_of_action && { error: true, helperText: productDetailsErrors.mechanism_of_action.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='pharmacokinets'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label='Pharmacokinetics'
                      placeholder='Enter product Pharmacokinetics'
                      {...(productDetailsErrors.pharmacokinets && { error: true, helperText: productDetailsErrors.pharmacokinets.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='onset_of_action'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Onset of Action'
                      placeholder='Enter Onset of Action'
                      {...(productDetailsErrors.onset_of_action && { error: true, helperText: productDetailsErrors.onset_of_action.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='duration_of_action'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Duration of Action'
                      placeholder='Enter duration of action'
                      {...(productDetailsErrors.duration_of_action && { error: true, helperText: productDetailsErrors.duration_of_action.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Controller
                  name='half_life'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Half Life'
                      placeholder='Enter half life'
                      {...(productDetailsErrors.half_life && { error: true, helperText: productDetailsErrors.half_life.message })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} className='flex justify-between'>
                <Button
                  variant='outlined'
                  onClick={handleBack}
                  color='secondary'
                  startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
                >
                  Back
                </Button>
                <Button
                  variant='contained'
                  type='submit'
                  endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        )

      case 2:
        return (
          <form key={2} onSubmit={handleHealthDetailsSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography className='font-medium' color='text.primary'>
                  {steps[2].title}
                </Typography>
                <Typography variant='body2'>{steps[2].subtitle}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="side_effects"
                  control={healthDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label="Side Effects"
                      placeholder="Enter product side effects"
                      error={!!healthDetailsErrors.side_effects}
                      helperText={healthDetailsErrors.side_effects?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="contra_indications"
                  control={healthDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label="Contra-indications"
                      placeholder="Enter contra-indications"
                      error={!!healthDetailsErrors.contra_indications}
                      helperText={healthDetailsErrors.contra_indications?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="special_precautions_while_taking"
                  control={healthDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label="Special Precautions While Taking"
                      placeholder="Enter special precautions while taking"
                      error={!!healthDetailsErrors.special_precautions_while_taking}
                      helperText={healthDetailsErrors.special_precautions_while_taking?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="pregnancy_related_information"
                  control={healthDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label="Pregnancy Related Information"
                      placeholder="Enter pregnancy related information"
                      error={!!healthDetailsErrors.pregnancy_related_information}
                      helperText={healthDetailsErrors.pregnancy_related_information?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="product_and_alcohol_interaction"
                  control={healthDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label="Product and Alcohol Interaction"
                      placeholder="Enter product and alcohol interaction"
                      error={!!healthDetailsErrors.product_and_alcohol_interaction}
                      helperText={healthDetailsErrors.product_and_alcohol_interaction?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="old_age_related_information"
                  control={healthDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label="Old Age Related Information"
                      placeholder="Enter old age related information"
                      error={!!healthDetailsErrors.old_age_related_information}
                      helperText={healthDetailsErrors.old_age_related_information?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="breast_feeding_related_information"
                  control={healthDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label="Breast Feeding Related Information"
                      placeholder="Enter breast feeding related information"
                      error={!!healthDetailsErrors.breast_feeding_related_information}
                      helperText={healthDetailsErrors.breast_feeding_related_information?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="children_related_information"
                  control={healthDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label="Children Related Information"
                      placeholder="Enter children related information"
                      error={!!healthDetailsErrors.children_related_information}
                      helperText={healthDetailsErrors.children_related_information?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="indications"
                  control={healthDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label="Indications"
                      placeholder="Enter indications"
                      error={!!healthDetailsErrors.indications}
                      helperText={healthDetailsErrors.indications?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="interactions"
                  control={healthDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label="Interactions"
                      placeholder="Enter interactions"
                      error={!!healthDetailsErrors.interactions}
                      helperText={healthDetailsErrors.interactions?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="typical_dosage"
                  control={healthDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label="Typical Dosage"
                      placeholder="Enter typical dosage"
                      error={!!healthDetailsErrors.typical_dosage}
                      helperText={healthDetailsErrors.typical_dosage?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="storage_requirements"
                  control={healthDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label="Storage Requirements"
                      placeholder="Enter storage requirements"
                      error={!!healthDetailsErrors.storage_requirements}
                      helperText={healthDetailsErrors.storage_requirements?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="effects_of_missed_dosage"
                  control={healthDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label="Effects of Missed Dosage"
                      placeholder="Enter effects of missed dosage"
                      error={!!healthDetailsErrors.effects_of_missed_dosage}
                      helperText={healthDetailsErrors.effects_of_missed_dosage?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="effects_of_overdose"
                  control={healthDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label="Effects of Overdose"
                      placeholder="Enter effects of overdose"
                      error={!!healthDetailsErrors.effects_of_overdose}
                      helperText={healthDetailsErrors.effects_of_overdose?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} className='flex justify-between'>
                <Button
                  variant='outlined'
                  onClick={handleBack}
                  color='secondary'
                  startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
                >
                  Back
                </Button>
                <Button
                  variant='contained'
                  type='submit'
                  endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        )

      case 3:
        return (
          <form key={3} onSubmit={handleAdditionSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography className='font-medium' color='text.primary'>
                  {steps[1].title}
                </Typography>
                <Typography variant='body2'>{steps[1].subtitle}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="expert_advice"
                  control={additionalControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      type="text"
                      label="Expert Advice"
                      placeholder="Enter product expert advice"
                    />
                  )}
                />
                <FormHelperText className="text-red-600">
                  {additionalErrors.expert_advice?.message}
                </FormHelperText>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="how_to_use"
                  control={additionalControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      type="text"
                      label="How to Use"
                      placeholder="Enter how to use"
                    />
                  )}
                />
                <FormHelperText className="text-red-600">
                  {additionalErrors.how_to_use?.message}
                </FormHelperText>
              </Grid>

              <Grid item xs={12} md={12}>
                <Controller
                  name="faqs"
                  control={additionalControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="text"
                      label="FAQs"
                      placeholder="Enter FAQs"
                      multiline
                      minRows={2}
                    />
                  )}
                />
                <FormHelperText className="text-red-600">
                  {additionalErrors.faqs?.message}
                </FormHelperText>
              </Grid>

              <Grid item xs={12} className='flex justify-between'>
                <Button
                  variant='outlined'
                  onClick={handleBack}
                  color='secondary'
                  startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
                >
                  Back
                </Button>
                <Button
                  variant='contained'
                  type='submit'
                  endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      default:
        return <Typography color='text.primary'>Unknown stepIndex</Typography>
    }
  }

  return (
    <Card>
      <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const labelProps: {
                error?: boolean
              } = {}

              if (index === activeStep) {
                labelProps.error = false

                if (
                  (basicInfoErrors.product_id ||
                    basicInfoErrors.product_name ||
                    basicInfoErrors.mrp ||
                    basicInfoErrors.igst ||
                    basicInfoErrors.hsn ||
                    basicInfoErrors.manufacturer ||
                    basicInfoErrors.category ||
                    basicInfoErrors.sub_category ||
                    basicInfoErrors.vendor_id ||
                    basicInfoErrors.product_image) &&
                  activeStep === 0
                ) {
                  labelProps.error = true;
                }

                // Product Details Step (Step 1)
                else if (
                  (productDetailsErrors.composition ||
                    productDetailsErrors.packing_type ||
                    productDetailsErrors.packaging ||
                    productDetailsErrors.Schedule ||
                    productDetailsErrors.usage ||
                    productDetailsErrors.about_salt ||
                    productDetailsErrors.mechanism_of_action ||
                    productDetailsErrors.pharmacokinets ||
                    productDetailsErrors.onset_of_action ||
                    productDetailsErrors.duration_of_action ||
                    productDetailsErrors.half_life) &&
                  activeStep === 1
                ) {
                  labelProps.error = true;
                }

                // Health Info Step (Step 2)
                else if (
                  (healthDetailsErrors.side_effects ||
                    healthDetailsErrors.contra_indications ||
                    healthDetailsErrors.special_precautions_while_taking ||
                    healthDetailsErrors.pregnancy_related_information ||
                    healthDetailsErrors.product_and_alcohol_interaction ||
                    healthDetailsErrors.old_age_related_information ||
                    healthDetailsErrors.breast_feeding_related_information ||
                    healthDetailsErrors.children_related_information ||
                    healthDetailsErrors.indications ||
                    healthDetailsErrors.interactions ||
                    healthDetailsErrors.typical_dosage ||
                    healthDetailsErrors.storage_requirements ||
                    healthDetailsErrors.effects_of_missed_dosage ||
                    healthDetailsErrors.effects_of_overdose) &&
                  activeStep === 2
                ) {
                  labelProps.error = true;
                } else if (
                  additionalErrors.expert_advice ||
                  additionalErrors.how_to_use ||
                  additionalErrors.faqs
                ) {
                  labelProps.error = true;
                }
              }

              return (
                <Step key={index}>
                  <StepLabel {...labelProps} StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <Typography className='step-number'>{`0${index + 1}`}</Typography>
                      <div>
                        <Typography className='step-title'>{label.title}</Typography>
                        <Typography className='step-subtitle'>{label.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>
      <Divider />
      <CardContent>
        {activeStep === steps.length ? (
          <>
            <Typography className='mlb-2 mli-1' color='text.primary'>
              All steps are completed!
            </Typography>
            <div className='flex justify-end mt-4'>
              <Button variant='contained' onClick={handleReset}>
                Reset
              </Button>
            </div>
          </>
        ) : (
          renderStepContent(activeStep)
        )}
      </CardContent>
    </Card>
  )
}

export default ProductStepperLinear
