/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

// React Imports
import { forwardRef, useEffect, useState } from 'react'

// import { useRouter } from 'next/router'

import { useRouter } from 'next/navigation'

import { useDispatch } from 'react-redux'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'

// MUI Imports
// Third-party Imports

// import type { Theme } from '@mui/material/styles'

// Third-party Imports
// import type { SubmitHandler } from 'react-hook-form'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { format } from 'date-fns'

import axios from 'axios'
import * as yup from 'yup'
import { toast } from 'react-toastify'

import FileUploaderSingle from '../ProductFileUpload/FileUploaderSingle'


import { setData } from '@/redux-store/slices/vendorSlice'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import FileUploaderSingleExcel from '../../product/ProductExcelUpload/FileUploaderSingle'
import createPurchaseOrderSchema from './create-form'
import PurchaseOrderListPreviewTable from '../purchase-order-table/PurchaseOrderPreviewTable'

import PurchaseOrderListErrorTable from '../product-error-table/PurchaseOrderErrorTable'

// import { TextFieldProps } from '@mui/material';

// Define the props type for CustomInput
interface CustomInputProps {
  value?: Date | null // Add value prop here
  label?: string
}

// Create the CustomInput component
const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(({ label, value, ...props }: any, ref) => {
  // Format the date and time if value is provided
  const formattedValue = value ? format(value, 'MM/dd/yyyy h:mm aa') : ''

  return (
    <TextField
      fullWidth
      inputRef={ref}
      label={label || ''}
      {...props}
      value={formattedValue} // Use the formatted date-time value
    />
  )
})

interface FormValues {
  vendor: string
  name: string
  date: Date | null // Adjusted to allow null
  status: string
  payTermNumber: number | string // Adjusted to allow both number and string
  payTermUnit: string
  product_excel: File | null // Adjusted to allow null
}

interface Address {
  _id: string
  vendorId: string
  state: string
  city: string
  pinCode: string
  addressLine: string
  createdAt: string
  updatedAt: string
}

interface VendorData {
  _id: string
  name: string
  format: string
  phoneNumber: string
  email: string
  gstNumber: string
  panNumber: string
  dlNumber: string
  foodLicenseNumber: string
  contactPersonName: string
  contactPersonMobileNumber: string
  contactPersonPhoneNumber: string
  msmeNumber: string
  fssNumber: string
  payable: number
  due: number
  status: boolean
  createdAt: string
  updatedAt: string
  address: Address
}

