import * as yup from 'yup'

// Define the validation schema using yup
const stockAdjustmentValidationSchema = yup.object().shape({
  referenceNumber: yup.string().nullable(),
  purchaseDate: yup.date().required('Purchase date is required').nullable(),
  adjustmentType: yup.string().required('Adjustment type is required'),
  adjustmentDue: yup.string().required('Adjustment due is required'),
  reason: yup.string().required('Adjustment reason is required'),
  totalAmountRecovered: yup.string().notRequired().nullable(),
  productDetails: yup
    .array()
    .of(
      yup.object().shape({
        product: yup.string().required('Product is required'),
        quantity: yup.number().positive('Quantity must be greater than 0').required('Quantity is required'),
        unitPrice: yup.number().positive('Unit price must be greater than 0').required('Unit price is required'),
        subtotal: yup.number().positive('Subtotal must be greater than 0').required('Subtotal is required')
      })
    )
    .min(1, 'At least one product is required')
})

const defaultValues = {
  referenceNumber: '', // Empty string or initial value for the reference number
  purchaseDate: new Date(), // Default to the current date
  adjustmentType: '', // Default to an empty string or initial adjustment type value
  adjustmentDue: '', // Default to an empty string or initial adjustment due value
  productDetails: [] // Default to an empty array of productDetails
}

const createStockAdjustmentSchema = {
  stockAdjustmentValidationSchema,
  defaultValues
}

export default createStockAdjustmentSchema
