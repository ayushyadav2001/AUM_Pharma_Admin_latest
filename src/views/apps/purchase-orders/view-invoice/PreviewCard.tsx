// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

import advancedFormat from 'dayjs/plugin/advancedFormat';


// Component Imports


import dayjs from 'dayjs'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import './print.css'
import LogoSmall from '@/components/layout/shared/LogoSmall'

// Vars


const PreviewCard = ({ invoiceData, }: { invoiceData?: any; id: string }) => {

  const formattedDate = dayjs(invoiceData?.purchase_date).format('DD/MM/YYYY hh:mm A');

  // const formattedCurrentDate = dayjs(new Date).format('DD/MM/YYYY hh:mm A');

  dayjs.extend(advancedFormat);

  const formattedCurrentDate = dayjs().format('DD/MM/YYYY hh:mm A');

  const calculateNetRate = (mrp: number, discountPercentage: number) =>
    mrp - (mrp * discountPercentage) / 100;

  const calculateTaxableAmount = (quantity: number, netRate: number) =>
    quantity * netRate;

  const calculateGSTAmount = (taxableAmount: number, gstPercentage: number) =>
    taxableAmount * gstPercentage / 100;

  const calculateFinalAmount = (taxableAmount: number, gstAmount: number) =>
    taxableAmount + gstAmount;

  const calculateTotals = (items: any) => {
    let subtotal = 0;
    let discount = 0;
    let tax = 0;
    let total = 0;

    items.forEach((item: any) => {
      const mrp = parseFloat(item.mrp);
      const discountPercentage = parseFloat(item.discount_percentage);
      const quantity = parseFloat(item.quantity);
      const gstPercentage = parseFloat(item.gst_percent);

      const netRate = calculateNetRate(mrp, discountPercentage);
      const taxableAmount = calculateTaxableAmount(quantity, netRate);
      const gstAmount = calculateGSTAmount(taxableAmount, gstPercentage);
      const finalAmount = calculateFinalAmount(taxableAmount, gstAmount);

      subtotal += taxableAmount;
      discount += (mrp * quantity) - taxableAmount; // Discount amount
      tax += gstAmount;
      total += finalAmount;

      // Optional: Console logs for debugging
      console.log("netRate", netRate);
      console.log("taxableAmount", taxableAmount);
      console.log("gstAmount", gstAmount);
      console.log("finalAmount", finalAmount);
      console.log("total", total);
    });

    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  };

  // Example usage
  const { subtotal, discount, tax, total } = calculateTotals(invoiceData.items);



  return (
    <Card className='previewCard'>
      <CardContent className='sm:!p-12'>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <div className='p-6 bg-actionHover rounded'>
              <div className='flex justify-between gap-y-4 flex-col sm:flex-row'>
                <div className='flex flex-col gap-6'>
                  <div className='flex items-center gap-2.5'>
                    <LogoSmall />
                  </div>
                  <div>




                    <Typography color='text.primary'>  141, SHUKAN MALL, OPP CIMS HOSPITAL, </Typography>
                    <Typography color='text.primary'>SCIENCE CITY ROAD,SOLA , AHMEDABAD GUJARAT</Typography>
                    <Typography color='text.primary'>+91-7600185980, +91-9426999932</Typography>
                    <Typography color='text.primary'>DL No :GA-AD2-194961/194962, GA-AD2-194963/194964</Typography>
                  </div>
                </div>
                <div className='flex flex-col gap-6'>
                  <Typography variant='h5'>{`Invoice #${invoiceData?.reference_number}`}</Typography>
                  <div className='flex flex-col gap-1'>
                    <Typography color='text.primary'>{`Date Issued: ${formattedCurrentDate}`}</Typography>
                    <Typography color='text.primary'>{`Order Date: ${formattedDate}`}</Typography>
                    {/* <Typography color='text.primary'>{`Date Due: ${invoiceData?.dueDate}`}</Typography> */}
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Invoice To:
                  </Typography>
                  <div>
                    <Typography>{invoiceData?.vendor_id?.name}</Typography>
                    <Typography>{invoiceData?.vendor_id?.phoneNumber} {invoiceData?.vendor_id?.email}</Typography>
                    <Typography>{invoiceData?.vendor_id?.address?.addressLine} {invoiceData?.vendor_id?.address?.city} {invoiceData?.vendor_id?.address?.state} {invoiceData?.vendor_id?.address?.pinCode}</Typography>

                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Contact Person Details:
                  </Typography>
                  <div className='flex items-center gap-4'>
                    <Typography className='min-w-[150px]'>Name:</Typography>
                    <Typography>{invoiceData?.vendor_id?.contactPersonName}</Typography>
                  </div>
                  <div className='flex items-center gap-4'>
                    <Typography className='min-w-[150px]'>Mobile Number:</Typography>
                    <Typography>{invoiceData?.vendor_id?.contactPersonMobileNumber}</Typography>
                  </div>
                  <div className='flex items-center gap-4'>
                    <Typography className='min-w-[150px]'>Phone Number:</Typography>
                    <Typography>{invoiceData?.vendor_id?.contactPersonPhoneNumber}</Typography>
                  </div>
                </div>
              </Grid>

              <Grid item xs={12} sm={6}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Details:
                  </Typography>
                  <div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>PAN No:</Typography>
                      <Typography>{invoiceData?.vendor_id?.panNumber}</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>GST No:</Typography>
                      <Typography>{invoiceData?.vendor_id?.gstNumber}</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>DL No:</Typography>
                      <Typography>{invoiceData?.vendor_id?.dlNumber}</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Food License No:</Typography>
                      <Typography>{invoiceData?.vendor_id?.foodLicenseNumber}</Typography>

                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>FSS No:</Typography>
                      <Typography>{invoiceData?.vendor_id?.fssNumber}</Typography>

                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>MSME No:</Typography>
                      <Typography>{invoiceData?.vendor_id?.msmeNumber}</Typography>
                    </div>
                  </div>


                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Bill To:
                  </Typography>
                  <div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Total Due:</Typography>
                      <Typography>₹ {parseFloat(invoiceData?.totalAmount)?.toFixed(2)}</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Bank name:</Typography>
                      <Typography>American Bank</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Country:</Typography>
                      <Typography>United States</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>IBAN:</Typography>
                      <Typography>ETD95476213874685</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>SWIFT code:</Typography>
                      <Typography>BR91905</Typography>
                    </div>
                  </div>


                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div className=' overflow-x-auto border rounded'>
              <table className={`${tableStyles.table}`}>
                <thead>
                  <tr className='border-b bg-primary text-white'>

                    <th className='!bg-transparent'>Product Name</th>

                    <th className='!bg-transparent'>Quantity</th>
                    <th className='!bg-transparent'>Expiry</th>
                    <th className='!bg-transparent'>Free Qty</th>
                    <th className='!bg-transparent'>BASE</th>
                    <th className='!bg-transparent'>MRP</th>
                    <th className='!bg-transparent'>Dis %</th>
                    <th className='!bg-transparent'>GST %</th>
                    <th className='!bg-transparent'>LP</th>
                    <th className='!bg-transparent'>Amount</th>

                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item: any, index: any) => {

                    // const netRate = calculateNetRate(item.mrp, item.dis);
                    // const taxableAmount = calculateTaxableAmount(item.qty, netRate);
                    // const gstAmount = calculateGSTAmount(taxableAmount, item.sgst, item.cgst);
                    // const finalAmount = calculateFinalAmount(taxableAmount, gstAmount);



                    return (
                      <tr key={index}>
                        <td style={{ width: '50px' }}>
                          <Typography color='text.primary'>{item.product?.product_name || '-'}</Typography>
                        </td>
                        <td>
                          <Typography color='text.primary'>{item.quantity || '-'}</Typography>
                        </td>

                        <td>
                          <Typography color='text.primary'>{item.expiry_date || '-'}</Typography>
                        </td>
                        <td>
                          <Typography color='text.primary'>{item.free_quantity || '-'}</Typography>
                        </td>
                        <td>
                          <Typography color='text.primary'>{parseFloat(item.base).toFixed(2) || '-'}</Typography>
                        </td>
                        <td>
                          <Typography color='text.primary'>{parseFloat(item.mrp).toFixed(2) || '-'}</Typography>
                        </td>
                        <td>
                          <Typography color='text.primary'>{`${item.discount_percentage}` || '-'}</Typography>
                        </td>
                        <td>
                          <Typography color='text.primary'>{item.gst_percent || '-'}</Typography>
                        </td>
                        <td>
                          <Typography color='text.primary'>{parseFloat(item.last_price)?.toFixed(2) || '-'}</Typography>
                        </td>
                        <td>
                          <Typography color='text.primary'>{parseFloat(item.amount).toFixed(2) || '-'}</Typography>
                        </td>







                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className='flex justify-between flex-col gap-y-4 sm:flex-row'>
              <div className='flex flex-col gap-1 order-2 sm:order-[unset]'>
                <div className='flex items-center gap-2'>
                  <Typography className='font-medium' color='text.primary'>
                    Salesperson:
                  </Typography>
                  <Typography>AUM Pharmacy</Typography>
                </div>
                <Typography>Thanks for your business</Typography>
              </div>
              <div className='min-is-[200px]'>
                <div className='flex items-center justify-between'>
                  <Typography>Subtotal:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    {subtotal}
                  </Typography>
                </div>
                <div className='flex items-center justify-between'>
                  <Typography>Discount:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    {discount} %
                  </Typography>
                </div>
                <div className='flex items-center justify-between'>
                  <Typography>Tax:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    {tax}
                  </Typography>
                </div>
                <Divider className='mlb-2' />
                <div className='flex items-center justify-between'>
                  <Typography>Total:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    {total}
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Divider className='border-dashed' />
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <Typography component='span' className='font-medium' color='text.primary'>
                Note:
              </Typography>{' '}
              It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance
              projects. Thank You!
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PreviewCard
