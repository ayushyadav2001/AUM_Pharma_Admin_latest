'use client'
import { useEffect, useState, useMemo } from 'react'

import Image from 'next/image'

// React Imports

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import * as yup from 'yup'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'

import { saveAs } from 'file-saver'

// import { styled } from '@mui/material/styles'

import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import type { LinearProgressProps } from '@mui/material'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select
} from '@mui/material'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
// import type { ThemeColor } from '@core/types'
import axios from 'axios'

import { yupResolver } from '@hookform/resolvers/yup'

import { useForm } from 'react-hook-form'

import { toast } from 'react-toastify'

import { useDispatch } from 'react-redux'

import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from 'react-icons/fa'

import * as XLSX from 'xlsx'

import { jsPDF } from 'jspdf'

import type { UsersType } from '@/types/apps/userTypes'
import type { Locale } from '@configs/i18n'

// Component Imports
// import TableFilters from './TableFilters'

import AddUserDrawer from './AddUserDrawer'
import OptionMenu from '@core/components/option-menu'

// import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
// import { getInitials } from '@/utils/getInitials'

import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import FileUploaderSingleExcel from './ProductExcelUpload/FileUploaderSingle'

import ExcelImportTable from './ExcelImportTale'
import { setProductData } from '@/redux-store/slices/productSlice'
import Loader from '@/views/Loader/Loader'

import 'jspdf-autotable'

import DefaultProductImage from '@assets/defaultImages/default-prod.webp'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// type UsersTypeWithAction = UsersType & {
//   action?: string
// }

// type UserRoleType = {
//   [key: string]: { icon: string; color: string }
// }

// type UserStatusType = {
//   [key: string]: ThemeColor
// }

// Styled Components
// const Icon = styled('i')({})

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Vars
// const userRoleObj: UserRoleType = {
//   admin: { icon: 'ri-vip-crown-line', color: 'error' },
//   author: { icon: 'ri-computer-line', color: 'warning' },
//   editor: { icon: 'ri-edit-box-line', color: 'info' },
//   maintainer: { icon: 'ri-pie-chart-2-line', color: 'success' },
//   subscriber: { icon: 'ri-user-3-line', color: 'primary' }
// }

// const userStatusObj: UserStatusType = {
//   active: 'success',
//   pending: 'warning',
//   inactive: 'secondary'
// }

// Column Definitions
const columnHelper = createColumnHelper<any>()

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

