import * as yup from 'yup'

// Define Yup schema
const categoryValidationSchema = yup.object().shape({
  subCategory: yup.string().required('Secondary Sub Category is required'),
  name: yup.string().required('Secondary Sub Category Name is required'),
  description: yup.string().notRequired(),
  image: yup.mixed().notRequired()
})

const defaultValues = {
  subCategory: '',
  name: '',
  description: '',
  image: null
}

const createUserSchema = {
  categoryValidationSchema,
  defaultValues
}

export default createUserSchema
