import * as yup from 'yup'

// Define Yup schema
const brandsValidationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  link: yup.string().required('Link is required'),

  // Using `yup.mixed()` to validate a file, ensuring it's required
  banner: yup.mixed().notRequired()
})

const defaultValues = {
  title: '',
  link: '',
  image: null // Image starts as null
}

const createBrandsSchema = {
  brandsValidationSchema,
  defaultValues
}

export default createBrandsSchema
