// React Imports
import { useRef } from 'react'

import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material'


// MUI Imports


import dayjs from 'dayjs';

import advancedFormat from 'dayjs/plugin/advancedFormat';

import { useSelector } from 'react-redux';

import AdjustedStockTable from '../stock-view-table/page';
import ActivityTable from '../activity-table/page';


dayjs.extend(advancedFormat);


const ViewStockAdjustmentActions = ({ stockData }: { stockData?: any }) => {
  // States
  const stockAdjustedData = useSelector((state: any) => state?.stockAdjustment?.stockedJustData)
  const stockAdjustedDataHistory = useSelector((state: any) => state?.stockAdjustment?.activityData)



  const router = useRouter();

  const printRef = useRef<any>(null);


  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = `
    <html>
      <head>
        <title>Print</title>
        <style>
          @media print {
            @page {
              size: A4; /* Set the page to landscape orientation */
              margin: 0; /* Remove margins for the print */
            }
            body {
              margin: 0;
              padding: 1cm; /* Optional padding to prevent content from touching the edges */
              -webkit-print-color-adjust: exact; /* Ensure colors are printed as they appear on screen */
              font-size: 12pt; /* Adjust font size to fit content on one page */
            }
            .no-print {
              display: none  !important; /* Hide elements with the 'no-print' class during print */
            }
            /* Additional styles for printed content */
          }
        </style>
      </head>
      <body>${printContents}</body>
    </html>
  `;

    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Restore the original page content
  };




  const handleBack = () => {
    router.back(); // Equivalent to window.history.back()
  };


  const formattedDate = (date: any) => {
    return dayjs(date).format('DD/MM/YYYY hh:mm A'); // dd/mm/yyyy hh:mm AM/PM
  };


  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return <div>

    <Card ref={printRef}>
      <CardHeader title={`Stock Adjustment Details (Reference No: #${stockData?.referenceNumber})`} className='pbe-4' />
      <Divider />
      <CardContent className='sm:!p-12'>


        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1 text-left">
            <h4>Basic Details</h4>

            <div className='flex items-center  '>
              <Typography className='min-is-[50px]  font-bold'>Reference No:</Typography>
              <Typography>{stockData?.referenceNumber}</Typography>
            </div>
            <div className='flex items-center  '>
              <Typography className='min-is-[50px] font-bold '>Date:</Typography>
              <Typography>{formattedDate(stockData?.createdAt)}</Typography>
            </div>



          </div>

          <div className="col-span-1 text-left">
            <h4>Adjustment Details</h4>

            <div className='flex items-center  '>
              <Typography className='min-is-[50px] font-bold '>Adjustment type:</Typography>
              <Typography>{stockData?.adjustmentType == "increase" ? "Increase" : "Decrease"}</Typography>
            </div>
            <div className='flex items-center  '>
              <Typography className='min-is-[50px] font-bold '>Adjustment for:</Typography>
              <Typography>{capitalizeFirstLetter(stockData?.adjustmentDue)}</Typography>
            </div>
            <div className='flex items-center  '>
              <Typography className='min-is-[50px] font-bold '>Reason:</Typography>
              <Typography>{stockData?.reason}</Typography>
            </div>


          </div>


        </div>
        <br />
        <AdjustedStockTable stockData={stockAdjustedData} />
        <br />
        <ActivityTable stockData={stockAdjustedDataHistory} />
        <br />
        <div className="flex justify-center space-x-4 mt-6 no-print">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 cursor-pointer focus:outline-none"
          >
            Print
          </button>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-500 text-white cursor-pointer rounded-md hover:bg-gray-600 focus:outline-none"
          >
            Back
          </button>
        </div>
      </CardContent>
    </Card>
  </div>
}

export default ViewStockAdjustmentActions
