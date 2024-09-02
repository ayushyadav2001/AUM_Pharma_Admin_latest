import * as yup from 'yup'

const itemSchema = yup.object().shape({
  item_name: yup.string().required('Product name is required'),
  bill_no: yup.string().notRequired(),
  date: yup.string().notRequired(),
  company: yup.string().notRequired(),
  code: yup.string().notRequired(),
  barcode: yup.string().notRequired(),
  pack: yup.string().notRequired(),
  batch: yup.string().notRequired(),
  expiry: yup.date().notRequired(),
  qty: yup.number().typeError('Quantity must be a number').notRequired(),
  f_qty: yup.number().typeError('FQTY must be a number').notRequired(),
  half_p: yup.number().typeError('Half P must be a number').notRequired(),
  ft_rate: yup.number().typeError('FT Rate must be a number').notRequired(),
  srate: yup.number().typeError('SRate must be a number').notRequired(),
  mrp: yup.number().typeError('MRP must be a number').notRequired(),
  dis: yup.number().typeError('Discount must be a number').default(0).notRequired(),
  excise: yup.string().default('0').notRequired(),
  vat: yup.number().typeError('VAT must be a number').default(0).notRequired(),
  adnl_vat: yup.number().typeError('Additional VAT must be a number').default(0).notRequired(),
  amount: yup.number().typeError('Amount must be a number').notRequired(),
  local_cent: yup.string().default('0').notRequired(),
  scm1: yup.number().typeError('SCM1 must be a number').default(0).notRequired(),
  scm2: yup.number().typeError('SCM2 must be a number').default(0).notRequired(),
  scm_per: yup.number().typeError('SCM Percentage must be a number').default(0).notRequired(),
  cust_code: yup.string().notRequired(),
  inv_day: yup.number().typeError('Invoice Day must be a number').notRequired(),
  inv_month: yup.number().typeError('Invoice Month must be a number').notRequired(),
  inv_year: yup.number().typeError('Invoice Year must be a number').notRequired(),
  exp_day: yup.number().typeError('Expiry Day must be a number').notRequired(),
  exp_month: yup.number().typeError('Expiry Month must be a number').notRequired(),
  exp_year: yup.number().typeError('Expiry Year must be a number').notRequired(),
  supp_code: yup.string().notRequired(),
  inv_amt: yup.number().typeError('Invoice Amount must be a number').notRequired(),
  hsn_code: yup.string().notRequired(),
  cgst: yup.number().typeError('CGST must be a number').notRequired(),
  sgst: yup.number().typeError('SGST must be a number').notRequired(),
  igst: yup.number().typeError('IGST must be a number').notRequired(),
  psr_lno: yup.string().notRequired(),
  tcs_per: yup.number().typeError('TCS Percentage must be a number').default(0).notRequired(),
  tcs_amt: yup.number().typeError('TCS Amount must be a number').default(0).notRequired(),
  order_no: yup.string().notRequired()
})

const purchaseOrderValidationSchema = yup.object().shape({
  vendor_id: yup.string().required('Vendor is required'),
  reference_number: yup.string().notRequired(),
  purchase_date: yup.date().nullable().required('Purchase Date is required'),
  purchaseStatus: yup.string().required('Purchase Status is required'),
  payTermNumber: yup.number().typeError('Pay Term Number is required').required('Pay Term Number is required'),
  payTermUnit: yup.string().required('Pay Term Unit is required'),
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
