/* eslint-disable react-hooks/exhaustive-deps */
'use client'

// React Imports
import { useState, useMemo, useEffect, useCallback } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

import Typography from '@mui/material/Typography'

import IconButton from '@mui/material/IconButton'

import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'

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

// import dayjs from 'dayjs'

import { CardHeader, Chip, Divider } from '@mui/material'

import dayjs from 'dayjs'

import axios from 'axios'

import { toast } from 'react-toastify'

import { useDispatch } from 'react-redux'

import type { UsersType } from '@/types/apps/userTypes'
import type { Locale } from '@configs/i18n'

// Component Imports


// Util Imports

import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import ConfirmationDialogDelete from './DeleteCategoryModal'
import ConfirmationDialogStatusChange from './changeStatus'

import { setProductFormData } from '@/redux-store/slices/prductFormSlice'


declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}




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



// Column Definitions
const columnHelper = createColumnHelper<any>()

const PackageTypesTable = ({ tableData }: { tableData?: UsersType[] }) => {
  // States
  const [role, setRole] = useState<any['role']>('')
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')





  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean | null>(null);

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [confirmationStatusDialogOpen, setConfirmationStatusDialogOpen] = useState(false);






  const dispatch = useDispatch()

  const openConfirmationDialog = (id: string) => {
    setSelectedItem(id);
    setConfirmationDialogOpen(true);
  };

  const openConfirmationStatusDialog = (id: string) => {
    setSelectedItem(id);
    setConfirmationStatusDialogOpen(true);
  };

  const closeConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
    setSelectedItem(null);
  };

  const closeConfirmationStatusDialog = () => {
    setConfirmationStatusDialogOpen(false);
    setSelectedItem(null);
  };

  const fetchProductFormType = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product-form/get-all-product-form`, { withCredentials: true })

      setData(response.data.data)
      dispatch(setProductFormData(response.data.data)) // Ensure `setData` action is correctly set
    } catch (err) {
      console.error('Failed to fetch sub admins', err) // Log the error for debugging

    }
  }

  const handleDelete = useCallback(async () => {
    if (selectedItem) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product-form/delete-product-form/${selectedItem}`, { withCredentials: true });
        await fetchProductFormType();
        toast.success("Deleted Successfully!")
      } catch (err) {
        console.error('Failed to delete stock adjustment', err); // Log the error for debugging
      }
    }
  }, [selectedItem]);


  const handleStatusChange = useCallback(async () => {
    if (selectedItem) {
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product-form/change-status-product-form/${selectedItem}`, {}, { withCredentials: true });
        await fetchProductFormType();
        toast.success("Status Change Successfully!")
      } catch (err) {
        console.error('Failed to delete stock adjustment', err); // Log the error for debugging
      }
    }
  }, [selectedItem]);




  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<any>[]>(
    () => [

      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => <Typography>{row.original.name}</Typography>
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created Date',
        enableSorting: true,
        cell: ({ row }) => {
          const formattedDate = row.original.createdAt
            ? dayjs(row.original.createdAt).format('DD/MM/YYYY hh:mm A')
            : 'N/A';

          return <Typography className="cursor-pointer" >{formattedDate}</Typography>;
        }
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        enableSorting: true,
        cell: ({ row }) => (
          <div className='flex items-center  justify-center'>
            <Chip
              onClick={() => openConfirmationStatusDialog(row.original._id)}
              variant='tonal'
              className='capitalize cursor-pointer'
              label={
                row.original.status === true
                  ? 'Active'
                  : 'Inactive'

              }
              color={
                row.original.status === true
                  ? 'success'
                  : 'warning'

              }
              size='small'
            />
          </div>
        )
      }),


      columnHelper.accessor('action', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-0.5'>
            <IconButton size='small' onClick={() => {

              openConfirmationDialog(row.original._id)
              setIsActive(row?.original?.status)
            }}>
              <i className='ri-delete-bin-7-line text-textSecondary' />
            </IconButton>
            <IconButton size='small'>
              <Link href={getLocalizedUrl('/apps/user/view', locale as Locale)} className='flex'>
                <i className='ri-eye-line text-textSecondary' />
              </Link>
            </IconButton>
            <IconButton size='small'>
              <Link href={getLocalizedUrl(`/apps/product-form/${row.original._id}`, locale as Locale)} className='flex'>
                <i className='ri-edit-box-line text-textSecondary' />
              </Link>
            </IconButton>
            {/* <OptionMenu
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Download',
                  icon: 'ri-download-line',
                  menuItemProps: { className: 'flex items-center' }
                },
                {
                  text: 'Edit',
                  icon: 'ri-edit-box-line',
                  linkProps: { className: 'flex items-center' }
                }
              ]}
            /> */}
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
  )

  const table = useReactTable({
    data: filteredData as UsersType[],
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



  useEffect(() => {
    const filteredData = data?.filter(user => {
      if (role && user.role !== role) return false

      return true
    })

    setFilteredData(filteredData)
  }, [role, data, setFilteredData])

  return (
    <>
      <Card>
        <CardHeader title='Product Forms' className='pbe-4' />

        {/* <TableFilters setData={setData} tableData={tableData} /> */}

        <Divider />
        <CardContent className='flex justify-between flex-col items-start sm:flex-row sm:items-center max-sm:gap-4'>
          <Button
            variant='outlined'
            color='secondary'
            startIcon={<i className='ri-upload-2-line' />}
            className='max-sm:is-full'
          >
            Export
          </Button>
          <div className='flex flex-col !items-start max-sm:is-full sm:flex-row sm:items-center gap-4'>
            <DebouncedInput
              value={globalFilter ?? ''}
              className='max-sm:is-full min-is-[220px]'
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search User'
            />

            <Link className='' href={`/${locale}/apps/product-form/add`}>
              <Button variant='contained' className='is-full sm:is-auto'>
                Add
              </Button>
            </Link>
            <FormControl size='small' className='max-sm:is-full hidden'>
              <InputLabel id='roles-app-role-select-label'>Select Role</InputLabel>
              <Select
                value={role}
                onChange={e => setRole(e.target.value)}
                label='Select Role'
                id='roles-app-role-select'
                labelId='roles-app-role-select-label'
                className='min-is-[150px]'
              >
                <MenuItem value=''>Select Role</MenuItem>
                <MenuItem value='admin'>Admin</MenuItem>
                <MenuItem value='author'>Author</MenuItem>
                <MenuItem value='editor'>Editor</MenuItem>
                <MenuItem value='maintainer'>Maintainer</MenuItem>
                <MenuItem value='subscriber'>Subscriber</MenuItem>
              </Select>
            </FormControl>
          </div>
        </CardContent>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
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

      <ConfirmationDialogDelete open={confirmationDialogOpen}
        onClose={closeConfirmationDialog}
        onConfirm={handleDelete}
        itemName={selectedItem || ''} />

      <ConfirmationDialogStatusChange open={confirmationStatusDialogOpen}
        onClose={closeConfirmationStatusDialog}
        onConfirm={handleStatusChange}
        itemName={selectedItem || ''}
        isActive={isActive || false}
      />

    </>
  )
}

export default PackageTypesTable
