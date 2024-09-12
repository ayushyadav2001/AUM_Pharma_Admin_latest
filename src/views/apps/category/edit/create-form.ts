import * as yup from 'yup'

// const validateImageSize = (file: File): Promise<boolean> => {
//   return new Promise((resolve, reject) => {
//     const img = new Image()

//     img.src = URL.createObjectURL(file)

//     img.onload = () => {
//       const { width, height } = img

//       if (width === 196 && height === 196) {
//         resolve(true)
//       } else {
//         resolve(false)
//       }
//     }

//     img.onerror = reject
//   })
// }

// Define Yup schema
const categoryValidationSchema = yup.object().shape({
  name: yup.string().required('Category Name is required'),
  add_to_header: yup.boolean().notRequired(),
  add_to_banner: yup.boolean().notRequired(),
  description: yup.string().notRequired(),
  image: yup.mixed().notRequired() // Image is not required
  // .test('fileSize', 'Image size must be 196x196 pixels', async (value: any) => {
  //   if (!value) return true // If no image, skip validation
  //   const isValid = await validateImageSize(value)

  //   return isValid
  // })
  // .test('fileType', 'Unsupported file format', (value: any) => {
  //   if (!value) return true // If no image, skip validation

  //   return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
  // })
})

const defaultValues = {
  name: '',
  add_to_header: false,
  add_to_banner: false,
  description: '',
  image: null
}

const createUserSchema = {
  categoryValidationSchema,
  defaultValues
}

export default createUserSchema
