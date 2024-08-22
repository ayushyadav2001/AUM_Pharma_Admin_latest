import * as yup from 'yup'

// Define Yup schema
const customerValidationSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().email('Email is invalid').required('Email is required'),
  mobileNumber: yup.string().required('Mobile Number is required'),
  street: yup.string().required('Street is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  postalCode: yup.string().required('Postal Code is required'),
  country: yup.string().required('Country is required')
})

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  mobileNumber: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: ''
}

const createCustomerSchema = {
  customerValidationSchema,
  defaultValues
}

export default createCustomerSchema
