"use client"


import Grid from '@mui/material/Grid'




import type { UsersType } from '@/types/apps/userTypes'





import ManufacturerTable from './ManufacturerTable'

const Manufacturers = ({ userData }: { userData?: UsersType[] }) => {



  return (
    <Grid container spacing={6}>



      <Grid item xs={12}>
        <ManufacturerTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default Manufacturers