const AddPurchaseOrderActions = () => {
  // States
  const router = useRouter()

  const dispatch = useDispatch()
  const { purchaseOrderValidationSchema, defaultValues } = createPurchaseOrderSchema

  const [vendorOptions, setVendorFormats] = useState([])

  const [importedData, setImportedData] = useState([])

  // const [importedUpdatedData, setImportedDataUpdatedData] = useState([])

  const setImportedDataUpdatedData = (data: any) => {
    setImportedData(data)
  }

  const setImportedDataFormik = (data: any) => {
    setValue('items', data)
  }

  // const [vendorData, setVendorData] = useState(null)

  const [vendorData, setVendorData] = useState<VendorData | null>(null)

  // const [dateTime, setDateTime] = useState<Date | null>(null);
  const [dateTime, setDateTime] = useState<Date | null>(new Date())

  const [selectedStatus, setSelectedStatus] = useState<string>('')

  const [netTotalAmount, setNetTotalAmount] = useState<string>('0.00')

  const [totalItems, setTotalItems] = useState<string>('0.00')

  const [selectedVendor, setSelectedVendor] = useState<number | string>('')

  const [payTermNumber, setPayTermNumber] = useState<number | string>('0')
  const [payTermUnit, setPayTermUnit] = useState<string>('days')
  const [showImportError, setShowImportError] = useState(false)

  const [showImportErrorData, setShowImportErrorData] = useState([])

  const [showImportModifiedData, setShowImportModifiedData] = useState([])

  const [importModal, setImportModel] = useState(false)

  const OpenImportModel = () => {
    if (selectedVendor) {
      setImportModel(true)
    } else {
      toast.error('Please select vendor first!')
    }
  }

  const closeImportModel = () => {
    setImportModel(false)
  }

  const closeImportErrorModel = () => {
    setShowImportError(false)
    setImportModel(false)
  }

  const unitOptions = [
    { value: 'days', label: 'Days' },
    { value: 'months', label: 'Months' }
  ]

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setPayTermNumber(value)

    setValue('payTermNumber', value)
  }

  const handleUnitChange = (event: any) => {
    const value = event.target.value as string

    setPayTermUnit(value)

    setValue('payTermUnit', value)
  }

  // Options for the Select component
  const statusOptions = [
    { value: '', label: 'Select' }, // Default option
    { value: 'received', label: 'Received' },
    { value: 'pending', label: 'Pending' },
    { value: 'ordered', label: 'Ordered' }
  ]

  // Handle change event for Select
  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newValue = event.target.value as string

    setSelectedStatus(newValue)

    // setValue('vendor', newValue); // Update form value
  }

  const handleDateChange = (date: Date | null) => {
    if (date !== null) {
      setDateTime(date)
      setValue('purchase_date', date)
    }
  }

  const {
    register,

    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<any>({
    resolver: yupResolver(purchaseOrderValidationSchema),
    defaultValues
  })

  console.log('errors', errors)

  const importProductSchema = yup.object().shape({
    product_excel: yup.mixed().required('Excel is required')
  })

  const importProductDefaultValues = {
    product_excel: null
  }

  const {
    setValue: setValueImport,
    handleSubmit: handleSubmitImport,
    formState: { errors: importErrors }
  } = useForm<any>({
    resolver: yupResolver(importProductSchema),
    defaultValues: importProductDefaultValues
  })

  console.log('importErrors', importErrors)

  const onSubmit = async (data: any) => {
    console.log('Purchase Orders Data', data)

    const formData = new FormData()

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        formData.append(key, data[key])
      }
    }

    try {
      const response = await axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/purchase-orders/add-order`, data, { withCredentials: true })
        .then(res => {
          toast.success('Purchase Order Added Successfully!')
          fetchVendors()
          router.push('/apps/purchase-orders')
        })
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Something went wrong!')
    }
  }

  // Fetch vendors when the component mounts
  const onSubmitInsert = async (data: any) => {
    try {
      const formData = new FormData()

      // Append file to FormData
      if (data?.product_excel) {
        formData.append('product_excel', data.product_excel)
      }

      if (data?.product_excel) {
        await axios
          .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendor/get-formatted-data/${selectedVendor}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          })
          .then((res: any) => {
            if (res.data && res.data.purchaseOrderProducts && res.data.matchedProducts.length == 0) {
              setImportedData(res.data.purchaseOrderProducts)

              setTotalItems(res.data.total_items)
              setNetTotalAmount(res.data.net_total_amount)
              setValue('items', res.data.purchaseOrderProducts)

              toast.success('Data Imported Successfully !')
              setImportModel(false)
            } else {
              setShowImportError(true)

              setShowImportModifiedData(res?.data?.purchaseOrderProducts)

              setShowImportErrorData(res.data.itemComparisons)
            }
          })
      }
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error uploading file :', error)
      toast.error('Something Went Wrong !')
    }
  }

  console.log('importedData', importedData)

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendor/get-all-vendor`, {
        withCredentials: true
      })

      setVendorFormats(response.data.data)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  const fetchVendorsByID = async (id: any) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendor/get-vendor/${id}`, {
        withCredentials: true
      })

      setVendorData(response.data.data)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  useEffect(() => {
    fetchVendors()
    setValue('purchase_date', dateTime)
  }, [])

  console.log('vendorData', vendorData)

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader
            title='Add Purchase Order'
            titleTypographyProps={{
              variant: 'h5',
              color: 'primary'
            }}
          />
          <Divider />
          <CardContent className='sm:!p-12'>
            <Grid container spacing={6}>
              {/* Basic Details */}
              <Grid item xs={12}>
                <Typography variant='body2' className='font-medium' color='text.primary'>
                  1. Basic Details
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className='mbe-4'>
                  <InputLabel id='format-select'>Select Vendor</InputLabel>
                  <Select
                    fullWidth
                    label='Select Format'
                    {...register('vendor_id')}
                    onChange={(e: any) => {
                      fetchVendorsByID(e.target?.value)
                      setValue('vendor_id', e.target?.value)
                      setSelectedVendor(e.target?.value)
                    }}
                    labelId='format-select'
                  >
                    {vendorOptions?.map((vendor: any) => (
                      <MenuItem key={vendor._id} value={vendor._id}>
                        {vendor.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText className='text-red-600'>{errors?.vendor_id?.message as string}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Tooltip title='Leave empty to autogenerate'>
                          <IconButton>
                            <i className='ri-information-fill bg-blue-500' />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    )
                  }}
                  {...register('referenceNumber')}
                  fullWidth
                  id='outlined-basic'
                  label='Reference Number'
                />
                <FormHelperText className='text-red-600'>{errors.referenceNumber?.message as string}</FormHelperText>
              </Grid>
              <Grid item xs={12} md={4}>
                <AppReactDatepicker
                  showTimeSelect
                  timeFormat='HH:mm'
                  timeIntervals={15}
                  selected={dateTime}
                  id='date-time-picker'
                  dateFormat='MM/dd/yyyy h:mm aa'
                  onChange={handleDateChange}
                  customInput={<CustomInput value={dateTime} label='Purchase Date' />}
                />
                <FormHelperText className='text-red-600'>{errors.purchase_date?.message as string}</FormHelperText>
              </Grid>
              <Grid item xs={12} md={4}>
                <h3>Address</h3>
                {vendorData && vendorData?.address ? (
                  <div>
                    <p>{vendorData?.address.addressLine}</p>
                  </div>
                ) : (
                  <p></p>
                )}
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className='mbe-4'>
                  <InputLabel id='status-select'>Purchase Status </InputLabel>

                  <Select
                    fullWidth
                    label='Purchase Status'
                    value={selectedStatus}
                    onChange={event => {
                      const newValue = event.target.value as string

                      setSelectedStatus(newValue)

                      setValue('purchaseStatus', newValue)
                    }}
                    labelId='status-select'
                  >
                    {statusOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText className='text-red-600'>{errors.purchaseStatus?.message as string}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    id='pay-term'
                    label='Pay Term'
                    type='number'
                    className='pr-0 select-input-pay-term'
                    sx={{ paddingInline: 0 }}
                    value={payTermNumber}
                    onChange={handleNumberChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Tooltip title='Payment to be paid for purchase/sales within the given time period.'>
                            <IconButton>
                              <i className='ri-information-fill bg-blue-500 mr-2' />
                            </IconButton>
                          </Tooltip>
                          <Select
                            className='p-i'
                            value={payTermUnit}
                            onChange={handleUnitChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Pay Term Unit' }}
                          >
                            {unitOptions.map(option => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </InputAdornment>
                      )
                    }}


                  />
                  <FormHelperText className='text-red-600'>{errors.payTermNumber?.message as string}</FormHelperText>
                  <FormHelperText className='text-red-600'>{errors.payTermUnit?.message as string}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <br />
        <Card>
          <CardHeader
            title='Import Products'
            titleTypographyProps={{
              variant: 'h5',
              color: 'primary'
            }}
          />
          <Divider />
          <CardContent className='sm:!p-12'>
            <div className='flex justify-end gap-4 p-4 flex-col items-start sm:flex-row sm:items-center'>
              <div className='flex justify-end gap-4 flex-col items-start sm:flex-row sm:items-center'>
                <Button variant='contained' onClick={OpenImportModel} className='is-full sm:is-auto'>
                  Import Products
                </Button>
              </div>
            </div>

            <PurchaseOrderListPreviewTable
              tableData={importedData}
              setImportedDataUpdatedData={setImportedDataUpdatedData}
            />
            <br />

            <div className='flex flex-col items-end space-y-2'>
              <div className='flex items-center'>
                <h3 className='font-bold'>Total Items:</h3>
                <h3 className='font-bold ml-3'>{totalItems}</h3>
              </div>

              <div className='flex items-center'>
                <h3 className='font-bold'>Net Total Amount:</h3>
                <h3 className='font-bold ml-3 text-center flex justify-center items-center'>₹  {netTotalAmount}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <br />
        <div className='flex justify-center'>
          <Button type='submit' color='primary' variant='contained' className='capitalize'>
            Save
          </Button>
        </div>
      </form>

      <Dialog
        maxWidth='lg'
        disableEscapeKeyDown
        fullWidth
        onClose={(event: any, reason: any) => {
          if (reason !== 'backdropClick') {
            closeImportModel()
          }
        }}
        aria-labelledby='customized-dialog-title'
        open={importModal}
      >
        <form onSubmit={handleSubmitImport(onSubmitInsert)}>
          <DialogTitle id='customized-dialog-title' className='p-4'>
            <Typography variant='h6' component='span'>
              Import Excel
            </Typography>
            <IconButton
              aria-label='close'
              onClick={closeImportModel}
              className='absolute top-2.5 right-2.5 text-[var(--mui-palette-grey-500)]'
            >
              <i className='ri-close-line' />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers className='p-4'>
            {!showImportError && (
              <Grid item xs={12} md={12}>
                <InputLabel>File to import</InputLabel>

                <FileUploaderSingleExcel setValue={setValueImport} fieldName={'product_excel'} />
                <FormHelperText className='text-red-600'>
                  {importErrors.product_excel?.message as string}
                </FormHelperText>
              </Grid>
            )}

            {showImportError && (
              <div>
                <InputLabel>Choose the correct Product Name </InputLabel>

                <PurchaseOrderListErrorTable
                  importedData={showImportModifiedData}
                  setShowImportError={closeImportErrorModel}
                  setImportedDataUpdatedData={setImportedDataUpdatedData}
                  setImportedDataFormik={setImportedDataFormik}
                  tableData={showImportErrorData}
                />
              </div>
            )}
          </DialogContent>
          <DialogActions className='p-4 !pbs-4'>
            {!showImportError && (
              <Button type='submit' onClick={onSubmitInsert} color='primary' variant='contained'>
                Import
              </Button>

            )}

          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

export default AddPurchaseOrderActions
