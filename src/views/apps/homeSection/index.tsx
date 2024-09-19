"use client"

// MUI Imports
import { useParams } from 'next/navigation'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Type Imports
import { Button } from '@mui/material'



import type { UsersType } from '@/types/apps/userTypes'

// Component Imports

import Link from '@/components/Link'
import HomeSectionTable from './HomeSectionTable'

const HomeSectionList = ({ userData }: { userData?: UsersType[] }) => {

  const { lang: locale } = useParams()

  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12}>
        <Typography variant='h4' className='mbe-1'>
          HomeSectionList List
        </Typography>
        <Typography>
          A role provided access to predefined menus and features so that depending on assigned role an administrator
          can have access to what he need
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <RoleCards />
      </Grid> */}
      <Grid item xs={6} className='!pbs-12 hidden'>
        <Typography variant='h4' className='mbe-1'>
          Total users with their roles
        </Typography>
        <Typography>Find all of your company&#39;s administrator accounts and their associate roles.</Typography>
      </Grid>
      <Grid item xs={6} className='!pbs-12 text-end hidden'>


        <Link className='' href={`/${locale}/apps/roles/add`}>
          <Button variant='contained' className='is-full sm:is-auto'>
            Add
          </Button>
        </Link>
      </Grid>
      <Grid item xs={12}>
        <HomeSectionTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default HomeSectionList
