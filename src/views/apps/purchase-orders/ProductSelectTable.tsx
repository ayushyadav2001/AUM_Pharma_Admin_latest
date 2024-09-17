/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

// React Imports
import { forwardRef, useEffect, useMemo, useState } from 'react'

// import { useRouter } from 'next/router'

import { useRouter } from 'next/navigation'

import { useDispatch } from 'react-redux'

import {
  Box,
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
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
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





import { setData } from '@/redux-store/slices/productSlice'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import Loader from '@/views/Loader/Loader'

// import createStockAdjustmentSchema from './create-form'
import { setStockAdjustmentData } from '@/redux-store/slices/StockAdjustmentSlice'

const AddPurchaseOrderAction = ({ tableData, setImportedDataUpdatedData, OpenImportModel, setImportedDataFormik }: { tableData?: any, setImportedDataUpdatedData: (data: any[]) => void, OpenImportModel: () => void, setImportedDataFormik: (data: any[]) => void }) => {
  // States
  const router = useRouter()

  const dispatch = useDispatch()

  // const { stockAdjustmentValidationSchema, defaultValues } = createStockAdjustmentSchema

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






  const onSubmit = async (data: any) => {

    return false

    try {
      const response = await axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stock-adjust/add-adjustment`, data, {

          withCredentials: true,
        })
        .then(res => {
          toast.success('Stock Adjustment Added  Successfully!')

          // fetchStocks()
          setTimeout(() => {
            router.push('/apps/stock-adjustment');
          }, 2000);
        })
    } catch (error) {
      console.error('Error adding stock:', error)
      toast.error('Something went wrong!')
    }
  }




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


  const handleProductChange = async (selectedOption: any) => {

    if (!selectedOption) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get-product-by-id/${selectedOption.value}`,
        { withCredentials: true }
      );

      const productData = response.data.product;

      // Ensure valid numeric fields for calculations
      const mrp = Number(productData.mrp) || 0;

      // const newRow = {
      //   product: productData.product_name,
      //   unit: 1,
      //   batch_no: productData.batch_no || "",
      //   expiry_date: "", // User input
      //   mrp: mrp,
      //   quantity: 1, // Default value
      //   free_quantity: 0,
      //   purchase_to_retailer: 0, // User input
      //   discount_percentage: 0, // User input
      //   discount_amount: 0, // Auto-calculated
      //   base: 0, // Auto-calculated
      //   gst_percent: 0, // User input
      //   gst_amount: 0, // Auto-calculated
      //   amount: 0, // Auto-calculated (Base + GST)
      //   last_price: 0, // Auto-calculated (PTR + GST + Discount Amount)
      // };


      const newRow = {
        product: productData.product_name,
        unit: 1,
        batch_no: productData.batch_no || "",
        expiry_date: "", // User input
        mrp: mrp,
        quantity: 1,
        free_quantity: 0,
        purchase_to_retailer: 0, // User input
        discount_percentage: 0, // User input
        discount_amount: 0, // Auto-calculated
        base: 0, // Auto-calculated
        gst_percent: 0, // User input
        gst_amount: 0, // Auto-calculated
        amount: 0, // Auto-calculated (Base + GST)
        last_price: 0, // Auto-calculated (PTR + GST + Discount Amount)
        tcs_amount: 0,
      };

      const newRowTwo = {
        product: productData._id,
        unit: 1,
        batch_no: productData.batch_no || "",
        expiry_date: "", // User input
        mrp: mrp,
        quantity: 1,
        free_quantity: 0,
        purchase_to_retailer: 0, // User input
        discount_percentage: 0, // User input
        discount_amount: 0, // Auto-calculated
        base: 0, // Auto-calculated
        gst_percent: 0, // User input
        gst_amount: 0, // Auto-calculated
        amount: 0, // Auto-calculated (Base + GST)
        last_price: 0, // Auto-calculated (PTR + GST + Discount Amount)
        tcs_amount: 0
      };


      console.log("newRowTwo", newRowTwo)

      // Update the table rows with the new product data
      setTableRows((prevRows: any) => [...prevRows, newRow]);
      setTableRowsProduct((prevRows: any) => [...prevRows, newRowTwo]);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  console.log("tableRows", tableRows)



  const handleInputChange = (index: number, field: string, value: number) => {
    setTableRows((prevRows: any) => {
      const updatedRows = [...prevRows];

      updatedRows[index][field] = value;

      // Retrieve and calculate values for the current row
      const quantity = Number(updatedRows[index].quantity) || 1;
      const purchase_to_retailer = Number(updatedRows[index].purchase_to_retailer) || 0;
      const discountPercentage = Number(updatedRows[index].discount_percentage) || 0;
      const gstPercent = Number(updatedRows[index].gst) || 0;

      // Calculate Discount Amount (PTR * Quantity * Discount Percentage)
      const discountAmount = (purchase_to_retailer * quantity * discountPercentage) / 100;

      updatedRows[index].discount_amount = isNaN(discountAmount) ? 0 : discountAmount;

      // Calculate Base (PTR * Quantity - Discount Amount)
      const base = (purchase_to_retailer * quantity) - updatedRows[index].discount_amount;

      updatedRows[index].base = isNaN(base) ? 0 : base;

      // Calculate GST Amount (Base * GST%)
      const gstAmount = (base * gstPercent) / 100;

      updatedRows[index].gst_amount = isNaN(gstAmount) ? 0 : gstAmount;

      // Calculate Amount (Base + GST Amount)
      const amount = base + gstAmount;

      updatedRows[index].amount = isNaN(amount) ? 0 : amount;

      // Calculate Last Purchase
      // PTR - Discount Amount + GST Amount if Discount Percentage > 0
      // PTR + GST Amount otherwise
      const discountPerQuantity = discountAmount / quantity;
      const purchasePrice = purchase_to_retailer - discountPerQuantity;
      const lastPriceGst = (purchasePrice * gstPercent) / 100;

      console.log("lastPurchase.discountPerQuantity", discountPerQuantity)
      console.log("lastPurchase.purchasePrice", purchasePrice)
      console.log("lastPurchase.lastPriceGst", lastPriceGst)

      const lastPurchase = discountPercentage > 0
        ? purchasePrice + lastPriceGst
        : purchase_to_retailer + lastPriceGst;


      updatedRows[index].last_price = isNaN(lastPurchase) ? 0 : lastPurchase;

      const totalRoundOFf = Math.round(amount);

      updatedRows[index].tcs_amount = isNaN(totalRoundOFf) ? 0 : totalRoundOFf;

      // setImportedDataFormik(updatedRows)

      setImportedDataFormik(updatedRows)

      console.log("updatedRows", updatedRows)

      return updatedRows;
    });
  };





  const { totalBase, totalGST, totalQuantity, totalAmountFinal, totalTCS } = useMemo(() => {
    let totalBase = 0;
    let totalGST = 0;
    let totalQuantity = 0;
    let totalAmountFinal = 0;
    let totalTCS = 0;

    tableRows.forEach((row: any) => {
      totalBase += row.base;
      totalGST += row.gst_amount;
      totalQuantity += row.quantity;
    });

    // Total amount is the sum of base + GST
    totalAmountFinal = totalBase + totalGST;

    // Assuming TCS is 1% of the total amount
    // totalTCS = totalAmountFinal
    totalAmountFinal = totalBase + totalGST;

    totalTCS = Math.round(totalAmountFinal);

    return { totalBase, totalGST, totalQuantity, totalAmountFinal, totalTCS };
  }, [tableRows]);



  const [dateTime, setDateTime] = useState<Date | null>(new Date());

  const [adjustmentType, setAdjustmentType] = useState<number | string>('')
  const [adjustmentDue, setAdjustmentDue] = useState<number | string>('')



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
        title='Import Porducts'
        titleTypographyProps={{
          variant: 'h5',
          color: 'primary'
        }}
      />
      <CardContent className='sm:!p-12'>
        {/* onSubmit={handleSubmit(onSubmit)} */}
        <form >

          <Card className='mt-4'>

            <CardContent className='sm:!p-12'>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <FormControl fullWidth className='mbe-4'>
                    {/* <InputLabel id='adjustment-due-select'>Search Product For Adjustment</InputLabel> */}
                    <ReactSelect
                      id='adjustment-due-select'
                      options={productOption}
                      value={productValue}

                      onChange={handleProductChange}

                      placeholder='Search Products for Purchase Order'

                    />
                    {/* <FormHelperText className='text-red-600'>{errors?.productDetails?.message as string}</FormHelperText> */}

                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>

                  <div className='flex justify-end gap-4 flex-col items-start sm:flex-row sm:items-center'>
                    <Button variant='contained' onClick={() => {
                      OpenImportModel()
                    }} className='is-full sm:is-auto'>
                      Import Products
                    </Button>
                  </div>
                </Grid>


                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell align='center'>Product</TableCell>
                        <TableCell align='center'>Unit</TableCell>
                        <TableCell align='center' >Batch</TableCell>
                        <TableCell align='center'>Expiry Date</TableCell>
                        <TableCell align='center'>MRP</TableCell>
                        <TableCell align='center'>Quantity</TableCell>
                        <TableCell align='center'>Free Qty</TableCell>
                        <TableCell align='center'>PTR</TableCell>
                        <TableCell align='center'>Discount%</TableCell>
                        <TableCell align='center'>Discount Amt</TableCell>
                        <TableCell align='center'>BASE</TableCell>
                        <TableCell align='center'>GST</TableCell>
                        <TableCell align='center'>Amount</TableCell>
                        <TableCell align='center'>Last Purchase</TableCell>
                        <TableCell align='center'>Action</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {tableRows.map((row: any, index: any) => {
                        // Calculate Discount Amount, Base, and Total Amount
                        const discountAmt = (row.purchase_to_retailer * row.quantity * row.discount_percentage) / 100 || 0.00;
                        const base = row.purchase_to_retailer * row.quantity - discountAmt || 0.00;

                        // const amount = base + discountAmt + row.gst || 0.00;
                        const amount = base + ((base) * (row.gst / 100)) || 0.00;


                        return (
                          <TableRow key={index}>
                            <TableCell align='center'>{index + 1}</TableCell>
                            <TableCell align='center'>{row.product}</TableCell>

                            {/* Unit Input */}
                            <TableCell align='center'>
                              <TextField
                                className="w-[60px]"
                                type="number"
                                value={row.unit}
                                onChange={(e) => handleInputChange(index, 'unit', parseFloat(e.target.value))}
                              />
                            </TableCell>

                            {/* Batch Input */}
                            <TableCell align='center'>
                              <TextField
                                className="min-w-[90px]"
                                type="text"
                                value={row.batch_no}
                                onChange={(e: any) => handleInputChange(index, 'batch_no', e.target.value)}
                              />
                            </TableCell>

                            {/* Expiry Date Input */}
                            <TableCell align='center'>
                              <TextField

                                className="min-w-[80px]"
                                placeholder='02/25'
                                type="text"
                                value={row.expiry_date}
                                onChange={(e: any) => handleInputChange(index, 'expiry_date', e.target.value)}
                              />
                            </TableCell>

                            {/* MRP Input */}
                            <TableCell align='center'>
                              <TextField
                                className="min-w-[80px]"
                                type="number"
                                value={row.mrp}
                                onChange={(e) => handleInputChange(index, 'mrp', parseFloat(e.target.value))}
                              />
                            </TableCell>

                            {/* Quantity Input */}
                            <TableCell align='center'>
                              <TextField
                                className="min-w-[60px]"
                                type="number"
                                value={row.quantity}
                                onChange={(e) => handleInputChange(index, 'quantity', parseFloat(e.target.value))}
                              />
                            </TableCell>

                            {/* Free Qty Input */}
                            <TableCell align='center'>
                              <TextField
                                className="min-w-[60px]"
                                type="number"
                                value={row.free_quantity}
                                onChange={(e) => handleInputChange(index, 'free_quantity', parseFloat(e.target.value))}
                              />
                            </TableCell>

                            {/* PTR Input */}
                            <TableCell align='center'>
                              <TextField
                                className="min-w-[90px]"
                                type="number"
                                value={row.purchase_to_retailer}
                                onChange={(e) => handleInputChange(index, 'purchase_to_retailer', parseFloat(e.target.value))}
                              />
                            </TableCell>

                            {/* Discount Percentage Input */}
                            <TableCell align='center'>
                              <TextField
                                className="min-w-[60px]"
                                type="number"
                                value={row.discount_percentage}
                                onChange={(e) => handleInputChange(index, 'discount_percentage', parseFloat(e.target.value))}
                              />
                            </TableCell>

                            {/* Discount Amt - Calculated */}
                            <TableCell align='center' >{discountAmt.toFixed(2)}</TableCell>

                            {/* BASE - Calculated */}
                            <TableCell align='center'>{base.toFixed(2)}</TableCell>

                            {/* GST Input */}
                            <TableCell align='center'>
                              <TextField
                                className="min-w-[60px]"
                                type="number"
                                value={row.gst}
                                onChange={(e) => handleInputChange(index, 'gst', parseFloat(e.target.value))}
                              />
                            </TableCell>

                            {/* Amount - Calculated */}
                            <TableCell align='center'>{amount.toFixed(2)}</TableCell>

                            {/* Last Purchase - Calculated */}
                            <TableCell align="center">{row.last_price.toFixed(2)}</TableCell>

                            {/* Action Button */}
                            <TableCell align='center'>
                              <Button
                                onClick={() => {
                                  setTableRows(tableRows.filter((_: any, i: any) => i !== index));
                                }}
                              >
                                <i className="ri-delete-bin-2-fill text-primary"></i>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}

                      {/* Total Amount Row */}

                    </TableBody>
                  </Table>
                </TableContainer>



              </Grid>
              <br />
              <br />
              <TableContainer component={Paper}>
                <Table>
                  {/* Table Header */}
                  <TableHead>
                    <TableRow>
                      <TableCell align="center"><Typography variant="body1">Base</Typography></TableCell>
                      <TableCell align="center"><Typography variant="body1">GST</Typography></TableCell>
                      <TableCell align="center"><Typography variant="body1">Total QTY</Typography></TableCell>
                      <TableCell align="center"><Typography variant="body1">Total</Typography></TableCell>
                      <TableCell align="center"><Typography variant="body1">TCS</Typography></TableCell>
                    </TableRow>
                  </TableHead>

                  {/* Table Body */}
                  <TableBody>
                    <TableRow>
                      {/* Base */}
                      <TableCell align="center">
                        <Typography variant="h6">{totalBase.toFixed(2)}</Typography>
                      </TableCell>

                      {/* GST */}
                      <TableCell align="center">
                        <Typography variant="h6">{totalGST.toFixed(2)}</Typography>
                      </TableCell>

                      {/* Total QTY */}
                      <TableCell align="center">
                        <Typography variant="h6">{totalQuantity}</Typography>
                      </TableCell>

                      {/* Total */}
                      <TableCell align="center">
                        <Typography variant="h6">{totalAmountFinal.toFixed(2)}</Typography>
                      </TableCell>

                      {/* TCS */}
                      <TableCell align="center">
                        <Typography variant="h6">{totalTCS.toFixed(2)}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>

          </Card>



          {/* <div className='flex justify-center items-center mt-4'>
            <Button type='submit' color='primary' variant='contained' className='capitalize'>
              Save
            </Button>
          </div> */}
        </form>
      </CardContent>
    </Card>
  )
}

export default AddPurchaseOrderAction
