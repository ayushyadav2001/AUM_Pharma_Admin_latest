import * as yup from 'yup'

// Define Yup schema
const categoryValidationSchema = yup.object().shape({
  name: yup.string().required('Category Name is required'),
  description: yup.string().notRequired(),
  image: yup.mixed().required('Product Image is required')
})

const defaultValues = {
  name: '',
  description: '',
  image: ''
}

const createUserSchema = {
  categoryValidationSchema,
  defaultValues
}

export default createUserSchema
