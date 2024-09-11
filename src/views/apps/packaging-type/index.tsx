"use client"


import Grid from '@mui/material/Grid'




import type { UsersType } from '@/types/apps/userTypes'




import PackagingTypesTable from './PackagingTypeTable'

const PackagingTypes = ({ userData }: { userData?: UsersType[] }) => {



  return (
    <Grid container spacing={6}>



      <Grid item xs={12}>
        <PackagingTypesTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default PackagingTypes
