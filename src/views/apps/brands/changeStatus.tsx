/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material'

interface ConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
  isActive: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ConfirmationDialogStatusChange: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  itemName,
  isActive
}) => {
  return (
    <Dialog maxWidth='sm' fullWidth open={open} onClose={onClose} aria-labelledby='confirmation-dialog-title'>
      <DialogTitle id='confirmation-dialog-title'>
        <Typography variant='h6'>Confirm Status Change</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant='body1'>{`Are you sure you want to ${isActive ? 'Inactivate' : 'Activate'}?`}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          No
        </Button>
        <Button
          onClick={() => {
            onConfirm()
            onClose()
          }}
          color='secondary'
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialogStatusChange
