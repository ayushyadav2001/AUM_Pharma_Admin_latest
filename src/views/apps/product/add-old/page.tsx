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

import { Checkbox, Chip, FormControlLabel, IconButton, InputAdornment, Tooltip } from '@mui/material'

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

  // {
  //   title: 'Health Information',
  //   subtitle: 'Health & Safety Information'
  // },
  // {
  //   title: 'Additional Information',
  //   subtitle: 'Usage & Documentation'
  // }
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

  const [stockAdjustment, setStockAdjustment] = useState(true)
  const [category, setCategory] = useState([])
  const [packages, setPackage] = useState([])

  const [productForms, setProductForms] = useState([])

  const [packagingType, setPackagingType] = useState([])
  const [manufacturers, setManufacturers] = useState([])

  const [subCategory, setSubCategory] = useState([])


  const [categoryOptionValue, setCategoryOptionsValue] = useState<string[]>([]);
  const [subCategoryOptionValue, setSubCategoryOptionValue] = useState<string[]>([])

  console.log("categoryOptionValue", categoryOptionValue)

  const handleChangeCategory = (event: any) => {
    const {
      target: { value },
    } = event;



    setCategoryOptionsValue(



      typeof value === 'string' ? value.split(',') : value
    );


    const categoryOptionValueTwo = typeof value === 'string' ? value.split(',') : value;

    basicSetValue("category", categoryOptionValueTwo)

    fetchSubCategory(categoryOptionValueTwo)
  };

  const handleChangeSubCategory = (event: any) => {
    const {
      target: { value },
    } = event;



    setSubCategoryOptionValue(



      typeof value === 'string' ? value.split(',') : value
    );


    const subcategoryOptionValueTwo = typeof value === 'string' ? value.split(',') : value;

    basicSetValue("sub_category", subcategoryOptionValueTwo)
  };

  const getCategoryNameById = (id: string) => {
    const categoryItem: any = category.find((item: any) => item._id === id);


    return categoryItem ? categoryItem?.name : '';
  };

  const getSubCategoryNameById = (id: string) => {
    const categoryItem: any = subCategory.find((item: any) => item._id === id);


    return categoryItem ? categoryItem?.name : '';
  };




  const { basicInfoSchema, productDetailsSchema, } = createProductSchema

  const { basicInfoDefaultValues, productDetailsDefaultValues, } =
    createProductSchema

  const [formData, setFormData] = useState<any>({});



  // Hooks
  const {
    reset: basicInfoReset,
    control: basicInfoControl,
    setValue: basicSetValue,
    handleSubmit: handleBasicInfoSubmit,
    formState: { errors: basicInfoErrors }
  } = useForm<any>({
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

  // const {
  //   reset: healthInfoDetailsReset,
  //   control: healthDetailsControl,
  //   handleSubmit: handleHealthDetailsSubmit,
  //   formState: { errors: healthDetailsErrors }
  // } = useForm({
  //   resolver: valibotResolver(healthInfoSchema),
  //   defaultValues: healthDetailsDefaultValues
  // })


  // here






  // const {
  //   reset: additionalDetailsReset,
  //   control: additionalControl,
  //   handleSubmit: handleAdditionSubmit,
  //   formState: { errors: additionalErrors }
  // } = useForm({
  //   resolver: valibotResolver(additionalInfoSchema),
  //   defaultValues: additionalInfoDefaultValues
  // })

  const router = useRouter()

  // const collectFormData = async () => {

  //   const combinedData: any = { ...formData.basicInfo, ...formData.productDetails };

  //   console.log("combinedData", combinedData)

  // };

  const fetchProducts = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get-all-product`, { withCredentials: true });


    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };



  const handleNext = () => {
    if (activeStep === 0) {
      // First step: validate and save the first step's data
      handleBasicInfoSubmit(data => {
        setFormData((prev: any) => ({ ...prev, ...data })); // Save the first step's data
        setActiveStep(prevActiveStep => prevActiveStep + 1); // Move to the next step
      })();
    } else if (activeStep === 1) {
      // Second step: validate and handle the final submission in one go
      handleProductDetailSubmit(data => {
        setFormData((prev: any) => {
          const updatedFormData = { ...prev, ...data }; // Merge second step data into formData

          if (activeStep === steps.length - 1) {
            // If on the last step, make the API call directly after saving
            onSubmit(updatedFormData); // Submit the complete formData to the API
          }

          return updatedFormData;
        });
      })();
    }
  };

  const onSubmit = async (data: any) => {



    const finalData = { ...formData, ...data };

    const convertToArray = (str: string) => str.split(',').map(item => item.trim());


    const formDataObj = new FormData();

    // for (const key in finalData) {

    //   if (Object.hasOwnProperty.call(finalData, key)) {

    //     formDataObj.append(key, finalData[key]);
    //   }
    // }

    for (const key in finalData) {
      if (Object.hasOwnProperty.call(finalData, key)) {
        let value = finalData[key];

        // Convert category and sub_category to arrays if they are strings
        if (key === 'category' || key === 'sub_category') {
          if (typeof value === 'string' && value.includes(',')) {
            value = convertToArray(value);
          } else {
            value = value; // Ensure it is always an array
          }
        }

        // Append to FormData, convert array to JSON string if necessary
        if (Array.isArray(value)) {
          formDataObj.append(key, JSON.stringify(value));
        } else {
          formDataObj.append(key, value);
        }
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

    // setFormData((prevData) => ({
    //   ...prevData,
    //   [activeStep === 0 ? 'basicInfo' : 'productDetails']: data,
    // }));

    // setActiveStep(prevActiveStep => prevActiveStep + 1)

    if (activeStep === steps.length - 1) {



      // collectFormData();

      // toast.success('Form Submitted')
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }





  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get-category-by-status`, { withCredentials: true })

      setCategory(response.data.categories)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  const fetchPackage = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package/get-all-packaging`, { withCredentials: true })

      setPackage(response.data.data)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  const fetchProductForms = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product-form/get-all-product-form`, { withCredentials: true })

      setProductForms(response.data.data)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  const fetchPackageType = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package-type/get-all-packaging`, { withCredentials: true })

      setPackagingType(response.data.data)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  const fetchManufacturer = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/manufacturer/get-all-manufacturer`, { withCredentials: true })

      setManufacturers(response.data.data)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  const fetchSubCategory = async (idArray: any) => {
    try {



      const data = {
        category_ids: idArray
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-category/get-sub-category-by-category`, data, { withCredentials: true }
      )

      setSubCategory(response.data.subCategories)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  useEffect(() => {
    fetchCategory()
    fetchPackage()
    fetchPackageType()
    fetchManufacturer()
    fetchProductForms()

  }, [])


  const handleReset = () => {
    setActiveStep(0)
    basicInfoReset(basicInfoDefaultValues)
    productDetailsReset(productDetailsDefaultValues)

    // healthInfoDetailsReset(healthDetailsDefaultValues)
    // additionalDetailsReset(additionalInfoDefaultValues)

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
                      name='product_code'
                      control={basicInfoControl}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          id='outlined-basic'
                          label='Product Code'
                          placeholder='Enter Product Code'

                          error={!!basicInfoErrors.product_code}
                          helperText={typeof basicInfoErrors.product_code?.message === 'string' ? basicInfoErrors.product_code.message : ''}

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

                          error={!!basicInfoErrors.product_name}
                          helperText={typeof basicInfoErrors.product_name?.message === 'string' ? basicInfoErrors.product_name.message : ''}
                        />
                      )}
                    />
                  </Grid>


                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-chip-label">Select Category</InputLabel>
                      <Select
                        multiple
                        label="Select Category"
                        value={categoryOptionValue}
                        onChange={handleChangeCategory}
                        renderValue={(selected) => (
                          <div className="flex flex-wrap gap-1">
                            {selected.map((value: string) => (
                              <Chip key={value} label={getCategoryNameById(value)} size="small" />
                            ))}
                          </div>
                        )}
                        labelId="demo-multiple-chip-label"
                      >
                        {category.map((item: any) => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {basicInfoErrors.category?.message && (
                        <FormHelperText className='text-red-600'>
                          {String(basicInfoErrors.category.message)}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-chip-label">Select Sub Category</InputLabel>
                      <Select
                        multiple
                        label="Select Sub Category"
                        value={subCategoryOptionValue}
                        onChange={handleChangeSubCategory}
                        renderValue={(selected) => (
                          <div className="flex flex-wrap gap-1">
                            {selected.map((value: string) => (
                              <Chip key={value} label={getSubCategoryNameById(value)} size="small" />
                            ))}
                          </div>
                        )}
                        labelId="demo-multiple-chip-label"
                      >
                        {subCategory.map((item: any) => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>

                      {basicInfoErrors.sub_category?.message && (
                        <FormHelperText className='text-red-600'>
                          {String(basicInfoErrors.sub_category.message)}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>


                  <Grid item xs={12} md={6}>
                    <Controller
                      name='manufacturer'
                      control={basicInfoControl}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id='packing-type'>Select Manufacturer</InputLabel>
                          <Select
                            {...field}
                            id='packing-type'
                            label='Select Manufacturer'

                            onChange={(e) => {


                              field.onChange(e.target.value)
                            }}

                          >
                            {manufacturers?.map((data: any) => (
                              <MenuItem key={data?._id} value={data?._id}>
                                {data?.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText className='text-red-600'>{basicInfoErrors.manufacturer?.message as string}</FormHelperText>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name='product_form'
                      control={basicInfoControl}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id='packing-type'>Select Product Form</InputLabel>
                          <Select
                            {...field}
                            id='packing-type'
                            label='Select Product Form'

                            onChange={(e) => {


                              field.onChange(e.target.value)
                            }}

                          >
                            {productForms?.map((data: any) => (
                              <MenuItem key={data?._id} value={data?._id}>
                                {data?.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText className='text-red-600'>{basicInfoErrors.product_form?.message as string}</FormHelperText>
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name='packaging'
                      control={basicInfoControl}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id='packing-type'>Packaging</InputLabel>
                          <Select
                            {...field}
                            id='packing-type'
                            label='Packaging'

                            onChange={(e) => {


                              field.onChange(e.target.value)
                            }}

                          >
                            {packages?.map((data: any) => (
                              <MenuItem key={data?._id} value={data?._id}>
                                {data?.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText className='text-red-600'>{basicInfoErrors.packaging?.message as string}</FormHelperText>
                        </FormControl>
                      )}
                    />
                  </Grid>


                  <Grid item xs={12} md={6}>
                    <Controller
                      name='packing_type'
                      control={basicInfoControl}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id='packing-type'>Packaging Type</InputLabel>
                          <Select
                            {...field}
                            id='packing-type'
                            label='Packaging Type'

                            onChange={(e) => {


                              field.onChange(e.target.value)
                            }}

                          >
                            {packagingType?.map((data: any) => (
                              <MenuItem key={data?._id} value={data?._id}>
                                {data?.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText className='text-red-600'>{basicInfoErrors.packing_type?.message as string}</FormHelperText>
                        </FormControl>
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
                          error={!!basicInfoErrors.mrp}
                          helperText={typeof basicInfoErrors.mrp?.message === 'string' ? basicInfoErrors.mrp.message : ''}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name='discount'
                      control={basicInfoControl}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          id='outlined-basic'
                          label='Discount'
                          placeholder='Enter Discount eg.25 %'
                          type='number'
                          error={!!basicInfoErrors.discount}
                          helperText={typeof basicInfoErrors.discount?.message === 'string' ? basicInfoErrors.discount.message : ''}
                        />
                      )}
                    />
                  </Grid>


                  <Grid item xs={12} md={4}>
                    <Controller
                      name='prescription_required'
                      control={basicInfoControl}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <>
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                checked={field.value} // Bind the checked state

                              />
                            }
                            label='Prescription Required'
                          />
                          {basicInfoErrors.prescription_required && (
                            <FormHelperText className='text-red-600'>
                              {typeof basicInfoErrors.prescription_required?.message === 'string'
                                ? basicInfoErrors.prescription_required.message
                                : ''}
                            </FormHelperText>
                          )}
                        </>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Controller
                      name='stock_management_required'
                      control={basicInfoControl}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <>
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                checked={field.value}

                                onChange={(e) => {
                                  field.onChange(e.target.checked); // Update the form field's value
                                  setStockAdjustment(e.target.checked); // Update the local state

                                  if (!e.target.checked) {

                                    basicSetValue("alert_quantity", "0")
                                  } else {
                                    basicSetValue("alert_quantity", "")
                                  }
                                }}
                              />
                            }
                            label='Manage Stock'
                          />
                          {basicInfoErrors.stock_management_required && (
                            <FormHelperText className='text-red-600'>
                              {typeof basicInfoErrors.stock_management_required?.message === 'string'
                                ? basicInfoErrors.stock_management_required.message
                                : ''}
                            </FormHelperText>
                          )}
                        </>
                      )}
                    />
                  </Grid>
                  {stockAdjustment && (
                    <Grid item xs={12} md={4}>
                      <Controller
                        name='alert_quantity'
                        control={basicInfoControl}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            id='outlined-basic'
                            label='Alert Quantity'
                            placeholder='Enter alert quantity'
                            type='number'
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <Tooltip title='Get alert when product stock reaches or goes below the specified quantity'>
                                    <IconButton>
                                      <i className='ri-information-fill bg-blue-500' />
                                    </IconButton>
                                  </Tooltip>
                                </InputAdornment>
                              )
                            }}
                            error={!!basicInfoErrors.alert_quantity}
                            helperText={typeof basicInfoErrors.alert_quantity?.message === 'string' ? basicInfoErrors.alert_quantity.message : ''}
                          />
                        )}
                      />
                    </Grid>

                  )}

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
                          <FormHelperText className='text-red-600'>{basicInfoErrors.product_image?.message as string}</FormHelperText>
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
                  color={activeStep === steps.length - 1 ? 'success' : 'primary'}
                  onClick={handleNext} // Triggers validation for the current step
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
                  {steps[1].title}
                </Typography>
                <Typography variant='body2'>{steps[1].subtitle}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='introduction'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      type='text'
                      label='Introduction'
                      placeholder='Enter product introduction'

                      {...(productDetailsErrors.introduction && { error: true, helperText: productDetailsErrors.introduction.message })}
                    />
                  )}
                />

              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='description'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label='Description'
                      placeholder='Enter product description'
                      {...(productDetailsErrors.description && { error: true, helperText: productDetailsErrors.description.message })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name='salt_composition'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Salt Composition'
                      placeholder='Enter product Packaging'
                      {...(productDetailsErrors.salt_composition && { error: true, helperText: productDetailsErrors.salt_composition.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='benefits'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label='Benefits'
                      placeholder='Enter product schedule'
                      {...(productDetailsErrors.benefits && { error: true, helperText: productDetailsErrors.benefits.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='use_of'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label='Use of'
                      placeholder='Enter product use of'
                      {...(productDetailsErrors.use_of && { error: true, helperText: productDetailsErrors.use_of.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='how_to_use'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label='Enter product how to use'
                      placeholder='Enter mechanism of action'
                      {...(productDetailsErrors.how_to_use && { error: true, helperText: productDetailsErrors.how_to_use.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='safety_advice'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label='Safety Advice'
                      placeholder='Enter product safety advice'
                      {...(productDetailsErrors.safety_advice && { error: true, helperText: productDetailsErrors.safety_advice.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='ingredients'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Ingredients'
                      placeholder='Enter product ingredients'
                      {...(productDetailsErrors.ingredients && { error: true, helperText: productDetailsErrors.ingredients.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='primary_use'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Primary Use'
                      placeholder='Enter product primary use'
                      {...(productDetailsErrors.primary_use && { error: true, helperText: productDetailsErrors.primary_use.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='storage'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Storage'
                      placeholder='Enter product storage'
                      {...(productDetailsErrors.storage && { error: true, helperText: productDetailsErrors.storage.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='common_side_effects'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Common Side Effects'
                      placeholder='Enter product common side effects'
                      {...(productDetailsErrors.common_side_effects && { error: true, helperText: productDetailsErrors.common_side_effects.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='alcohol_interaction'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Alcohol Interaction'
                      placeholder='Enter product alcohol interaction'
                      {...(productDetailsErrors.alcohol_interaction && { error: true, helperText: productDetailsErrors.alcohol_interaction.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='pregnancy_interaction'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Pregnancy Interaction'
                      placeholder='Enter product pregnancy interaction'
                      {...(productDetailsErrors.pregnancy_interaction && { error: true, helperText: productDetailsErrors.pregnancy_interaction.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='lactation_interaction'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Lactation Interaction'
                      placeholder='Enter product lactation interaction'
                      {...(productDetailsErrors.lactation_interaction && { error: true, helperText: productDetailsErrors.lactation_interaction.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='driving_interaction'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Driving Interaction'
                      placeholder='Enter product driving interaction'
                      {...(productDetailsErrors.driving_interaction && { error: true, helperText: productDetailsErrors.driving_interaction.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='kidney_interaction'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Kidney Interaction'
                      placeholder='Enter product Kidney interaction'
                      {...(productDetailsErrors.kidney_interaction && { error: true, helperText: productDetailsErrors.kidney_interaction.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='liver_interaction'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Liver Interaction'
                      placeholder='Enter product liver interaction'
                      {...(productDetailsErrors.liver_interaction && { error: true, helperText: productDetailsErrors.liver_interaction.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name='country_of_origin'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Country of Origin'
                      placeholder='Enter product country of origin'
                      {...(productDetailsErrors.country_of_origin && { error: true, helperText: productDetailsErrors.country_of_origin.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Controller
                  name='faqs'
                  control={productDetailsControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Faqs'
                      placeholder='Enter product faqs'
                      {...(productDetailsErrors.faqs && { error: true, helperText: productDetailsErrors.faqs.message })}
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
                  (basicInfoErrors.product_code ||
                    basicInfoErrors.product_name ||
                    basicInfoErrors.category ||
                    basicInfoErrors.sub_category ||
                    basicInfoErrors.manufacturer ||
                    basicInfoErrors.manufacturer_address ||
                    basicInfoErrors.packaging ||
                    basicInfoErrors.packing_type ||
                    basicInfoErrors.mrp ||
                    basicInfoErrors.discount ||
                    basicInfoErrors.prescription_required ||
                    basicInfoErrors.stock_management_required ||
                    basicInfoErrors.alert_quantity ||
                    basicInfoErrors.quantity ||
                    basicInfoErrors.product_image) &&
                  activeStep === 0
                ) {
                  labelProps.error = true;
                }

                // Product Details Step (Step 1)
                else if (
                  (productDetailsErrors.introduction ||
                    productDetailsErrors.description ||
                    productDetailsErrors.salt_composition ||
                    productDetailsErrors.benefits ||
                    productDetailsErrors.use_of ||
                    productDetailsErrors.how_to_use ||
                    productDetailsErrors.safety_advice ||
                    productDetailsErrors.ingredients ||
                    productDetailsErrors.primary_use ||
                    productDetailsErrors.storage ||
                    productDetailsErrors.common_side_effects ||
                    productDetailsErrors.alcohol_interaction ||
                    productDetailsErrors.pregnancy_interaction ||
                    productDetailsErrors.lactation_interaction ||
                    productDetailsErrors.driving_interaction ||
                    productDetailsErrors.kidney_interaction ||
                    productDetailsErrors.liver_interaction ||
                    productDetailsErrors.country_of_origin ||
                    productDetailsErrors.faqs) &&
                  activeStep === 1
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
