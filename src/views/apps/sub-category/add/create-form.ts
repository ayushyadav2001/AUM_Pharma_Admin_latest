import * as yup from 'yup'

const validateImageSize = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.src = URL.createObjectURL(file)

    img.onload = () => {
      const { width, height } = img

      if (width === 196 && height === 196) {
        resolve(true)
      } else {
        resolve(false)
      }
    }

    img.onerror = reject
  })
}

// Define Yup schema
const categoryValidationSchema = yup.object().shape({
  category: yup.string().required('Category is required'),
  name: yup.string().required('Category Name is required'),
  description: yup.string().notRequired(),
  image: yup
    .mixed()
    .required('Sub Category Image is required')
    .test('fileSize', 'Image size must be 196x196 pixels', async (value: any) => {
      if (!value) return false
      const isValid = await validateImageSize(value)

      return isValid
    })
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
