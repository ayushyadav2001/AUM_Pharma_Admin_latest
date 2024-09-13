import * as yup from 'yup'

// Define Yup schema
const userValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required')
})

const defaultValues = {
  name: ''
}

const createUserSchema = {
  userValidationSchema,
  defaultValues
}

export default createUserSchema
