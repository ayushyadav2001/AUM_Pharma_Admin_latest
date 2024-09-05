// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports

import UserListCards from './UserListCards'

import StockAdjustmentListTable from './StockAdjustmentListTable'

const StockAdjustmentList = ({ userData }: { userData?: UsersType[] }) => {

  console.log("userData", userData)

  return (
    <Grid container spacing={6}>
      <Grid className='hidden' item xs={12}>
        <UserListCards />
      </Grid>
      <Grid item xs={12}>
        <StockAdjustmentListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default StockAdjustmentList
