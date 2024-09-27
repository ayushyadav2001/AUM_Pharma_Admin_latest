import * as yup from 'yup'

const urlValidation = yup.string().url('Must be a valid URL').notRequired()

const fileValidationSchema = yup.mixed()

const sectionValidationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),

  type: yup
    .string()
    .oneOf(
      ['banner', 'product_slider', 'prescription_component', 'category_slider'],
      'Type must be either "banner" or "product_slider"'
    )
    .required('Section type is required'),

  banners: yup
    .array()
    .of(
      yup.object().shape({
        imageUrl: fileValidationSchema.required('Image is required'), // Ensure imageUrl is required
        linkUrl: urlValidation
      })
    )
    .when('type', {
      is: 'banner',
      then: schema => schema.min(1, 'At least one banner is required').required('Banners are required for this type'),
      otherwise: schema => schema.length(0).notRequired().nullable() // Explicitly set to 0 and not required for product_slider
    }),

  products: yup
    .array()
    .of(yup.string().required('Product ID is required')) // Ensure product ID is required
    .when('type', {
      is: 'product_slider',
      then: schema => schema.min(1, 'At least one product is required').required('Products are required for this type'),
      otherwise: schema => schema.length(0).notRequired() // Allow empty array when type is not product_slider
    }),
  categories: yup
    .array()
    .of(yup.string().required('Categories is required')) // Ensure product ID is required
    .when('type', {
      is: 'category_slider',
      then: schema =>
        schema.min(1, 'At least one Category is required').required('Category are required for this type'),
      otherwise: schema => schema.length(0).notRequired()
    })
})

// Default values
const defaultValues = {
  title: '',
  type: 'banner', // or 'product_slider' depending on the initial form
  banners: [{ imageUrl: null, linkUrl: '' }], // Initialize with null for file
  products: [],
  categories: [],
  status: true
}

// Exporting validation schema and default values
const sectionSchema = {
  sectionValidationSchema,
  defaultValues
}

export default sectionSchema
