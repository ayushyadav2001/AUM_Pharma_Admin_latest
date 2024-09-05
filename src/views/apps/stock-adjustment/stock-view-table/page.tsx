'use client'
import { useState, useMemo } from 'react'



// React Imports




import dayjs from 'dayjs';

import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);


import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'

import Typography from '@mui/material/Typography'

// import Chip from '@mui/material/Chip'

// import Checkbox from '@mui/material/Checkbox'

// import { styled } from '@mui/material/styles'




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





import type { UsersType } from '@/types/apps/userTypes'

// import type { Locale } from '@configs/i18n'

// Component Imports
// import TableFilters from './TableFilters'



// import OptionMenu from '@core/components/option-menu'

// import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
// import { getInitials } from '@/utils/getInitials'

// import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'



import 'jspdf-autotable';





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





// Column Definitions
const columnHelper = createColumnHelper<any>()


const AdjustedStockTable = ({ stockData }: { stockData?: UsersType[] }) => {
  // States

  const [rowSelection, setRowSelection] = useState({})



  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[stockData])
  const [globalFilter, setGlobalFilter] = useState('')









  const formatCurrency = (value: any) => {
    return `₹ ${value.toFixed(2)}`; // Format with two decimal places
  };





  // const OpenImportModel = () => {
  //   setImportModel(true)
  // }


  // Hooks




  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [



      columnHelper.accessor('Product', {
        header: 'Product',
        cell: ({ row }) => <Typography>{row.original.Product}</Typography>
      }),
      columnHelper.accessor('Quantity', {
        header: 'Quantity',
        cell: ({ row }) => <Typography>{row.original.Quantity}pcs</Typography>
      }),
      columnHelper.accessor('UnitPrice', {
        header: 'Unit Price',
        cell: ({ row }) => <Typography>₹ {row.original.UnitPrice}</Typography>
      }),


      columnHelper.accessor('Subtotal', {
        header: 'Sub Total',
        cell: ({ row }) => <Typography>{formatCurrency(row.original.Subtotal)}</Typography>
      }),









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














  return (
    <>
      <Card >
        <CardHeader title='Product Details' className='pbe-4' />
        {/* <TableFilters setData={setData} stockData={stockData} /> */}
        <Divider />

        <div className='overflow-x-auto'>
          <table id="table-to-print" className={tableStyles.table}>
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
        {/* <TablePagination
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
        /> */}
      </Card>





    </>
  )
}

export default AdjustedStockTable
