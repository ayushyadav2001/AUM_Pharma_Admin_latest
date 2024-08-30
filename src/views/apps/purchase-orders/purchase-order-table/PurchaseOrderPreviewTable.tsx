'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'

// Next Imports

// import Link from 'next/link'

// import { useParams } from 'next/navigation'

// MUI Imports

import Typography from '@mui/material/Typography'

// import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'

// import { styled } from '@mui/material/styles'

import TablePagination from '@mui/material/TablePagination'









import 'jspdf-autotable';

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

const PurchaseOrderListPreviewTable = ({ tableData, setImportedDataUpdatedData }: { tableData?: any, setImportedDataUpdatedData: (data: UsersType[]) => void; }) => {
  // States

  console.log("tableData", tableData)

  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[tableData])
  const [globalFilter, setGlobalFilter] = useState('')



  console.log("data", data)

  const handleDelete = (rowIndex: number) => {

    const updatedData: any = data?.filter((_: any, index: any) => index !== rowIndex);

    setData(updatedData);


    setImportedDataUpdatedData(updatedData);
  };

  useEffect(() => {
    if (tableData) {
      setData(tableData);
    }
  }, [tableData]);

  // Hooks
  // const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      // {
      //   id: 'select',
      //   header: ({ table }) => (
      //     <Checkbox
      //       {...{
      //         checked: table.getIsAllRowsSelected(),
      //         indeterminate: table.getIsSomeRowsSelected(),
      //         onChange: table.getToggleAllRowsSelectedHandler()
      //       }}
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <Checkbox
      //       {...{
      //         checked: row.getIsSelected(),
      //         disabled: !row.getCanSelect(),
      //         indeterminate: row.getIsSomeSelected(),
      //         onChange: row.getToggleSelectedHandler()
      //       }}
      //     />
      //   )
      // },
      {
        id: 'sno',
        header: 'SNo',
        cell: ({ row }) => <Typography>{row.index + 1}</Typography>, // Displays sequential number starting from 1
      },

      columnHelper.accessor('item_name', {
        header: 'Product Name',
        cell: ({ row }) => <Typography>{row.original.item_name || 'N/A'}</Typography>
      }),
      columnHelper.accessor('company', {
        header: 'Company',
        cell: ({ row }) => <Typography>{row.original.company || 'N/A'}</Typography>
      }),
      columnHelper.accessor('hsn_code', {
        header: 'HSN Code',
        cell: ({ row }) => <Typography>{row.original.hsn_code || 'N/A'}</Typography>
      }),
      columnHelper.accessor('pack', {
        header: 'Quantity',
        cell: ({ row }) => <Typography>{row.original.pack}</Typography>
      }),
      columnHelper.accessor('mrp', {
        header: 'MRP',
        cell: ({ row }) => <Typography>{row.original.mrp}</Typography>
      }),

      columnHelper.accessor('amount', {
        header: 'Amount',
        cell: ({ row }) => <Typography>{row.original.amount}</Typography>
      }),
      columnHelper.accessor('dis', {
        header: 'Discount',
        cell: ({ row }) => <Typography>{row.original.dis}</Typography>
      }),
      columnHelper.accessor('inv_amt', {
        header: 'INV Amount',
        cell: ({ row }) => <Typography>{row.original.inv_amt}</Typography>
      }),
      columnHelper.accessor('cgst', {
        header: 'CGST',
        cell: ({ row }) => <Typography>{row.original.cgst}</Typography>
      }),
      columnHelper.accessor('sgst', {
        header: 'SGST',
        cell: ({ row }) => <Typography>{row.original.sgst}</Typography>
      }),
      columnHelper.accessor('igst', {
        header: 'IGST',
        cell: ({ row }) => <Typography>{row.original.igst}</Typography>
      }),




      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center gap-0.5'>
            <IconButton size='small' onClick={() => handleDelete(row.index)}>
              <i className='ri-delete-bin-7-line text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false,
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, setImportedDataUpdatedData]
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


    </>
  )
}

export default PurchaseOrderListPreviewTable
