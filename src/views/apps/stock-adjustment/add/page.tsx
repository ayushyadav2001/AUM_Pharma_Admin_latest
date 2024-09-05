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
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip
} from '@mui/material'

import ReactSelect from 'react-select';

// MUI Imports
// Third-party Imports

// import type { Theme } from '@mui/material/styles'

// Third-party Imports
// import type { SubmitHandler } from 'react-hook-form'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import axios from 'axios'

import { toast } from 'react-toastify'

import { format } from 'date-fns'

import FileUploaderSingle from '../ProductFileUpload/FileUploaderSingle'



import { setData } from '@/redux-store/slices/productSlice'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import Loader from '@/views/Loader/Loader'
import createStockAdjustmentSchema from './create-form'
import { setStockAdjustmentData } from '@/redux-store/slices/StockAdjustmentSlice'

const AddStockAdjustmentAction = () => {
  // States
  const router = useRouter()

  const dispatch = useDispatch()
  const { stockAdjustmentValidationSchema, defaultValues } = createStockAdjustmentSchema

  const [productOption, setProductOptions] = useState([])
  const [productValue, setProductValue] = useState([])

  const [tableRows, setTableRows] = useState<any>([]);
  const [tableRowsProduct, setTableRowsProduct] = useState<any>([]);

  const [loading, setLoading] = useState(true)


  interface CustomInputProps {
    value?: Date | null // Add value prop here
    label?: string
  }


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


  const {
    register,

    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<any>({
    resolver: yupResolver(stockAdjustmentValidationSchema),
    defaultValues
  })



  const onSubmit = async (data: any) => {







    try {
      const response = await axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stock-adjust/add-adjustment`, data, {

          withCredentials: true,
        })
        .then(res => {
          toast.success('Stock Adjustment Added  Successfully!')
          fetchStocks()
          setTimeout(() => {
            router.push('/apps/stock-adjustment');
          }, 2000);
        })
    } catch (error) {
      console.error('Error adding stock:', error)
      toast.error('Something went wrong!')
    }
  }

  // Fetch vendors when the component mounts



  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stock/get-all`, { withCredentials: true })

      const transformedProducts = response.data.data.map((item: any) => ({
        label: item.product.name, // Product name
        value: item.product.id,   // Product id
        currentStock: item.stock.current_stock // Total stock
      }));

      setProductOptions(transformedProducts);
      setLoading(false)

    } catch (error) {
      console.error('Error fetching vendors:', error)
      setLoading(false)

    }
  }

  const fetchStocks = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stock-adjust/get-all-adjustment`, { withCredentials: true })

      dispatch(setStockAdjustmentData(response.data.data)) // Ensure `setData` action is correctly set
    } catch (err) {
      console.error('Failed to fetch products', err) // Log the error for debugging

    } finally {
      setLoading(false)
    }
  }



  const handleProductChange = async (selectedOption: any) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get-stock-data/${selectedOption.value}`, { withCredentials: true });
      const productData = response.data.data;

      const newRow = {
        product: productData.name,
        quantity: 1,
        unitPrice: productData.mrp,
        subtotal: productData.mrp
      };

      const newRowTwo = {
        product: productData._id,
        quantity: 1,
        unitPrice: productData.mrp,
        subtotal: productData.mrp
      };


      setTableRows((prevRows: any) => {
        const updatedRows = [...prevRows, newRow];

        // setValue('productDetails', updatedRows);

        return updatedRows;
      });

      setTableRowsProduct((prevRows: any) => {
        const updatedRows = [...prevRows, newRowTwo];

        setValue('productDetails', updatedRows);

        return updatedRows;
      });



    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  console.log("tableRows", tableRows)

  // const handleInputChange = (index: any, field: any, value: any) => {
  //   const updatedRows = [...tableRows];

  //   updatedRows[index][field] = value;

  //   if (field === 'quantity' || field === 'unitPrice') {
  //     updatedRows[index].subtotal = updatedRows[index].quantity * updatedRows[index].unitPrice;
  //   }

  //   setTableRows(updatedRows);
  //   setValue('productDetails', tableRows);
  // };

  const handleInputChange = (index: number, field: string, value: number) => {
    setTableRows((prevRows: any) => {
      const updatedRows = [...prevRows];

      updatedRows[index][field] = value;

      // Recalculate subtotal if necessary
      if (field === 'quantity' || field === 'unitPrice') {
        updatedRows[index].subtotal = updatedRows[index].quantity * updatedRows[index].unitPrice;
      }

      // Update state and form value
      // setValue('productDetails', updatedRows);

      return updatedRows;
    });


    setTableRowsProduct((prevRows: any) => {
      const updatedRows = [...prevRows];

      updatedRows[index][field] = value;

      // Recalculate subtotal if necessary
      if (field === 'quantity' || field === 'unitPrice') {
        updatedRows[index].subtotal = updatedRows[index].quantity * updatedRows[index].unitPrice;
      }

      // Update state and form value
      setValue('productDetails', updatedRows);

      return updatedRows;
    });
  };


  const [dateTime, setDateTime] = useState<Date | null>(new Date());

  const [adjustmentType, setAdjustmentType] = useState<number | string>('')
  const [adjustmentDue, setAdjustmentDue] = useState<number | string>('')

  const handleDateChange = (date: Date | null) => {
    if (date !== null) {
      setDateTime(date)

      setValue('purchaseDate', date)
    }
  }

  const adjustmentOptions = [

    { value: 'increase', label: 'Increase' },
    { value: 'decrease', label: 'Decrease' },

  ]

  const adjustmentDueOptions = [
    { value: 'inventory', label: 'Inventory Update' },
    { value: 'damage', label: 'Product Received with Damage' },
    { value: 'loss', label: 'Product Loss' },
    { value: 'sale', label: 'Product Sale' },
    { value: 'return', label: 'Product Returned' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    fetchProducts()

  }, [])

  if (loading) {
    return <Loader />
  }

  const totalAmount = tableRows.reduce((sum: any, row: any) => sum + row.subtotal, 0);


  return (
    <Card>
      <CardHeader
        title='Add Stock Adjustment'
        titleTypographyProps={{
          variant: 'h5',
          color: 'primary'
        }}
      />
      <CardContent className='sm:!p-12'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>

            <CardContent className='sm:!p-12'>
              <Grid container spacing={2}>

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
                    customInput={<CustomInput value={dateTime} label='Date' />}
                  />
                  {/* <FormHelperText className='text-red-600'>{errors.purchase_date?.message as string}</FormHelperText> */}
                </Grid>



                <Grid item xs={12} md={4}>
                  <FormControl fullWidth className='mbe-4'>
                    <InputLabel id='format-select'>Adjustment type</InputLabel>
                    <Select
                      fullWidth
                      label='Adjustment type'

                      {...register('adjustmentType')}
                      onChange={(e: any) => {

                        setValue('adjustmentType', e.value)
                        setAdjustmentType(e.value)
                      }}
                      labelId='format-select'
                    >
                      {adjustmentOptions?.map((data: any, key: number) => (
                        <MenuItem key={key} value={data.value}>
                          {data.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText className='text-red-600'>{errors?.adjustmentType?.message as string}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth className='mbe-4'>
                    <InputLabel id='format-select'>Adjustment Due to</InputLabel>
                    <Select
                      fullWidth
                      label='Adjustment Due to'

                      {...register('adjustmentDue')}
                      onChange={(e: any) => {

                        setValue('adjustmentDue', e?.value)
                        setAdjustmentDue(e.value)
                      }}
                      labelId='format-select'
                    >
                      {adjustmentDueOptions?.map((data: any, key: number) => (
                        <MenuItem key={key} value={data.value}>
                          {data.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText className='text-red-600'>{errors?.adjustmentDue?.message as string}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>

          </Card>
          <Card className='mt-4'>

            <CardContent className='sm:!p-12'>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <FormControl fullWidth className='mbe-4'>
                    {/* <InputLabel id='adjustment-due-select'>Search Product For Adjustment</InputLabel> */}
                    <ReactSelect
                      id='adjustment-due-select'
                      options={productOption}
                      value={productValue}

                      onChange={handleProductChange}

                      placeholder='Search Products for stock adjustment'

                    />
                    <FormHelperText className='text-red-600'>{errors?.productDetails?.message as string}</FormHelperText>

                  </FormControl>
                </Grid>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Unit Price</TableCell>
                        <TableCell>Subtotal</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableRows.map((row: any, index: any) => (
                        <TableRow key={index}>
                          <TableCell>{row.product}</TableCell>
                          <TableCell>
                            <TextField
                              type='number'
                              value={row.quantity}
                              onChange={(e) => handleInputChange(index, 'quantity', parseFloat(e.target.value))}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type='number'
                              value={row.unitPrice}
                              onChange={(e) => handleInputChange(index, 'unitPrice', parseFloat(e.target.value))}
                            />
                          </TableCell>
                          <TableCell>{row.subtotal.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button onClick={() => {
                              setTableRows(tableRows.filter((_: any, i: any) => i !== index))
                              setTableRowsProduct(tableRows.filter((_: any, i: any) => i !== index))
                            }}>
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3}><strong>Total Amount</strong></TableCell>
                        <TableCell  ><strong > {totalAmount ? totalAmount.toFixed(2) : 0}</strong></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

              </Grid>

            </CardContent>

          </Card>


          <Card className='mt-4'>

            <CardContent className='sm:!p-12'>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    {...register('totalAmountRecovered')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Tooltip title='Amount recovered from customer or vendor or others '>
                            <IconButton>
                              <i className='ri-information-fill bg-blue-500' />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}



                    fullWidth
                    id='outlined-basic'
                    label='Total amount recovered:'
                  />

                </Grid>


                <Grid item xs={12} md={8}>

                  <TextField
                    {...register('reason')}
                    fullWidth
                    type="text"
                    label="Reason"
                    placeholder="Enter reason for stock adjustment"
                    multiline
                    minRows={1}


                  />


                </Grid>
              </Grid>

            </CardContent>
          </Card>
          <div className='flex justify-center items-center mt-4'>
            <Button type='submit' color='primary' variant='contained' className='capitalize'>
              Save
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddStockAdjustmentAction
