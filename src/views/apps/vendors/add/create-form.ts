import * as yup from 'yup'

// Define Yup schema
const supplierValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  format: yup.string().required('Format is required'),
  pinCode: yup
    .string()
    .required('PIN Code is required')
    .length(6, 'PIN Code must be 6 digits')
    .matches(/^[0-9]+$/, 'PIN Code must be a number'),
  addressLine: yup.string().required('Address Line is required'),
  phoneNumber: yup
    .string()
    .required('Phone Number is required')
    .length(10, 'Phone Number must be 10 digits')
    .matches(/^[0-9]+$/, 'Phone Number must be a number'),
  email: yup.string().email('Email is invalid').required('Email is required'),
  gstNumber: yup.string().required('GST Number is required'),
  panNumber: yup
    .string()
    .required('PAN Number is required')
    .length(10, 'PAN Number must be exactly 10 characters')
    .matches(/^[a-zA-Z0-9]+$/, 'PAN Number must be alphanumeric'),
  dlNumber: yup.string().required('DL Number is required'),
  foodLicenseNumber: yup.string().required('Food License Number is required'),
  contactPersonName: yup.string().required('Contact Person Name is required'),
  contactPersonMobileNumber: yup
    .string()
    .required('Contact Person Mobile Number is required')
    .length(10, 'Contact Person Mobile Number must be 10 digits')
    .matches(/^[0-9]+$/, 'Contact Person Mobile Number must be a number'),
  contactPersonPhoneNumber: yup.string().required('Contact Person Phone Number is required'),
  msmeNumber: yup.string().required('MSME Number is required'),
  fssNumber: yup.string().required('FSS Number is required'),
  bankName: yup.string().notRequired(),
  accountNumber: yup.string().notRequired(),
  ifscCode: yup.string().notRequired(),
  payable: yup.string().required('Payable amount is required'),
  due: yup.string().required('Due amount is required')
})

const defaultValues = {
  name: '',
  state: '',
  city: '',
  format: '',
  pinCode: '',
  addressLine: '',
  phoneNumber: '',
  email: '',
  gstNumber: '',
  panNumber: '',
  dlNumber: '',
  foodLicenseNumber: '',
  contactPersonName: '',
  contactPersonMobileNumber: '',
  contactPersonPhoneNumber: '',
  msmeNumber: '',
  fssNumber: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  payable: '0',
  due: '0'
}

const createProductSchema = {
  supplierValidationSchema,
  defaultValues
}

export default createProductSchema
