// React Imports
import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

type FileProp = {
  name: string
  type: string
  size: number
}

// type FileUploaderSingleProps = {
//   setValue: (fieldName: string, file: File | null) => void
//   fieldName: string
// }

const FileUploaderSingleExcel = ({ setValue, fieldName }: any) => {
  // States
  const [files, setFiles] = useState<File[]>([])

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,

    // accept: {
    //   'application/vnd.ms-excel': ['.xls'],
    //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    // },

    onDrop: (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]

      setFiles([file])
      setValue(fieldName, file)

      // setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    }
  })

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]

  //   if (file) {
  //     setFiles([file])

  //     setValue(fieldName, file) // Update form state with the selected file
  //   }
  // }

  const img = files.map((file: FileProp, index: number) => (
    <div key={index} className='text-center flex justify-center items-center '>
      <Typography key={file.name} variant='body1'>
        {file.name}
      </Typography>
    </div>
  ))

  return (
    <div className='border mb-4 border-dashed min-h-[200px]  max-h-[200px] cursor-pointer  rounded-xs p-5'>
      <Box {...getRootProps({ className: 'dropzone' })} {...(files.length && { sx: { height: 450 } })}>
        <input {...getInputProps()} />
        {files.length ? (
          img
        ) : (
          <div className='flex items-center flex-col'>
            <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
              <i className='ri-upload-2-line' />
            </Avatar>
            <Typography variant='h4' className='mbe-2.5'>
              Drop files here or click to upload.
            </Typography>
            <Typography color='text.secondary'>
              Drop files here or click{' '}
              <a href='/' onClick={e => e.preventDefault()} className='text-textPrimary no-underline'>
                browse
              </a>{' '}
              thorough your machine
            </Typography>
          </div>
        )}
      </Box>
    </div>
  )
}

export default FileUploaderSingleExcel
