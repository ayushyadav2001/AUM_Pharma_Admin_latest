// React Imports
import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'


// Third-party Imports
import { useDropzone } from 'react-dropzone'



const FileUploaderSingleExcel = ({ setValue, fieldName }: any) => {
  // States
  const [files, setFiles] = useState<File[]>([])

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,

    // accept: '.xlsx, .xls',

    onDrop: (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]



      setFiles([file])
      setValue(fieldName, file)
    }
  })

  const handleRemoveFile = () => {
    setFiles([])
    setValue(fieldName, null) // Clear the file in form state
  }





  return (
    <div className='relative  border mb-4 border-dashed min-h-[200px] max-h-[200px] cursor-pointer rounded-xs p-5'>
      <Box
        {...getRootProps({ className: 'dropzone' })}
        sx={{ height: files.length ? 450 : 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      >
        <input  {...getInputProps()} />
        {files.length ? (
          <div className=' text-center flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <Typography variant='body1' className='mbe-2'>
              {files[0].name}
            </Typography>
            <IconButton className='text-center' onClick={handleRemoveFile} color='primary'>
              <i className='ri-delete-bin-5-line bg-blue-500 mr-2' />
            </IconButton>
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
              through your machine
            </Typography>
          </div>
        )}
      </Box>
    </div>
  )
}

export default FileUploaderSingleExcel
