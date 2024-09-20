import * as yup from 'yup'

// URL validation schema
const urlValidation = yup.string().nullable()

// File validation schema for image URLs
const fileValidationSchema = yup.mixed().required('Image is required')

// Slider image validation schema for both left and right sliders
const sliderImageSchema = yup.object().shape({
  imageUrl: fileValidationSchema, // imageUrl is required
  link: urlValidation.notRequired() // link is optional, can be null or a valid URL
})

// Main validation schema
const sectionValidationSchema = yup.object().shape({
  leftSliderImages: yup
    .array()
    .of(sliderImageSchema) // Validate each object in the array
    .min(1, 'At least one left slider image is required')
    .required('Left slider images are required'),

  rightSliderImages: yup
    .array()
    .of(sliderImageSchema) // Validate each object in the array
    .min(1, 'At least one right slider image is required')
    .required('Right slider images are required')
})

// Default values
const defaultValues = {
  leftSliderImages: [{ imageUrl: null, link: null }], // Initialize with default values
  rightSliderImages: [{ imageUrl: null, link: null }] // Initialize with default values
}

// Exporting validation schema and default values
const sectionSchema = {
  sectionValidationSchema,
  defaultValues
}

export default sectionSchema
