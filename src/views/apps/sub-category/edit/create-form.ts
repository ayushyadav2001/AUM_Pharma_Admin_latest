import * as yup from 'yup'

// Define Yup schema
const categoryValidationSchema = yup.object().shape({
  category: yup.string().required('Category is required'),
  name: yup.string().required('Category Name is required'),
  description: yup.string().notRequired(),
  image: yup.mixed().required('Sub Category Image is required')
})

const defaultValues = {
  category: '',
  name: '',
  description: '',
  image: null
}

const createUserSchema = {
  categoryValidationSchema,
  defaultValues
}

export default createUserSchema
