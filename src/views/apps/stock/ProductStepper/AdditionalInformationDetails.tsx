// React Imports

// MUI Imports
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

import Button from '@mui/material/Button'

// Component Imports

import { FormHelperText } from '@mui/material'

import DirectionalIcon from '@components/DirectionalIcon'

// Styled Component Imports

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
  register: any
  errors: any
  setValue: any
  handleSubmit: any
  onSubmit: any
}

const StepPropertyDetails = ({
  activeStep,
  handleNext,
  handlePrev,
  steps,
  register,
  errors,
  handleSubmit,
  onSubmit
}: Props) => {
  // States

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('expert_advice')}
            fullWidth
            multiline
            minRows={2}
            type='text'
            label='Expert Advice'
            placeholder='Enter product expert advice'
          />
          <FormHelperText className='text-red-600'>{errors.expert_advice?.message}</FormHelperText>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('how_to_use')}
            fullWidth
            multiline
            minRows={2}
            type='text'
            label='How to Use'
            placeholder='Enter how to use'
          />
          <FormHelperText className='text-red-600'>{errors.how_to_use?.message}</FormHelperText>
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            {...register('faqs')}
            fullWidth
            type='text'
            label='FAQs'
            placeholder='Enter FAQs'
            multiline
            minRows={2}
          />
          <FormHelperText className='text-red-600'>{errors.faqs?.message}</FormHelperText>
        </Grid>

        <Grid item xs={12} className='pbs-6'>
          <div className='flex items-center justify-between'>
            <Button
              variant='outlined'
              color='secondary'
              disabled={activeStep === 0}
              onClick={handlePrev}
              startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
            >
              Previous
            </Button>
            <Button
              variant='contained'
              color={activeStep === steps.length - 1 ? 'success' : 'primary'}
              onClick={handleNext}
              type='submit'
              endIcon={
                activeStep === steps.length - 1 ? (
                  <i className='ri-check-line' />
                ) : (
                  <DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />
                )
              }
            >
              {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </Grid>
      </Grid>
    </form>
  )
}

export default StepPropertyDetails
