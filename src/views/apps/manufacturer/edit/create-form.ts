import * as yup from 'yup'

// Define Yup schema
const userValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),

  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  postal_code: yup.string().required('Postal code is required'),
  country: yup.string().required('Country is required')
})

const defaultValues = {
  name: '',

  address: '',
  city: '',
  state: '',
  postal_code: '',
  country: ''
}

const createUserSchema = {
  userValidationSchema,
  defaultValues
}

export default createUserSchema
