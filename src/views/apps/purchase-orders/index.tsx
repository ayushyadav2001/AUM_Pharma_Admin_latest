// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports

import UserListCards from './UserListCards'
import PurchaseOrderListTable from './PurchaseOrderListTable'

const PurchaseOrderList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid className='hidden' item xs={12}>
        <UserListCards />
      </Grid>
      <Grid item xs={12}>
        <PurchaseOrderListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default PurchaseOrderList
