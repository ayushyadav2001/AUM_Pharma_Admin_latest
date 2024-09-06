import * as yup from 'yup'

// Define Yup schema
const userValidationSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().email('Email is invalid').required('Email is required'),
  phoneNumber: yup.string().required('Mobile Number is required'),
  password: yup.string().required('Password is required'),
  gender: yup.string().required('Gender is required'),
  profilePicture: yup.string().notRequired(),
  username: yup.string().required('Postal Code is required'),
  role: yup.string().required('Country is required')
})

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  gender: '',
  profilePicture: '',
  username: '',
  role: ''
}

const createUserSchema = {
  userValidationSchema,
  defaultValues
}

export default createUserSchema
