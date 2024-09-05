// React Imports

// MUI Imports
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

import Button from '@mui/material/Button'

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

// Vars

const StepPropertyFeatures = ({
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
            {...register('side_effects')}
            fullWidth
            multiline
            minRows={2}
            label='Side Effects'
            placeholder='Enter product side effects'
          />
          <FormHelperText className='text-red-600'>{errors.side_effects?.message}</FormHelperText>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('contra_indications')}
            fullWidth
            multiline
            minRows={2}
            label='Contra-indications'
            placeholder='Enter contra-indications'
          />
          <FormHelperText className='text-red-600'>{errors.contra_indications?.message}</FormHelperText>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('special_precautions_while_taking')}
            fullWidth
            multiline
            minRows={2}
            label='Special Precautions While Taking'
            placeholder='Enter special precautions while taking'
          />
          <FormHelperText className='text-red-600'>{errors.special_precautions_while_taking?.message}</FormHelperText>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('pregnancy_related_information')}
            fullWidth
            multiline
            minRows={2}
            label='Pregnancy Related Information'
            placeholder='Enter pregnancy related information'
          />
          <FormHelperText className='text-red-600'>{errors.pregnancy_related_information?.message}</FormHelperText>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('product_and_alcohol_interaction')}
            fullWidth
            multiline
            minRows={2}
            label='Product and Alcohol Interaction'
            placeholder=' Enter product and alcohol interaction'
          />
          <FormHelperText className='text-red-600'>{errors.product_and_alcohol_interaction?.message}</FormHelperText>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('old_age_related_information')}
            fullWidth
            multiline
            minRows={2}
            label='Old Age Related Information'
            placeholder='Enter old age related information'
          />
          <FormHelperText className='text-red-600'>{errors.old_age_related_information?.message}</FormHelperText>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('breast_feeding_related_information')}
            fullWidth
            multiline
            minRows={2}
            label='Breast Feeding Related Information'
            placeholder=' Enter breast feeding related information'
          />
          <FormHelperText className='text-red-600'>{errors.breast_feeding_related_information?.message}</FormHelperText>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('children_related_information')}
            fullWidth
            multiline
            minRows={2}
            label='Children Related Information'
            placeholder='Enter children related information'
          />
          <FormHelperText className='text-red-600'>{errors.children_related_information?.message}</FormHelperText>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('indications')}
            fullWidth
            multiline
            minRows={2}
            label='Indications'
            placeholder='Enter indications'
          />
          <FormHelperText className='text-red-600'>{errors.indications?.message}</FormHelperText>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('interactions')}
            fullWidth
            multiline
            minRows={2}
            label='Interactions'
            placeholder='Enter interactions'
          />
          <FormHelperText className='text-red-600'>{errors.interactions?.message}</FormHelperText>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('typical_dosage')}
            fullWidth
            multiline
            minRows={2}
            label='Typical Dosage'
            placeholder='Enter typical dosage'
          />
          <FormHelperText className='text-red-600'>{errors.typical_dosage?.message}</FormHelperText>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('storage_requirements')}
            fullWidth
            multiline
            minRows={2}
            label='Storage Requirements'
            placeholder='Enter storage requirement'
          />
          <FormHelperText className='text-red-600'>{errors.storage_requirements?.message}</FormHelperText>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('effects_of_missed_dosage')}
            fullWidth
            multiline
            minRows={2}
            label='Effects of Missed Dosage'
            placeholder='Enter effects of missed dosage'
          />
          <FormHelperText className='text-red-600'>{errors.effects_of_missed_dosage?.message}</FormHelperText>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('effects_of_overdose')}
            fullWidth
            multiline
            minRows={2}
            label='Effects of Overdose'
            placeholder='Enter effects of overdose'
          />
          <FormHelperText className='text-red-600'>{errors.effects_of_overdose?.message}</FormHelperText>
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

export default StepPropertyFeatures
