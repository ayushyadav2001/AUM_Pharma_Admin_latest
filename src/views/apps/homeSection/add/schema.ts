// import * as yup from 'yup'

// // URL validation
// const urlValidation = yup.string().url('Must be a valid URL').required('URL is required')

// // Section validation schema
// const sectionValidationSchema = yup.object().shape({
//   title: yup.string().required('Title is required'),

//   type: yup
//     .string()
//     .oneOf(['banner', 'product_slider'], 'Type must be either "banner" or "product_slider"')
//     .required('Section type is required'),

//   banners: yup
//     .array()
//     .of(
//       yup.object().shape({
//         imageUrl: urlValidation,
//         linkUrl: urlValidation
//       })
//     )
//     .when('type', (type: any, schema: any) => {
//       // Validate banners only if type is 'banner'
//       return type === 'banner'
//         ? schema.min(1, 'At least one banner is required').required()
//         : schema.max(0, 'Banners are not allowed for this type').notRequired()
//     }),

//   products: yup
//     .array()
//     .of(yup.string().required('Product ID is required'))
//     .when('type', (type: any, schema: any) => {
//       // Validate products only if type is 'product_slider'
//       return type === 'product_slider'
//         ? schema.min(1, 'At least one product is required').required()
//         : schema.max(0, 'Products are not allowed for this type').notRequired()
//     })
// })

// // Default values
// const defaultValues = {
//   title: '',
//   type: 'banner', // or 'product_slider' depending on the initial form
//   banners: [{ imageUrl: '', linkUrl: '' }],
//   products: [],
//   status: true,
//   index: 0
// }

// // Exporting validation schema and default values
// const sectionSchema = {
//   sectionValidationSchema,
//   defaultValues
// }

// export default sectionSchema

import * as yup from 'yup'

// URL validation for links
const urlValidation = yup.string().url('Must be a valid URL').notRequired()

// File validation schema
const fileValidationSchema = yup.mixed()

// Section validation schema
const sectionValidationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),

  type: yup
    .string()
    .oneOf(['banner', 'product_slider'], 'Type must be either "banner" or "product_slider"')
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
    })
})

// Default values
const defaultValues = {
  title: '',
  type: 'banner', // or 'product_slider' depending on the initial form
  banners: [{ imageUrl: null, linkUrl: '' }], // Initialize with null for file
  products: [],
  status: true
}

// Exporting validation schema and default values
const sectionSchema = {
  sectionValidationSchema,
  defaultValues
}

export default sectionSchema
