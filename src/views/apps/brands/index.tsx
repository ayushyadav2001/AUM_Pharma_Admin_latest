'use client'

// MUI Imports
import { useParams } from 'next/navigation'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Type Imports
import { Button } from '@mui/material'

import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
// import RoleCards from './RoleCards'

import Link from '@/components/Link'

import BrandsTable from './BrandsTable'

const Brands = ({ userData }: { userData?: UsersType[] }) => {
  const { lang: locale } = useParams()

  return (
    <Grid container spacing={6}>
      <Grid item xs={6} className='!pbs-12 hidden'>
        <Typography variant='h4' className='mbe-1'>
          Total users with their roles
        </Typography>
        <Typography>Find all of your company&#39;s administrator accounts and their associate roles.</Typography>
      </Grid>
      <Grid item xs={6} className='!pbs-12 text-end hidden'>
        <Link className='' href={`/${locale}/apps/brands/add`}>
          <Button variant='contained' className='is-full sm:is-auto'>
            Add
          </Button>
        </Link>
      </Grid>
      <Grid item xs={12}>
        <BrandsTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default Brands
