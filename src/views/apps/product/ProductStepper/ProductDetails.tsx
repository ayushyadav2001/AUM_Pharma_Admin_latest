// React Imports

// MUI IMports
import Grid from '@mui/material/Grid'

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Third-party Imports

// Type Imports

// Component Imports

import { FormHelperText } from '@mui/material'

import DirectionalIcon from '@components/DirectionalIcon'

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
  setValue,
  handleSubmit,
  onSubmit
}: Props) => {
  // Vars

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                type='text'
                {...register('composition')}
                label='Composition'
                placeholder='Enter product composition'
              />
              <FormHelperText className='text-red-600'>{errors.composition?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                {...register('usage')}
                fullWidth
                multiline
                minRows={2}
                label='Usage'
                placeholder='Enter product Usage'
              />
              <FormHelperText className='text-red-600'>{errors.usage?.message}</FormHelperText>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id='packing-type'>Packing Type</InputLabel>
                <Select
                  onChange={(e: any) => {
                    setValue('packing_type', e.target?.value)
                  }}
                  id='packing-type'
                  label='Furnished Status'
                  labelId='select-furnished-status'
                  defaultValue=''
                >
                  <MenuItem value='strip'>Strip</MenuItem>
                  <MenuItem value='bottle'>Bottle</MenuItem>
                  <MenuItem value='packet'>Packet</MenuItem>
                  <MenuItem value='prefilled syringe'>Prefilled Syringe</MenuItem>
                  <MenuItem value='tube'>Tube</MenuItem>
                  <MenuItem value='vial'>vial</MenuItem>
                </Select>
                <FormHelperText className='text-red-600'>{errors.packing_type?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField {...register('packaging')} fullWidth label='Packaging' placeholder='Enter product Packaging' />
              <FormHelperText className='text-red-600'>{errors.packaging?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                {...register('Schedule')}
                fullWidth
                multiline
                minRows={2}
                label='Schedule'
                placeholder='Enter product schedule'
              />
              <FormHelperText className='text-red-600'>{errors.Schedule?.message}</FormHelperText>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                {...register('about_salt')}
                fullWidth
                multiline
                minRows={2}
                label='About Salt'
                placeholder='Enter product about salt'
              />
              <FormHelperText className='text-red-600'>{errors.about_salt?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                {...register('mechanism_of_action')}
                minRows={2}
                label='Mechanism of Action'
                placeholder='Enter mechanism of action'
              />
              <FormHelperText className='text-red-600'>{errors.mechanism_of_action?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                {...register('pharmacokinets')}
                label='Pharmacokinetics'
                placeholder='Enter product Pharmacokinetics'
              />
              <FormHelperText className='text-red-600'>{errors.pharmacokinets?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                {...register('onset_of_action')}
                fullWidth
                label='Onset of Action'
                placeholder='Enter Onset of Action'
              />
              <FormHelperText className='text-red-600'>{errors.onset_of_action?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                {...register('duration_of_action')}
                fullWidth
                label='Duration of Action'
                placeholder='Enter duration of action'
              />
              <FormHelperText className='text-red-600'>{errors.duration_of_action?.message}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField {...register('half_life')} fullWidth label='Half Life' placeholder='Enter half life' />

              <FormHelperText className='text-red-600'>{errors.half_life?.message}</FormHelperText>
            </Grid>

            {/* <Grid item xs={12}>
            <TextField fullWidth multiline minRows={2} label='Address' placeholder='12, Business Park' />
          </Grid> */}
          </Grid>
        </Grid>
        <Grid item xs={12}>
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
              type='submit'
              color={activeStep === steps.length - 1 ? 'success' : 'primary'}
              onClick={handleNext}
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
