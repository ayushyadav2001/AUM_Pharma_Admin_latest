"use client"

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import ExcelJS from 'exceljs';


import { Card, CardHeader, Divider, FormControl, FormHelperText, Grid, Typography, LinearProgress, Button } from '@mui/material'

import type { LinearProgressProps } from '@mui/material'


import axios from 'axios'

import { yupResolver } from '@hookform/resolvers/yup'

import { useForm } from 'react-hook-form'

// import * as XLSX from 'xlsx';

import { saveAs } from 'file-saver';

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
      "fieldName": "product_code",
      "headerName": "Product Code",
      "width": 20
    },
    {
      "fieldName": "product_image",
      "headerName": "Product Image",
      "width": 20
    },
    {
      "fieldName": "product_name",
      "headerName": "Product Name",
      "width": 30
    },
    {
      "fieldName": "category",
      "headerName": "Category",
      "width": 20
    },
    {
      "fieldName": "sub_category",
      "headerName": "Sub Category",
      "width": 20
    },
    {
      "fieldName": "manufacturer",
      "headerName": "Manufacturer",
      "width": 25
    },
    {
      "fieldName": "manufacturer_address",
      "headerName": "Manufacturer Address",
      "width": 30
    },
    {
      "fieldName": "packaging",
      "headerName": "Packaging",
      "width": 20
    },
    {
      "fieldName": "packing_type",
      "headerName": "Packing Type",
      "width": 20
    },
    {
      "fieldName": "mrp",
      "headerName": "MRP",
      "width": 15
    },
    {
      "fieldName": "discount",
      "headerName": "Discount",
      "width": 15
    },
    {
      "fieldName": "prescription_required",
      "headerName": "Prescription Required",
      "width": 20
    },
    {
      "fieldName": "stock_management_required",
      "headerName": "Stock Management Required",
      "width": 25
    },
    {
      "fieldName": "alert_quantity",
      "headerName": "Alert Quantity",
      "width": 20
    },
    {
      "fieldName": "introduction",
      "headerName": "Introduction",
      "width": 25
    },
    {
      "fieldName": "description",
      "headerName": "Description",
      "width": 30
    },
    {
      "fieldName": "salt_composition",
      "headerName": "Salt Composition",
      "width": 25
    },
    {
      "fieldName": "benefits",
      "headerName": "Benefits",
      "width": 25
    },
    {
      "fieldName": "use_of",
      "headerName": "Use Of",
      "width": 20
    },
    {
      "fieldName": "how_to_use",
      "headerName": "How To Use",
      "width": 25
    },
    {
      "fieldName": "safety_advice",
      "headerName": "Safety Advice",
      "width": 25
    },
    {
      "fieldName": "ingredients",
      "headerName": "Ingredients",
      "width": 25
    },
    {
      "fieldName": "primary_use",
      "headerName": "Primary Use",
      "width": 20
    },
    {
      "fieldName": "storage",
      "headerName": "Storage",
      "width": 20
    },
    {
      "fieldName": "common_side_effects",
      "headerName": "Common Side Effects",
      "width": 30
    },
    {
      "fieldName": "alcohol_interaction",
      "headerName": "Alcohol Interaction",
      "width": 30
    },
    {
      "fieldName": "pregnancy_interaction",
      "headerName": "Pregnancy Interaction",
      "width": 30
    },
    {
      "fieldName": "lactation_interaction",
      "headerName": "Lactation Interaction",
      "width": 30
    },
    {
      "fieldName": "driving_interaction",
      "headerName": "Driving Interaction",
      "width": 30
    },
    {
      "fieldName": "kidney_interaction",
      "headerName": "Kidney Interaction",
      "width": 30
    },
    {
      "fieldName": "liver_interaction",
      "headerName": "Liver Interaction",
      "width": 30
    },
    {
      "fieldName": "country_of_origin",
      "headerName": "Country Of Origin",
      "width": 20
    },
    {
      "fieldName": "faqs",
      "headerName": "FAQs",
      "width": 30
    }
  ]);


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
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get-all-product`, { withCredentials: true })

      dispatch(setProductData(response.data.products)) // Ensure `setData` action is correctly set
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }



  const onSubmit = async (data: any) => {
    try {
      // Create FormData object

      setLoading(true)

      const formData = new FormData()


      formData.append('product_excel', data.product_excel)


      // Make API call with progress tracking
      await axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/insert-product-using-excel`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
          onUploadProgress: event => {
            if (event.total) {


              // setProgress(Math.round((event.loaded / event.total) * 100))

              const percent = Math.round((event.loaded / event.total) * 100)

              if (percent >= 100) {
                setProgress(100)
                setLoading(false)
              } else {
                setProgress(prevProgress => Math.max(prevProgress, percent))
              }
            }
          }
        })
        .then((res: any) => {



          if (res.data.errorData.length > 0) {
            // Handle error case
            setLoading(false);
            toast.error("Some products failed to insert. Please check the errors.");

            // Optionally log or display error details
            console.error("Error Data:", res.data.errorData);

            // You can choose to show these errors to the user
            // e.g., setErrorData(res.data.errorData);
          } else {
            setProgress(100)
            setLoading(false)
            fetchProducts()
            toast.success("Products Inserted Successfully !")
            router.push('/apps/products')

            setExcelData(res.data.data)
          }

        })


    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error uploading file :', error)

      setLoading(false)
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
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Add headers to the worksheet
    worksheet.addRow(headers.map((header: any) => header.headerName));

    // Set column widths
    headers.forEach((header: any, index: number) => {
      worksheet.getColumn(index + 1).width = header.width;
    });

    // Style the header row
    const headerRow = worksheet.getRow(1);

    headerRow.eachCell((cell) => {

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF008000' } // Green background
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' }, // White text
        bold: true
      };
      cell.alignment = { horizontal: 'center' };
    });

    // Generate buffer and save file
    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${fileName}.xlsx`);
  };


  if (loading) {
    return <Loader />
  }



  return (
    <div>
      <Card >


        <CardHeader title='Import Products' className='pbe-4' />
        <Divider />
        <div className=' gap-4 p-5 flex-col items-start sm:flex-row sm:items-center'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={9} justifyContent="center" alignItems="center">

                <LinearProgressWithLabel value={progress} />

              </Grid>
              <Grid item xs={12} md={3} justifyContent="center" alignItems="center">

                <Button onClick={() => exportToExcel(excelData, "products_sample")} startIcon={<i className='ri-download-2-line' />} className="cursor-pointer  w-full bg-primary text-white font-semibold py-2 px-4 rounded hover:bg-gradient-to-l hover:from-green-500 hover:to-green-500 transition duration-300" variant='contained' type='button'>
                  Download template file
                </Button>


              </Grid>

              <Grid item xs={12} md={12}>
                <FormControl fullWidth className="mbe-4">
                  <FileUploaderSingleExcel setValue={setValue} fieldName={'product_excel'} />
                  <FormHelperText className="text-red-600">
                    {typeof errors?.product_excel?.message === 'string' ? errors.product_excel.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>






            <Button type="submit" variant="contained">
              Import
            </Button>



          </form>

        </div>
      </Card>
    </div >
  )
}

export default ImportProduct

