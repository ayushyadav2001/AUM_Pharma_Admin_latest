"use client"
import React, { useEffect, useState } from 'react'

import { Card, CardHeader, Divider, FormControl, FormHelperText, Grid, MenuItem, Typography, Select, LinearProgress, InputLabel, Button } from '@mui/material'

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
import ExcelImportTable from '../ExcelImportTale'
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




  const [showProressBar, setShowProgressBar] = useState(false)

  const [excelData, setExcelData] = useState([])

  const [loading, setLoading] = useState(false)

  const [vendors, setVendors] = useState([])

  const [selectedVendor, setSelectedVendor] = useState<string>('');

  const [progress, setProgress] = useState<number>(10)

  const [vendorFormat, setVendorFormat] = useState(null);


  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendor/get-all-vendor`)

      setVendors(response.data.data)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])
  const token = sessionStorage.getItem('authToken');



  const fetchVendorFormat = async (vendorId: any) => {

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    if (!vendorId) return;

    setLoading(true);

    try {

      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendor/get-format-by-vendorId/${vendorId}`, config);

      setVendorFormat(response.data.data.columns);
    } catch (error) {
      console.error('Error fetching vendor format:', error);

    } finally {
      setLoading(false);
    }
  };

  console.log("vendorFormat", vendorFormat)

  const importProductSchema = yup.object().shape({
    vendor_id: yup.string().required('Vendor is required'),
    product_excel: yup.mixed().required('Excel is required')
  })

  const importProductDefaultValues = {
    vendor_id: '',
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
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get-all-product`)

      dispatch(setProductData(response.data.products)) // Ensure `setData` action is correctly set
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  const onSubmitInsert = async () => {
    try {
      await axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/insert-product-using-excel`, { data: excelData }, {})
        .then((res: any) => {
          console.log('res', res)

          toast.success('Data Inserted Successfuly !')

        })

      // setImportModel(false)
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error uploading file :', error)
      toast.error('Something Went Wrong !')
    }
  }

  const onSubmit = async (data: any) => {
    try {
      // Create FormData object

      setLoading(true)

      const formData = new FormData()

      formData.append('vendor_id', data.vendor_id)
      formData.append('product_excel', data.product_excel) // Assuming single file upload
      setShowProgressBar(true)

      // Make API call with progress tracking
      await axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/uploadProductExcel`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
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

          setExcelData(res.data.data)
          console.log('res.data.data', res.data.data)

          // setShowProgressBar(false)
        })

      // setImportModel(false)
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error uploading file :', error)
      setShowProgressBar(false)
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
              <Grid item xs={12} md={6}>
                <FormControl fullWidth className="mbe-4 ">
                  <InputLabel id="vendor-select">Select Vendor</InputLabel>
                  <Select
                    fullWidth
                    defaultValue=""
                    label="Select Vendor"
                    value={selectedVendor}
                    onChange={(e: any) => {
                      console.log('e', e);
                      setValue('vendor_id', e.target?.value);
                      setSelectedVendor(e.target?.value);
                      fetchVendorFormat(e?.target?.value)
                    }}
                    labelId="vendor-select"
                  >
                    {vendors?.map((vendor: any) => (
                      <MenuItem key={vendor._id} value={vendor._id}>
                        {vendor.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText className="text-red-600">
                    {typeof errors?.vendor_id?.message === 'string' ? errors.vendor_id.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {selectedVendor && (<Grid item xs={12} md={3}>

                <Button onClick={() => exportToExcel(vendorFormat, "vendor_format")} startIcon={<i className='ri-download-2-line' />} className="cursor-pointer  w-full bg-gradient-to-r from-green-500 to-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-gradient-to-l hover:from-green-500 hover:to-green-500 transition duration-300" variant='contained' type='submit'>
                  Download template file
                </Button>


              </Grid>)}
            </Grid>


            <FormControl fullWidth className="mbe-4">
              <div id="prod-image-select">
                {!showProressBar ? (
                  <FileUploaderSingleExcel setValue={setValue} fieldName={'product_excel'} />
                ) : (
                  <div>
                    <Grid container spacing={6}>
                      <Grid className={progress !== 100 ? '' : 'hidden'} item xs={12}>
                        <LinearProgressWithLabel value={progress} />
                      </Grid>
                      {excelData && progress === 100 && (
                        <Grid item xs={12}>
                          <ExcelImportTable tableData={excelData} />
                        </Grid>
                      )}
                    </Grid>
                  </div>
                )}
              </div>
              <FormHelperText className="text-red-600">
                {typeof errors?.product_excel?.message === 'string' ? errors.product_excel.message : null}
              </FormHelperText>
            </FormControl>

            {!showProressBar && (
              <Button type="submit" variant="contained">
                Import
              </Button>
            )}

            {progress === 100 && excelData && (
              <Button onClick={onSubmitInsert} type="button" color="primary" variant="contained">
                Insert
              </Button>
            )}
          </form>

        </div>
      </Card>
    </div >
  )
}

export default ImportProduct

