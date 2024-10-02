'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import ExcelJS from 'exceljs'

import {
  Card,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Typography,
  LinearProgress,
  Button
} from '@mui/material'

import type { LinearProgressProps } from '@mui/material'

import axios from 'axios'

import { yupResolver } from '@hookform/resolvers/yup'

import { useForm } from 'react-hook-form'

// import * as XLSX from 'xlsx';

import { saveAs } from 'file-saver'

import { toast } from 'react-toastify'

import { useDispatch } from 'react-redux'

import * as yup from 'yup'

import { setProductData } from '@/redux-store/slices/productSlice'
import FileUploaderSingleExcel from '../ProductExcelUpload/FileUploaderSingle'

import Loader from '@/views/Loader/Loader'

const LinearProgressWithLabel = (props: LinearProgressProps & { value: number }) => {
  return (
    <div className='flex items-center gap-2'>
      <div className='is-full'>
        <LinearProgress variant='determinate' {...props} />
      </div>
      <Typography variant='body2'>{`${Math.round(props.value)}%`}</Typography>
    </div>
  )
}

const ImportProduct = () => {
  const [excelData, setExcelData] = useState([
    {
      fieldName: 'product_code',
      headerName: 'Product Code',
      width: 20
    },
    {
      fieldName: 'product_type', // Added product_type
      headerName: 'Product Type',
      width: 20
    },
    {
      fieldName: 'label',
      headerName: 'Label',
      width: 20
    },
    {
      fieldName: 'quantity',
      headerName: 'Quantity',
      width: 20
    },
    {
      fieldName: 'product_images',
      headerName: 'Product Images',
      width: 30
    },
    {
      fieldName: 'product_name',
      headerName: 'Product Name',
      width: 30
    },
    {
      fieldName: 'manufacturer',
      headerName: 'Manufacturer',
      width: 25
    },
    {
      fieldName: 'manufacturer_address',
      headerName: 'Manufacturer Address',
      width: 25
    },
    {
      fieldName: 'packaging',
      headerName: 'Packaging',
      width: 20
    },
    {
      fieldName: 'packing_type',
      headerName: 'Packing Type',
      width: 20
    },
    {
      fieldName: 'product_form',
      headerName: 'Product Form',
      width: 20
    },
    {
      fieldName: 'mrp',
      headerName: 'MRP',
      width: 15
    },
    {
      fieldName: 'discount',
      headerName: 'Discount',
      width: 15
    },
    {
      fieldName: 'prescription_required',
      headerName: 'Prescription Required',
      width: 20
    },
    {
      fieldName: 'stock_management_required',
      headerName: 'Stock Management Required',
      width: 25
    },
    {
      fieldName: 'alert_quantity',
      headerName: 'Alert Quantity',
      width: 20
    },
    {
      fieldName: 'introduction',
      headerName: 'Introduction',
      width: 25
    },
    {
      fieldName: 'description',
      headerName: 'Description',
      width: 30
    },
    {
      fieldName: 'salt_composition',
      headerName: 'Salt Composition',
      width: 25
    },
    {
      fieldName: 'benefits',
      headerName: 'Benefits',
      width: 25
    },
    {
      fieldName: 'use_of',
      headerName: 'Use Of',
      width: 20
    },
    {
      fieldName: 'how_to_use',
      headerName: 'How To Use',
      width: 25
    },
    {
      fieldName: 'safety_advice',
      headerName: 'Safety Advice',
      width: 25
    },
    {
      fieldName: 'ingredients',
      headerName: 'Ingredients',
      width: 25
    },
    {
      fieldName: 'primary_use',
      headerName: 'Primary Use',
      width: 20
    },
    {
      fieldName: 'storage',
      headerName: 'Storage',
      width: 20
    },
    {
      fieldName: 'common_side_effects',
      headerName: 'Common Side Effects',
      width: 30
    },
    {
      fieldName: 'alcohol_interaction',
      headerName: 'Alcohol Interaction',
      width: 30
    },
    {
      fieldName: 'pregnancy_interaction',
      headerName: 'Pregnancy Interaction',
      width: 30
    },
    {
      fieldName: 'lactation_interaction',
      headerName: 'Lactation Interaction',
      width: 30
    },
    {
      fieldName: 'driving_interaction',
      headerName: 'Driving Interaction',
      width: 30
    },
    {
      fieldName: 'kidney_interaction',
      headerName: 'Kidney Interaction',
      width: 30
    },
    {
      fieldName: 'liver_interaction',
      headerName: 'Liver Interaction',
      width: 30
    },
    {
      fieldName: 'if_miss', // Added if_miss
      headerName: 'If Missed',
      width: 25
    },
    {
      fieldName: 'country_of_origin',
      headerName: 'Country Of Origin',
      width: 20
    },
    {
      fieldName: 'faqs',
      headerName: 'FAQs',
      width: 30
    },
    {
      fieldName: 'fact_box', // Added fact_box (can display the label-value pairs in a structured way)
      headerName: 'Fact Box',
      width: 30
    }
  ])

  const [loading, setLoading] = useState(false)

  const [progress, setProgress] = useState<number>(0)

  const router = useRouter()

  const importProductSchema = yup.object().shape({
    product_excel: yup.mixed().required('Excel is required')
  })

  const importProductDefaultValues = {
    product_excel: null
  }

  const {
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<any>({
    resolver: yupResolver(importProductSchema),
    defaultValues: importProductDefaultValues
  })

  const dispatch = useDispatch()

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get-all-product`, {
        withCredentials: true
      })

      dispatch(setProductData(response.data.products)) // Ensure `setData` action is correctly set
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: any) => {
    try {
      setLoading(true) // Set loading state to true

      // Create a FormData object
      const formData = new FormData()

      formData.append('product_excel', data.product_excel)

      // Make API call with progress tracking
      await axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/insert-product-using-excel`, formData, {
          withCredentials: true, // Send cookies along with the request
          headers: {
            'Content-Type': 'multipart/form-data' // Set content type to multipart/form-data
          },
          onUploadProgress: event => {
            if (event.total) {
              const percent = Math.round((event.loaded / event.total) * 100)

              if (percent >= 100) {
                setProgress(100)
              } else {
                setProgress(prevProgress => Math.max(prevProgress, percent))
              }
            }
          }
        })
        .then((res: any) => {
          setLoading(false) // Set loading state to false after the response

          if (res.data.errorData && res.data.errorData.length > 0) {
            // Handle error case
            toast.error('Some products failed to insert. Please check the errors.')
            console.error('Error Data:', res.data.errorData)
          } else {
            // Success case
            fetchProducts() // Fetch updated product list
            toast.success('Products Inserted Successfully!')
            router.push('/apps/products') // Redirect after successful insertion
            setExcelData(res.data.data) // Set Excel data if necessary
          }
        })
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error uploading file:', error)
      toast.error('Failed to upload the file. Please try again.') // Notify user of failure
      setLoading(false) // Ensure loading state is reset on error
    }
  }

  // const exportToExcel = (headers: any, fileName: string) => {
  //   // Create a new workbook
  //   const wb = XLSX.utils.book_new();

  //   // Create an array of headers for the worksheet
  //   const headerRow = headers.map((header: any) => header.headerName);

  //   // Create a worksheet with headers only
  //   const wsData = [headerRow];
  //   const ws = XLSX.utils.aoa_to_sheet(wsData);

  //   // Set column widths based on the headers
  //   ws['!cols'] = headers.map((header: any) => ({ width: header.width }));

  //   // Append the worksheet to the workbook
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   // Generate buffer
  //   const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  //   // Save to file
  //   saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${fileName}.xlsx`);
  // };

  const exportToExcel = async (headers: any, fileName: string) => {
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Sheet1')

    // Add headers to the worksheet
    worksheet.addRow(headers.map((header: any) => header.headerName))

    // Set column widths
    headers.forEach((header: any, index: number) => {
      worksheet.getColumn(index + 1).width = header.width
    })

    // Style the header row
    const headerRow = worksheet.getRow(1)

    headerRow.eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF008000' } // Green background
      }
      cell.font = {
        color: { argb: 'FFFFFFFF' }, // White text
        bold: true
      }
      cell.alignment = { horizontal: 'center' }
    })

    // Generate buffer and save file
    const buffer = await workbook.xlsx.writeBuffer()

    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${fileName}.xlsx`)
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <Card>
        <CardHeader title='Import Products' className='pbe-4' />
        <Divider />
        <div className=' gap-4 p-5 flex-col items-start sm:flex-row sm:items-center'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={9} justifyContent='center' alignItems='center'>
                <LinearProgressWithLabel value={progress} />
              </Grid>
              <Grid item xs={12} md={3} justifyContent='center' alignItems='center'>
                <Button
                  onClick={() => exportToExcel(excelData, 'products_sample')}
                  startIcon={<i className='ri-download-2-line' />}
                  className='cursor-pointer  w-full bg-primary text-white font-semibold py-2 px-4 rounded hover:bg-gradient-to-l hover:from-green-500 hover:to-green-500 transition duration-300'
                  variant='contained'
                  type='button'
                >
                  Download template file
                </Button>
              </Grid>

              <Grid container spacing={2}>
                {/* Informative UI for fields */}
                <Grid item xs={12}>
                  <Typography variant='h6' className='mb-2'>
                    Upload Product Excel
                  </Typography>
                  <Typography variant='body2' className='mb-4'>
                    Please ensure your Excel file contains the necessary product information in the specified format.
                    The required fields include:
                  </Typography>

                  {/* Required Fields List */}
                  <ul className='list-disc pl-5 mb-4'>
                    <li>
                      <strong>Product Code:</strong>
                      <span className='ml-2'>
                        {`    A unique identifier for each product, e.g., "P12345". Ensure this code is not duplicated in your
                        product list.`}
                      </span>
                    </li>
                    <li>
                      <strong>Product Type:</strong>
                      <span className='ml-2'>
                        {` Indicate the type of product as either "drug" or "otc" (over-the-counter). This categorization
                        helps in managing inventory.`}
                      </span>
                    </li>
                    <li>
                      <strong>Label:</strong>
                      <span className='ml-2'>
                        {`   Specify the label for the product, such as "ADD TO CART", "NOT FOR SALE", or other relevant tags
                        that describe its availability.`}
                      </span>
                    </li>
                    <li>
                      <strong>Quantity:</strong>
                      <span className='ml-2'>
                        {`    Enter the quantity in appropriate units, e.g., "10 ml", "10 tablets", "1KG". Make sure to match
                        the format that your product is sold in.`}
                      </span>
                    </li>
                    <li>
                      <strong>Product Images:</strong>
                      <span className='ml-2'>
                        {`   Provide an array of image paths for the product images, such as`}
                        <code>
                          {[
                            '/uploads/Medicine/1_2.jpg',
                            '/uploads/Medicine/1_1.jpg',
                            '/uploads/Medicine/1_3.jpg',
                            '/uploads/Medicine/1_4.jpg'
                          ]}
                        </code>
                        . Ensure images are high quality and represent the product accurately.
                      </span>
                    </li>
                    <li>
                      <strong>Product Name:</strong>
                      <span className='ml-2'>
                        {`    The name of the product as it should appear to customers, e.g., "Aspirin 500mg". Ensure that it
                        is descriptive and clear.`}
                      </span>
                    </li>
                    <li>
                      <strong>Manufacturer:</strong>
                      <span className='ml-2'>
                        {`     Select the manufacturer from the Manufacturer Master. If creating a new manufacturer, include
                        both the name (e.g., "ABC Pharmaceuticals") and its address.`}
                      </span>
                    </li>
                    <li>
                      <strong>Packaging:</strong>
                      <span className='ml-2'>
                        {`   Choose the packaging type from the Packaging Master, which defines how the product is packaged
                        (e.g., "Bottle", "Box").`}
                      </span>
                    </li>
                    <li>
                      <strong>Packing Type:</strong>
                      <span className='ml-2'>
                        {`      Specify the packing type from the Packing Type Master, which may include options like "Blister",
                        "Strip", etc.`}
                      </span>
                    </li>
                    <li>
                      <strong>Product Form:</strong>
                      <span className='ml-2'>
                        {`    Select the product form from the Product Form Master, such as "Tablet", "Syrup", "Cream", etc.`}
                      </span>
                    </li>
                    <li>
                      <strong>MRP:</strong>
                      <span className='ml-2'>
                        {`    Enter the Maximum Retail Price as a number (e.g., "999" or "100.34"). This is the price
                        customers will pay.`}
                      </span>
                    </li>
                    <li>
                      <strong>Discount:</strong>
                      <span className='ml-2'>
                        {`   Specify any discount percentage (e.g., "2" for 2%). This will be applied to the MRP for sales.`}
                      </span>
                    </li>
                    <li>
                      <strong>Prescription Required:</strong>
                      <span className='ml-2'>
                        {` Indicate whether a prescription is needed for this product. Use "true" if required, otherwise
                        use "false".`}
                      </span>
                    </li>
                    <li>
                      <strong>Stock Management Required:</strong>
                      <span className='ml-2'>
                        {`  Specify if stock management is needed for this product. Use "true" to enable stock tracking,
                        otherwise "false".`}
                      </span>
                    </li>
                    <li>
                      <strong>Alert Quantity:</strong>
                      <span className='ml-2'>
                        If stock management is enabled, enter the alert quantity to notify when stock is low. If not,
                        set this to 0.
                      </span>
                    </li>
                    {/* Additional Fields */}
                    <li>
                      <strong>
                        Introduction, Description, Salt Composition, Benefits, Use Of, How To Use, Safety Advice,
                        Ingredients, Primary Use, Storage, Common Side Effects, Alcohol Interaction, Pregnancy
                        Interaction, Lactation Interaction, Driving Interaction, Kidney Interaction, Liver Interaction,
                        If Missed, Country Of Origin:
                      </strong>
                      <span className='ml-2'>
                        Provide detailed information in these fields as required, ensuring clarity and completeness for
                        each aspect of the product.
                      </span>
                    </li>
                    <li>
                      <strong>FAQs:</strong>
                      <span className='ml-2'>
                        List common questions and answers in a clear format, e.g.,
                        <code>How to take this medicine?: You should take it after meals;</code>
                        <code>What are the side effects?: Nausea, Dizziness;</code>
                        <code>What should I avoid while taking this medicine?: Avoid alcohol.</code>
                      </span>
                    </li>
                    <li>
                      <strong>Fact Box:</strong>
                      <span className='ml-2'>
                        Provide key information in a compact format, e.g.,
                        <code>Manufacturer: ABC Pharmaceuticals; Dosage: 1 Tablet Daily;</code>
                      </span>
                    </li>
                  </ul>

                  <Typography variant='body2'>
                    Ensure the file is in .xlsx format and does not exceed 5MB in size. If you have any questions,
                    please refer to the documentation or contact support.
                  </Typography>
                </Grid>
              </Grid>

              <Grid item xs={12} md={12}>
                <FormControl fullWidth className='mbe-4'>
                  <FileUploaderSingleExcel setValue={setValue} fieldName={'product_excel'} />
                  <FormHelperText className='text-red-600'>
                    {typeof errors?.product_excel?.message === 'string' ? errors.product_excel.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            <Button type='submit' variant='contained'>
              Import
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}

export default ImportProduct
