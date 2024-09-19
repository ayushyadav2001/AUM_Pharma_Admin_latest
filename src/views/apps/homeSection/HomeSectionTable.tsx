'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Image from 'next/image'

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

import dayjs from 'dayjs'

import { CardHeader, Divider } from '@mui/material'

import type { UsersType } from '@/types/apps/userTypes'
import type { Locale } from '@configs/i18n'

// Component Imports
import OptionMenu from '@core/components/option-menu'


// Util Imports

import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

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

const HomeSectionTable = ({ tableData }: { tableData?: UsersType[] }) => {
  // States
  const [role, setRole] = useState<any['role']>('')
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<any>[]>(
    () => [

      columnHelper.accessor('type', {
        header: 'Section Type',
        cell: ({ row }) => <Typography>{row.original.type === "product_slider" ? "Products Slider" : "Banners Sliders"}</Typography>
      }),
      columnHelper.accessor('title', {
        header: 'Title',
        cell: ({ row }) => <Typography>{row.original.title}</Typography>
      }),

      columnHelper.accessor('products', {
        header: 'Products',
        cell: ({ row }) => {
          if (row.original.type === 'product_slider') {
            return (
              <div>
                {row.original.products.map((product: any, index: number) => (
                  <Typography key={product._id}>{index + 1}.{product.product_name}</Typography>
                ))}
              </div>
            );
          }
          else {
            return (


              <Typography className='text-center'>-</Typography>

            )

          }


          return null; // No product names for banners
        }
      }),
      columnHelper.accessor('banners', {
        header: 'Banners',
        cell: ({ row }) => {
          if (row.original.type === 'banner') {
            return (
              <div className='flex flex-col'>
                {row.original.banners.map((banner: any) => (
                  <Image key={banner._id} src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${banner.imageUrl}`} alt={banner._id} className="w-full h-auto " height={100} width={100} />
                ))}
              </div>
            );
          } else {
            return (
              <Typography className='text-center'>-</Typography>
            )
          }


          return null; // No banners for product sliders
        }

      }),
      columnHelper.accessor('index', {
        header: 'Index',
        cell: ({ row }) => <Typography>{row.original.index}</Typography>
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
      columnHelper.accessor('action', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-0.5'>
            <IconButton size='small' onClick={() => setData(data?.filter(product => product.id !== row.original.id))}>
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
                  icon: 'ri-download-line',
                  menuItemProps: { className: 'flex items-center' }
                },
                {
                  text: 'Edit',
                  icon: 'ri-edit-box-line',
                  linkProps: { className: 'flex items-center' }
                }
              ]}
            />
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
    <Card>
      <CardHeader title='Home Sections' className='pbe-4' />
      <Divider />
      <CardContent className='flex justify-end flex-col items-start sm:flex-row sm:items-center max-sm:gap-4'>
        <Button
          variant='outlined'
          color='secondary'
          startIcon={<i className='ri-upload-2-line' />}
          className='max-sm:is-full hidden'
        >
          Export
        </Button>
        <div className='flex flex-col !items-start max-sm:is-full sm:flex-row sm:items-center gap-4'>
          <DebouncedInput
            value={globalFilter ?? ''}
            className='max-sm:is-full min-is-[220px]'
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Section'
          />

          <Link className='' href={`/${locale}/apps/roles/add`}>
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
  )
}

export default HomeSectionTable
