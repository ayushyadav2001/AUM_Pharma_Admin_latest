"use client"

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'


import { Card, CardHeader, Divider, FormControl, FormHelperText, Grid, Typography, LinearProgress, Button } from '@mui/material'

import type { LinearProgressProps } from '@mui/material'


import axios from 'axios'

import { yupResolver } from '@hookform/resolvers/yup'

import { useForm } from 'react-hook-form'
import * as XLSX from 'xlsx';

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
      "fieldName": "product_id",
      "headerName": "Product ID",
      "width": 20
    },
    {
      "fieldName": "product_name",
      "headerName": "Product Name",
      "width": 30
    },
    {
      "fieldName": "mrp",
      "headerName": "MRP",
      "width": 15
    },
    {
      "fieldName": "igst",
      "headerName": "igst",
      "width": 15
    },
    {
      "fieldName": "hsn",
      "headerName": "HSN",
      "width": 15
    },
    {
      "fieldName": "manufacturer",
      "headerName": "Manufacturer",
      "width": 25
    },
    {
      "fieldName": "composition",
      "headerName": "Composition",
      "width": 25
    },
    {
      "fieldName": "packing_type",
      "headerName": "Packing Type",
      "width": 20
    },
    {
      "fieldName": "packaging",
      "headerName": "Packaging",
      "width": 20
    },
    {
      "fieldName": "Schedule",
      "headerName": "Schedule",
      "width": 20
    },
    {
      "fieldName": "usage",
      "headerName": "Usage",
      "width": 20
    },
    {
      "fieldName": "about_salt",
      "headerName": "About Salt",
      "width": 30
    },
    {
      "fieldName": "mechanism_of_action",
      "headerName": "Mechanism of Action",
      "width": 30
    },
    {
      "fieldName": "pharmacokinets",
      "headerName": "Pharmacokinets",
      "width": 30
    },
    {
      "fieldName": "onset_of_action",
      "headerName": "Onset of Action",
      "width": 30
    },
    {
      "fieldName": "duration_of_action",
      "headerName": "Duration of Action",
      "width": 30
    },
    {
      "fieldName": "half_life",
      "headerName": "Half Life",
      "width": 20
    },
    {
      "fieldName": "side_effects",
      "headerName": "Side Effects",
      "width": 30
    },
    {
      "fieldName": "contra_indications",
      "headerName": "Contra-indications",
      "width": 30
    },
    {
      "fieldName": "special_precautions_while_taking",
      "headerName": "Special Precautions while taking",
      "width": 30
    },
    {
      "fieldName": "pregnancy_related_information",
      "headerName": "Pregnancy Related Information",
      "width": 30
    },
    {
      "fieldName": "product_and_alcohol_interaction",
      "headerName": "Product and Alcohol Interaction",
      "width": 30
    },
    {
      "fieldName": "old_age_related_information",
      "headerName": "Old Age Related Information",
      "width": 30
    },
    {
      "fieldName": "breast_feeding_related_information",
      "headerName": "Breast Feeding Related Information",
      "width": 30
    },
    {
      "fieldName": "children_related_information",
      "headerName": "Children Related Information",
      "width": 30
    },
    {
      "fieldName": "indications",
      "headerName": "Indications",
      "width": 30
    },
    {
      "fieldName": "interactions",
      "headerName": "Interactions",
      "width": 30
    },
    {
      "fieldName": "typical_dosage",
      "headerName": "Typical Dosage",
      "width": 20
    },
    {
      "fieldName": "storage_requirements",
      "headerName": "Storage Requirements",
      "width": 30
    },
    {
      "fieldName": "effects_of_missed_dosage",
      "headerName": "Effects of Missed Dosage",
      "width": 30
    },
    {
      "fieldName": "effects_of_overdose",
      "headerName": "Effects of Overdose",
      "width": 30
    },
    {
      "fieldName": "expert_advice",
      "headerName": "Expert Advice",
      "width": 30
    },
    {
      "fieldName": "how_to_use",
      "headerName": "How to Use",
      "width": 30
    },
    {
      "fieldName": "faqs",
      "headerName": "FAQs",
      "width": 30
    },

  ]
  )

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
            withCredentials: true,
          },
          onUploadProgress: event => {
            if (event.total) {
              console.log('event', event)

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
          console.log('res', res)
          setProgress(100)
          setLoading(false)
          fetchProducts()
          toast.success("Products Inserted Successfully !")
          router.push('/apps/products')

          setExcelData(res.data.data)
          console.log('res.data.data', res.data.data)


        })


    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error uploading file :', error)

      setLoading(false)
    }
  }

  const exportToExcel = (headers: any, fileName: string) => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Create an array of headers for the worksheet
    const headerRow = headers.map((header: any) => header.headerName);

    // Create a worksheet with headers only
    const wsData = [headerRow];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths based on the headers
    ws['!cols'] = headers.map((header: any) => ({ width: header.width }));

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate buffer
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Save to file
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${fileName}.xlsx`);
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

                <Button onClick={() => exportToExcel(excelData, "products_sample")} startIcon={<i className='ri-download-2-line' />} className="cursor-pointer  w-full bg-gradient-to-r from-green-500 to-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-gradient-to-l hover:from-green-500 hover:to-green-500 transition duration-300" variant='contained' type='button'>
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

