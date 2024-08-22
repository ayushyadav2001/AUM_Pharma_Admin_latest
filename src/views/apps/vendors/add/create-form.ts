import * as yup from 'yup'

// Define Yup schema
const supplierValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  format: yup.string().required('Format is required'),
  pinCode: yup.string().required('PIN Code is required'),
  addressLine: yup.string().required('Address Line is required'),
  phoneNumber: yup.string().required('Phone Number is required'),
  email: yup.string().email('Email is invalid').required('Email is required'),
  gstNumber: yup.string().required('GST Number is required'),
  panNumber: yup.string().required('PAN Number is required'),
  dlNumber: yup.string().required('DL Number is required'),
  foodLicenseNumber: yup.string().required('Food License Number is required'),
  contactPersonName: yup.string().required('Contact Person Name is required'),
  contactPersonMobileNumber: yup.string().required('Contact Person Mobile Number is required'),
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
