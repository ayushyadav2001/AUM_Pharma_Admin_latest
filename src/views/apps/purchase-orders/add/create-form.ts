import * as yup from 'yup'

const itemSchema = yup.object().shape({
  unit: yup.number().required('Unit is required'),
  batch_no: yup.string().required('Batch Number is required'),
  expiry_date: yup.string().required('Expiry Date is required'),
  mrp: yup.string().required('MRP is required'),
  quantity: yup.number().required('Quantity is required'),
  free_quantity: yup.string().required('Free Quantity is required'),
  purchase_to_retailer: yup.string().required('Purchase to Retailer is required'),
  discount_percentage: yup.string().required('Discount Percentage is required'),
  discount_amount: yup.string().required('Discount Amount is required'),
  base: yup.string().required('Base is required'),
  gst_percent: yup.string().required('GST Percent is required'),
  amount: yup.string().required('Amount is required'),
  last_price: yup.string().required('Last Price is required')
})

const purchaseOrderValidationSchema = yup.object().shape({
  vendor_id: yup.string().required('Vendor is required'),
  reference_number: yup.string().notRequired(),
  purchase_date: yup.date().nullable().required('Purchase Date is required'),
  purchaseStatus: yup.string().notRequired(),
  payTermNumber: yup.number().notRequired(),
  payTermUnit: yup.string().notRequired(),
  items: yup.array().of(itemSchema).min(1, 'At least one item is required')
})

const defaultValues = {
  vendor_id: '',
  reference_number: '',
  purchase_date: null, // Matches the updated TypeScript type
  purchaseStatus: '',
  payTermNumber: '0', // Ensure this matches the expected type (number | string)
  payTermUnit: 'days',
  items: []
}

const createPurchaseOrderSchema = {
  purchaseOrderValidationSchema,
  defaultValues
}

export default createPurchaseOrderSchema
