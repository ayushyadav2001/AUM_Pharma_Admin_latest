// React Imports
import { Card, CardContent, CardHeader, Chip, Divider } from '@mui/material'
import dayjs from 'dayjs';

import { } from 'react'
import PurchasedOrderViewTable from '../purchase-order-view-table/page';

// MUI Imports

const ViewPurchaseOrdersActions = ({ tableData }: { tableData?: any }) => {
  // States


  const formattedDate = tableData?.purchase_date
    ? dayjs(tableData.purchase_date).format('DD/MM/YYYY')
    : 'N/A';


  return (<div>


    <Card>
      <CardHeader title={`Purchase Details (Reference No: #${tableData?.reference_number})`} className='pbe-4' />
      <Divider />
      <CardContent className='sm:!p-12'>


        <div className="grid grid-cols-3 gap-4">

          <div className="col-span-1 text-left">
            <h4>Supplier</h4>
            <h4>{tableData?.vendor_id?.name}</h4>
            <span>{tableData?.vendor_id?.email}</span>          <span>{tableData?.vendor_id?.phoneNumber}</span>
            <span>{tableData?.vendor_id?.address?.addressLine}</span>
            <span>{tableData?.vendor_id?.address?.city}</span>
            <span>{tableData?.vendor_id?.address?.state}</span>

          </div>


          <div className="col-span-1 text-center">


          </div>


          <div className="col-span-1 text-right">

            <h5>Date:{formattedDate}</h5>
            <span><strong>Reference No:</strong>{tableData?.reference_number}</span>
            <br />
            <span><strong>Purchase Status:</strong>
              <Chip

                variant='tonal'
                className='capitalize cursor-pointer ml-2'
                label={
                  tableData.purchase_status === 'received'
                    ? 'Received'
                    : tableData.purchase_status === 'pending'
                      ? 'Pending'
                      : tableData.purchase_status === 'ordered'
                        ? 'Ordered'
                        : 'Unknown'
                }
                color={
                  tableData.purchase_status === 'received'
                    ? 'success'
                    : tableData.purchase_status === 'pending'
                      ? 'warning'
                      : tableData.purchase_status === 'ordered'
                        ? 'primary'
                        : 'default'
                }
                size='small'
              /></span>
            <br />

            <span ><strong>Payment Status:</strong>
              <Chip

                variant='tonal'
                className='capitalize cursor-pointer ml-2 mt-2'
                label={
                  tableData.purchase_status === 'received'
                    ? 'Received'
                    : tableData.purchase_status === 'pending'
                      ? 'Pending'
                      : tableData.purchase_status === 'ordered'
                        ? 'Ordered'
                        : 'Unknown'
                }
                color={
                  tableData.purchase_status === 'received'
                    ? 'success'
                    : tableData.purchase_status === 'pending'
                      ? 'warning'
                      : tableData.purchase_status === 'ordered'
                        ? 'primary'
                        : 'default'
                }
                size='small'
              /></span>
          </div>
        </div>
        <br />

        <PurchasedOrderViewTable tableData={tableData?.items} />
        <br />

        {/* <h4>Payment info:</h4> */}
      </CardContent>
    </Card>
  </div>)
}

export default ViewPurchaseOrdersActions