const UserListTable = ({ tableData }: { tableData?: UsersType[] }) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})

  const [progress, setProgress] = useState<number>(10)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[tableData])
  const [globalFilter, setGlobalFilter] = useState('')

  const [importModal, setImportModel] = useState(false)

  const [showProressBar, setShowProgressBar] = useState(false)

  const [excelData, setExcelData] = useState([])

  const [loading, setLoading] = useState(false)

  const [vendors, setVendors] = useState([])

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendor/get-all-vendor`, {
        withCredentials: true
      })

      setVendors(response.data.data)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [importModal])

  // const OpenImportModel = () => {
  //   setImportModel(true)
  // }

  const closeImportModel = () => {
    setImportModel(false)
  }

  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('product_image', {
        header: 'Product Image',
        cell: ({ row }) => {
          const productImage = row.original.product_images[0]

          const imageUrl = productImage ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${productImage}` : DefaultProductImage

          return (
            <div className='flex items-center justify-center w-12 h-12'>
              <Image src={imageUrl} alt='Product Image' width={50} height={50} className='object-cover' priority />
            </div>
          )
        }
      }),
      columnHelper.accessor('product_type', {
        header: 'Product Type',
        cell: ({ row }) => <Typography>{row.original.product_type === 'drug' ? 'Drug' : 'OTC'}</Typography>
      }),
      columnHelper.accessor('product_code', {
        header: 'Product ID',
        cell: ({ row }) => <Typography>{row.original.product_code}</Typography>
      }),

      // columnHelper.accessor('categories', {
      //   header: 'Category',
      //   cell: ({ row }) => <Typography>{row.original.categories?.name || 'N/A'}</Typography>
      // }),
      // columnHelper.accessor('sub_categories', {
      //   header: 'Sub Category',
      //   cell: ({ row }) => <Typography>{row.original.sub_categories?.name || 'N/A'}</Typography>
      // }),

      columnHelper.accessor('product_name', {
        header: 'Product Name',
        cell: ({ row }) => <Typography>{row.original.product_name}</Typography>
      }),

      // columnHelper.accessor('igst', {
      //   header: 'IGST',
      //   cell: ({ row }) => <Typography>{row.original.igst}</Typography>
      // }),
      // columnHelper.accessor('hsn', {
      //   header: 'HSN',
      //   cell: ({ row }) => <Typography>{row.original.hsn}</Typography>
      // }),

      columnHelper.accessor('manufacturer', {
        header: 'Manufacturer',
        cell: ({ row }) => <Typography>{row.original.manufacturer.name || 'NA'}</Typography>
      }),

      columnHelper.accessor('packaging', {
        header: 'Packaging',
        cell: ({ row }) => <Typography>{row.original.packaging.name || 'NA'}</Typography>
      }),

      columnHelper.accessor('packing_type', {
        header: 'Packing Type',
        cell: ({ row }) => <Typography>{row.original.packing_type.name || 'NA'}</Typography>
      }),

      columnHelper.accessor('alert_quantity', {
        header: 'Alert Quantity',
        cell: ({ row }) => <Typography>{row.original.alert_quantity ? row.original.alert_quantity : 'NA'}</Typography>
      }),

      // columnHelper.accessor('Schedule', {
      //   header: 'Schedule',
      //   cell: ({ row }) => <Typography>{row.original.Schedule}</Typography>
      // }),
      columnHelper.accessor('mrp', {
        header: 'mrp',
        cell: ({ row }) => <Typography>{row.original.mrp}</Typography>
      }),
      columnHelper.accessor('discount', {
        header: 'Discount',
        cell: ({ row }) => <Typography>{row.original.discount}</Typography>
      }),

      columnHelper.accessor('prescription_required', {
        header: 'Prescription Require',
        cell: ({ row }) => (
          <div className='flex items-center  justify-center'>
            <Chip
              variant='tonal'
              className='capitalize'
              label={row.original.prescription_required ? 'Yes' : 'No'}
              color={row.original.prescription_required ? 'success' : 'secondary'}
              size='small'
            />
          </div>
        )
      }),
      columnHelper.accessor('stock_management_required', {
        header: 'Stock Management Require',
        cell: ({ row }) => (
          <div className='flex items-center  justify-center'>
            <Chip
              variant='tonal'
              className='capitalize'
              label={row.original.stock_management_required ? 'Yes' : 'No'}
              color={row.original.stock_management_required ? 'success' : 'secondary'}
              size='small'
            />
          </div>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Chip
              variant='tonal'
              className='capitalize'
              label={row.original.status ? 'Active' : 'Inactive'}
              color={row.original.status ? 'success' : 'secondary'}
              size='small'
            />
          </div>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: () => (
          <div className='flex items-center gap-0.5'>
            <IconButton size='small'>
              <i className='ri-delete-bin-7-line text-textSecondary' />
            </IconButton>
            <IconButton size='small'>
              <Link href={getLocalizedUrl('/apps/user/view', locale as Locale)} className='flex'>
                <i className='ri-eye-line text-textSecondary' />
              </Link>
            </IconButton>
            <OptionMenu
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Download',
                  icon: 'ri-download-line'
                },
                {
                  text: 'Edit',
                  icon: 'ri-edit-box-line'
                }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: data as UsersType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  // const getAvatar = (params: Pick<UsersType, 'avatar' | 'fullName'>) => {
  //   const { avatar, fullName } = params

  //   if (avatar) {
  //     return <CustomAvatar src={avatar} skin='light' size={34} />
  //   } else {
  //     return (
  //       <CustomAvatar skin='light' size={34}>
  //         {getInitials(fullName as string)}
  //       </CustomAvatar>
  //     )
  //   }
  // }

  const handleExportPDF = () => {
    const headers = [
      'Product Image',
      'Category',
      'Sub Category',
      'Product ID',
      'Product Name',
      'MRP',
      'IGST',
      'HSN',
      'Manufacturer',
      'Composition',
      'Packing Type',
      'Packaging',
      'Schedule',
      'Usage',
      'About Salt',
      'Status'
    ]

    const rows = table.getRowModel().rows.map(row => {
      return row.getAllCells().map(cell => cell.getValue())
    })

    const doc: any = new jsPDF()

    doc?.autoTable({ head: [headers], body: rows })
    doc.save('products.pdf')
  }

  const handlePrint = () => {
    const tableElement = document.getElementById('table-to-print')

    if (!tableElement) {
      console.error('Table element not found')

      return
    }

    const printWindow = window.open('', '', 'height=600,width=800')

    printWindow?.document.write('<html><head><title>Print Table</title>')

    printWindow?.document.write('</head><body >')
    printWindow?.document.write('<h1>Table Print</h1>')
    printWindow?.document.write(tableElement.outerHTML) // Print the table HTML
    printWindow?.document.write('</body></html>')
    printWindow?.document.close()
    printWindow?.focus()
    printWindow?.print()
  }

  const handleExportExcel = () => {
    const headers = [
      'Product Image',
      'Category',
      'Sub Category',
      'Product ID',
      'Product Name',
      'MRP',
      'IGST',
      'HSN',
      'Manufacturer',
      'Composition',
      'Packing Type',
      'Packaging',
      'Schedule',
      'Usage',
      'About Salt',
      'Status'
    ]

    const rows = table.getRowModel().rows.map(row => {
      return row.getAllCells().map(cell => cell.getValue())
    })

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')

    XLSX.writeFile(workbook, 'products.xlsx')
  }

  const handleExportCSV = () => {
    const headers = [
      'Product Image',
      'Category',
      'Sub Category',
      'Product ID',
      'Product Name',
      'MRP',
      'IGST',
      'HSN',
      'Manufacturer',
      'Composition',
      'Packing Type',
      'Packaging',
      'Schedule',
      'Usage',
      'About Salt',
      'Status'
    ]

    const csvRows = []

    // Add the headers
    csvRows.push(headers.join(','))

    // Add the data
    table.getRowModel().rows.forEach(row => {
      const rowData = row
        .getAllCells()
        .map(cell => `"${cell.getValue()}"`)
        .join(',')

      csvRows.push(rowData)
    })

    // Create CSV blob and trigger download
    const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8' })

    saveAs(csvBlob, 'products.csv')
  }

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
              // setProgress(Math.round((event.loaded / event.total) * 100))

              const percent = Math.round((event.loaded / event.total) * 100)

              if (percent >= 100) {
                setProgress(100)
                setLoading(false)
              } else {
                setProgress(prevProgress => Math.max(prevProgress, percent))
              }
            }
          },
          withCredentials: true
        })
        .then((res: any) => {
          setProgress(100)
          setLoading(false)
          fetchProducts()

          setExcelData(res.data.data)

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

  const onSubmitInsert = async () => {
    try {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/insert-product-using-excel`,
          { data: excelData },
          { withCredentials: true }
        )
        .then((res: any) => {
          console.log('res', res)
          toast.success('Data Inserted Successfuly !')
          setImportModel(false)
        })

      // setImportModel(false)
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error uploading file :', error)
      toast.error('Something Went Wrong !')
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <Card>
        <CardHeader title='Products' className='pbe-4' />
        {/* <TableFilters setData={setData} tableData={tableData} /> */}
        <Divider />
        <div className='flex justify-between gap-4 p-4 flex-col items-start sm:flex-row sm:items-center'>
          <div className='flex justify-between gap-4  flex-col items-start sm:flex-row sm:items-center'>
            <Button
              color='secondary'
              variant='outlined'
              startIcon={<FaFileCsv size={16} className='text-xl' />}
              className='is-full sm:is-auto h-6 py-3'
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>

            <Button
              color='secondary'
              variant='outlined'
              startIcon={<FaFileExcel className='text-xl' size={16} />}
              className='is-full sm:is-auto h-6 py-3'
              onClick={handleExportExcel}
            >
              Export Excel
            </Button>

            <Button
              color='secondary'
              variant='outlined'
              startIcon={<FaPrint size={16} className='text-xl' />}
              className='is-full sm:is-auto h-6 py-3'
              onClick={handlePrint}
            >
              Print
            </Button>

            <Button
              color='secondary'
              variant='outlined'
              startIcon={<FaFilePdf size={16} className='text-xl' />}
              className='is-full sm:is-auto h-6 py-3'
              onClick={handleExportPDF}
            >
              Export PDF
            </Button>
          </div>

          <div className='flex items-center gap-x-4 max-sm:gap-y-4 is-full flex-col sm:is-auto sm:flex-row'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search Product'
              className='is-full sm:is-auto'
            />

            <Link href={`/${locale}/apps/products/add`}>
              <Button variant='contained' className='is-full sm:is-auto'>
                Add
              </Button>
            </Link>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table id='table-to-print' className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='ri-arrow-up-s-line text-xl' />,
                              desc: <i className='ri-arrow-down-s-line text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          className='border-bs'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' }
          }}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>
      <AddUserDrawer open={addUserOpen} handleClose={() => setAddUserOpen(!addUserOpen)} />

      <Dialog
        maxWidth='lg'
        disableEscapeKeyDown
        fullWidth
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            closeImportModel()
          }
        }}
        aria-labelledby='customized-dialog-title'
        open={importModal}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
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
            <Grid container spacing={12}>
              <Grid item xs={12}>
                <Grid container spacing={12}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth className='mbe-4'>
                      <InputLabel id='vendor-select'>Select Vendor</InputLabel>
                      <Select
                        fullWidth
                        defaultValue=''
                        label='Select Vendor'
                        onChange={(e: any) => {
                          setValue('vendor_id', e.target?.value)
                        }}
                        labelId='vendor-select'
                      >
                        {vendors?.map((vendor: any) => (
                          <MenuItem key={vendor._id} value={vendor._id}>
                            {vendor.name}
                          </MenuItem>
                        ))}
                      </Select>

                      {/* <FormHelperText className='text-red-600'>{errors?.vendor_id?.message}</FormHelperText> */}

                      <FormHelperText className='text-red-600'>
                        {typeof errors?.vendor_id?.message === 'string' ? errors.vendor_id.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* <InputLabel id='prod-image-select'>Select product image</InputLabel> */}
            <FormControl fullWidth className='mbe-4'>
              <div id='prod-image-select'>
                {!showProressBar ? (
                  <FileUploaderSingleExcel setValue={setValue} fieldName={'product_excel'} />
                ) : (
                  <div>
                    {' '}
                    <Grid container spacing={6}>
                      <Grid className='hidden' item xs={12}>
                        <LinearProgressWithLabel value={progress} />
                      </Grid>
                      {excelData && progress == 100 && (
                        <Grid item xs={12}>
                          <ExcelImportTable tableData={excelData} />
                        </Grid>
                      )}
                    </Grid>
                  </div>
                )}
              </div>

              {/* <FormHelperText className='text-red-600'>{errors.product_excel?.message}</FormHelperText> */}

              <FormHelperText className='text-red-600'>
                {typeof errors?.product_excel?.message === 'string' ? errors.product_excel.message : null}
              </FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogActions className='p-4 !pbs-4'>
            {/* <Button type='submit' variant='contained'>
              Import
            </Button> */}

            {!showProressBar && (
              <Button type='submit' variant='contained'>
                Import
              </Button>
            )}

            {progress == 100 && excelData && (
              <Button onClick={onSubmitInsert} type='button' color='primary' variant='contained'>
                Insert
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default UserListTable
