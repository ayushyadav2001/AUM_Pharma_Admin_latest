// React Imports
import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { IconButton } from '@mui/material'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

type FileProp = {
  name: string
  type: string
  size: number
}

const FileUploaderMultiple = ({ setValue, fieldName }: any) => {
  // States
  const [files, setFiles] = useState<File[]>([])

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: true, // Allow multiple file uploads
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file: File) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )

      setFiles(prevFiles => [...prevFiles, ...newFiles]) // Add new files to existing state
      setValue(fieldName, [...files, ...newFiles]) // Update form state with all files
    }
  })

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)

    setFiles(newFiles)
    setValue(fieldName, newFiles) // Update form state after removing the file
  }

  // Image Preview
  const img = files.map((file: FileProp, index: number) => (
    <div key={file.name} className='relative w-full h-1/2 mb-3'>
      <img
        alt={file.name}
        className='single-file-image w-full h-full max-h-[150px] object-contain'
        src={URL.createObjectURL(file as any)}
      />
      <IconButton
        className='absolute top-0 right-0'
        aria-label='remove'
        onClick={(e: any) => {
          e.stopPropagation() // Prevent triggering the file input click
          handleRemoveFile(index)
        }}
      >
        <i className='ri-delete-bin-line'></i>
      </IconButton>
    </div>
  ))

  return (
    <div className='border mb-4 border-dashed min-h-[200px] h-full  cursor-pointer rounded-xs p-5'>
      <Box {...getRootProps({ className: 'dropzone' })} {...(files.length && { sx: {} })}>
        <input {...getInputProps()} />
        {files.length ? (
          <div className='grid grid-cols-2 gap-2'> {/* Grid layout for multiple images */}
            {img}
          </div>
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

export default FileUploaderMultiple
