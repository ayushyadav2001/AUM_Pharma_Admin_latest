"use client"


import Grid from '@mui/material/Grid'




import type { UsersType } from '@/types/apps/userTypes'





import PackageTypesTable from './ProductFormTable'

const ProductForms = ({ userData }: { userData?: UsersType[] }) => {



  return (
    <Grid container spacing={6}>



      <Grid item xs={12}>
        <PackageTypesTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default ProductForms
