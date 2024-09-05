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

const FileUploaderSingle = ({ setValue, fieldName }: any) => {
  // States
  const [files, setFiles] = useState<File[]>([])

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
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

  const img = files.map((file: FileProp) => (
    <img
      key={file.name}
      alt={file.name}
      className='single-file-image w-full h-full max-h-[150px] object-cover'
      src={URL.createObjectURL(file as any)}
    />
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

export default FileUploaderSingle
