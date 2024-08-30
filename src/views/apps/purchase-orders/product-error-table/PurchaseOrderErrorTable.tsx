/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'

// Next Imports

// import Link from 'next/link'

// import { useParams } from 'next/navigation'

// MUI Imports

import Typography from '@mui/material/Typography'

// import { styled } from '@mui/material/styles'

import TablePagination from '@mui/material/TablePagination'

import { Button, Checkbox } from '@mui/material'

import 'jspdf-autotable'

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

const PurchaseOrderListErrorTable = ({
  tableData,
  importedData,
  setShowImportError,
  setImportedDataUpdatedData,
  setImportedDataFormik
}: {
  tableData?: any
  importedData: any
  setShowImportError: () => void
  setImportedDataUpdatedData: (data: UsersType[]) => void
  setImportedDataFormik: (data: UsersType[]) => void
}) => {
  // States

  console.log('importedData', importedData)

  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[tableData])
  const [globalFilter, setGlobalFilter] = useState('')

  const [selectedItems, setSelectedItems] = useState<any[]>([])

  console.log('data', data)

  useEffect(() => {
    if (tableData) {
      setData(tableData)
    }
  }, [tableData])

  // Hooks
  // const { lang: locale } = useParams()

  const handleCheckboxChange = (rowId: string, event: React.ChangeEvent<HTMLInputElement>, row: any) => {
    console.log('Row ID:', rowId)
    console.log('Checked:', event.target.checked)
    console.log('rowfrom checkbox:', row)

    let updatedData: any

    if (event.target.checked) {
      updatedData = importedData.map((item: any) => {
        if (item.item_name === row.original.file_item_name) {
          const updatedItem = {
            ...item,
            rowId,
            item_name: row.original.item_name
          }

          // Add the updated item to selectedItems
          setSelectedItems((prevSelectedItems: any) => [
            ...prevSelectedItems,
            updatedItem // Push the updated item object into the selectedItems array
          ])

          // Return the updated item to update importedData
          return updatedItem
        }

        return item
      })

      // setImportedDataUpdatedData(updatedData)
    } else {
      setSelectedItems((prevSelectedItems: any) => prevSelectedItems.filter((item: any) => item.rowId !== rowId))

      // If needed, revert the item_name to the original value in importedData
      updatedData = importedData.map((item: any) => {
        if (item.item_name === row.original.item_name) {
          return {
            ...item,
            item_name: row.original.file_item_name
          }
        }

        return item
      })

      setImportedDataUpdatedData(updatedData)
    }

    // Log the updated data to the console
    console.log('Updated Data:', updatedData)

    // Update the row selection state
    setRowSelection(prev => ({
      ...prev,
      [rowId]: event.target.checked
    }))
  }

  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const isChecked = event.target.checked

    table.getToggleAllRowsSelectedHandler()(event)

    const updatedData = data.map((item: any) => {
      if (isChecked) {
        setSelectedItems(prevSelectedItems => {

          const newItems = data
            .filter((row: any) => !prevSelectedItems.find(selectedItem => selectedItem.rowId === row.id))
            .map((row: any) => ({
              ...row,
              rowId: row.id,
              item_name: row.item_name
            }))

          return [...prevSelectedItems, ...newItems]
        })

      } else {

        setSelectedItems(prevSelectedItems => prevSelectedItems.filter(selectedItem => !data.find((row: any) => row.rowId === selectedItem.rowId)))
      }


      return item
    })

    setImportedDataUpdatedData(updatedData)
  }


  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ }) => (
          <>
            <label>Select to use Item Name</label>
            <br />
            {/* <Checkbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler()
              }}
            /> */}
          </>
        ),
        cell: ({ row }) => (
          <div>
            <Checkbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: event => handleCheckboxChange(row.id, event, row)
              }}
            />
          </div>
        )
      },

      // {
      //   id: 'sno',
      //   header: 'SNo',
      //   cell: ({ row }) => <Typography>{row.index + 1}</Typography>, // Displays sequential number starting from 1
      // },

      columnHelper.accessor('file_item_name', {
        header: 'File Item name',

        cell: ({ row }) => (
          <Typography
            sx={{
              backgroundColor: !row.getIsSelected() ? 'primary.main' : 'initial',
              color: !row.getIsSelected() ? 'white' : 'inherit',
              padding: '8px',
              borderRadius: '4px'
            }}
          >
            {row.original.file_item_name || 'N/A'}
          </Typography>
        )
      }),
      columnHelper.accessor('item_name', {
        header: 'Item Name',

        cell: ({ row }) => (
          <Typography
            sx={{
              backgroundColor: row.getIsSelected() ? 'primary.main' : 'initial',
              color: row.getIsSelected() ? 'white' : 'inherit',
              padding: '8px',
              borderRadius: '4px'
            }}
          >
            {row.original.item_name || 'N/A'}
          </Typography>
        )
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
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

  const handleUpdate = () => {
    setImportedDataUpdatedData(selectedItems)
    setImportedDataFormik(selectedItems)
    setShowImportError()
  }

  return (
    <>
      <div className='flex justify-end gap-4 mb-4 flex-col items-start sm:flex-row sm:items-center'>
        <Button type='submit' onClick={handleUpdate} color='primary' variant='contained'>
          Update
        </Button>
      </div>

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

export default PurchaseOrderListErrorTable
