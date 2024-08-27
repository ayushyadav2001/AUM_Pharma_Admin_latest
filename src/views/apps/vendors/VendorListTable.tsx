'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'

// import { styled } from '@mui/material/styles'

import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'



import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from 'react-icons/fa';

import * as XLSX from 'xlsx';



import { jsPDF } from 'jspdf';

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

import { saveAs } from 'file-saver';

// Type Imports
// import type { ThemeColor } from '@core/types'
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

const UserListTable = ({ tableData }: { tableData?: UsersType[] }) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[tableData])
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const { lang: locale } = useParams()

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

      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => <Typography>{row.original.name || 'N/A'}</Typography>
      }),
      columnHelper.accessor('phoneNumber', {
        header: 'Phone Number',
        cell: ({ row }) => <Typography>{row.original.phoneNumber || 'N/A'}</Typography>
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => <Typography>{row.original.email}</Typography>
      }),
      columnHelper.accessor('gstNumber', {
        header: 'GST Number',
        cell: ({ row }) => <Typography>{row.original.gstNumber}</Typography>
      }),
      columnHelper.accessor('panNumber', {
        header: 'PAN Number',
        cell: ({ row }) => <Typography>{row.original.panNumber}</Typography>
      }),
      columnHelper.accessor('dlNumber', {
        header: 'DL Number',
        cell: ({ row }) => <Typography>{row.original.dlNumber}</Typography>
      }),
      columnHelper.accessor('foodLicenseNumber', {
        header: 'Food License Number',
        cell: ({ row }) => <Typography>{row.original.foodLicenseNumber}</Typography>
      }),
      columnHelper.accessor('contactPersonName', {
        header: 'Contact Person Name',
        cell: ({ row }) => <Typography>{row.original.contactPersonName}</Typography>
      }),
      columnHelper.accessor('contactPersonMobileNumber', {
        header: 'Contact Person Mobile No',
        cell: ({ row }) => <Typography>{row.original.contactPersonMobileNumber}</Typography>
      }),
      columnHelper.accessor('contactPersonPhoneNumber', {
        header: 'Contact Person Phone Number',
        cell: ({ row }) => <Typography>{row.original.contactPersonPhoneNumber}</Typography>
      }),
      columnHelper.accessor('msmeNumber', {
        header: 'MSME Number',
        cell: ({ row }) => <Typography>{row.original.msmeNumber}</Typography>
      }),
      columnHelper.accessor('fssNumber', {
        header: 'Fss Number',
        cell: ({ row }) => <Typography>{row.original.fssNumber}</Typography>
      }),
      columnHelper.accessor('payable', {
        header: 'Payable',
        cell: ({ row }) => <Typography>{row.original.payable}</Typography>
      }),
      columnHelper.accessor('due', {
        header: 'Due',
        cell: ({ row }) => <Typography>{row.original.due}</Typography>
      }),
      columnHelper.accessor('address', {
        header: 'Address',
        cell: ({ row }) => <Typography>{row.original.address?.addressLine}</Typography>
      }),
      columnHelper.accessor('address', {
        header: 'State',
        cell: ({ row }) => <Typography>{row.original.address?.state}</Typography>
      }),
      columnHelper.accessor('address', {
        header: 'City',
        cell: ({ row }) => <Typography>{row.original.address?.city}</Typography>
      }),
      columnHelper.accessor('address', {
        header: 'Pin Code',
        cell: ({ row }) => <Typography>{row.original.address?.pinCode}</Typography>
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
      'Product Image', 'Category', 'Sub Category', 'Product ID', 'Product Name',
      'MRP', 'IGST', 'HSN', 'Manufacturer', 'Composition', 'Packing Type',
      'Packaging', 'Schedule', 'Usage', 'About Salt', 'Status'
    ];

    const rows = table.getRowModel().rows.map(row => {
      return row.getAllCells().map(cell => cell.getValue());
    });

    const doc: any = new jsPDF();

    doc?.autoTable({ head: [headers], body: rows });
    doc.save('products.pdf');
  };

  const handlePrint = () => {
    const tableElement = document.getElementById('table-to-print');

    if (!tableElement) {
      console.error('Table element not found');

      return;
    }

    const printWindow = window.open('', '', 'height=600,width=800');

    printWindow?.document.write('<html><head><title>Print Table</title>');

    printWindow?.document.write('</head><body >');
    printWindow?.document.write('<h1>Table Print</h1>');
    printWindow?.document.write(tableElement.outerHTML); // Print the table HTML
    printWindow?.document.write('</body></html>');
    printWindow?.document.close();
    printWindow?.focus();
    printWindow?.print();
  };

  const handleExportExcel = () => {
    const headers = [
      'Product Image', 'Category', 'Sub Category', 'Product ID', 'Product Name',
      'MRP', 'IGST', 'HSN', 'Manufacturer', 'Composition', 'Packing Type',
      'Packaging', 'Schedule', 'Usage', 'About Salt', 'Status'
    ];

    const rows = table.getRowModel().rows.map(row => {
      return row.getAllCells().map(cell => cell.getValue());
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    XLSX.writeFile(workbook, 'vendor.xlsx');
  };

  const handleExportCSV = () => {
    const headers = [
      'Product Image', 'Category', 'Sub Category', 'Product ID', 'Product Name',
      'MRP', 'IGST', 'HSN', 'Manufacturer', 'Composition', 'Packing Type',
      'Packaging', 'Schedule', 'Usage', 'About Salt', 'Status'
    ];

    const csvRows = [];

    // Add the headers
    csvRows.push(headers.join(','));

    // Add the data
    table.getRowModel().rows.forEach(row => {
      const rowData = row.getAllCells().map(cell => `"${cell.getValue()}"`).join(',');

      csvRows.push(rowData);
    });

    // Create CSV blob and trigger download
    const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8' });

    saveAs(csvBlob, 'vendor.csv');
  };


  return (
    <>
      <Card>
        <CardHeader title='Vendors' className='pbe-4' />

        {/* <TableFilters setData={setData} tableData={tableData} /> */}

        <Divider />
        <div className='flex justify-between gap-4 p-4 flex-col items-start sm:flex-row sm:items-center'>
          <div className="flex justify-between gap-4 flex-col items-start sm:flex-row sm:items-center">

            <Button
              color="secondary"
              variant="outlined"
              startIcon={<FaFileCsv size={16} className="text-xl" />}
              className="is-full sm:is-auto h-6 py-3"
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>

            <Button
              color="secondary"
              variant="outlined"
              startIcon={<FaFileExcel className="text-xl" size={16} />}
              className="is-full sm:is-auto h-6 py-3"
              onClick={handleExportExcel}
            >
              Export Excel
            </Button>

            <Button
              color="secondary"
              variant="outlined"
              startIcon={<FaPrint size={16} className="text-xl" />}
              className="is-full sm:is-auto h-6 py-3"
              onClick={handlePrint}
            >
              Print
            </Button>

            <Button
              color="secondary"
              variant="outlined"
              startIcon={<FaFilePdf size={16} className="text-xl" />}
              className="is-full sm:is-auto h-6 py-3"
              onClick={handleExportPDF}
            >
              Export PDF
            </Button>
          </div>
          <div className='flex items-center gap-x-4 max-sm:gap-y-4 is-full flex-col sm:is-auto sm:flex-row'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search Vendor'
              className='is-full sm:is-auto'
            />

            <Link href={`/${locale}/apps/vendors/add`}>
              <Button variant='contained' className='is-full sm:is-auto'>
                Add
              </Button>
            </Link>
          </div>
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
      </Card>
      <AddUserDrawer open={addUserOpen} handleClose={() => setAddUserOpen(!addUserOpen)} />
    </>
  )
}

export default UserListTable
