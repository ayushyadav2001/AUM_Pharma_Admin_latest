'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

// Third-party Imports

// import DefaultAvatar from "@assets/defaultImages/default-Avator-transformed.png"

// Type Imports
import { toast } from 'react-toastify'

import axios from 'axios'

import type { Locale } from '@configs/i18n'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'


// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false)

  const [user, setUser] = useState<{ profilePicture: string, firstName: string, lastName: string, email: string } | null>(null)

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Hooks
  const router = useRouter()

  const { settings } = useSettings()
  const { lang: locale } = useParams()



  useEffect(() => {
    // Get user data from session storage
    const userData = sessionStorage.getItem('user')

    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])


  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(getLocalizedUrl(url, locale as Locale))
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleUserLogout = async () => {


    try {
      // Log the start of the logout process
      console.log("Starting logout");

      // Make the API call to the backend logout endpoint
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/logout`, {}, {
        withCredentials: true,
      });

      toast.success(response.data.message || "Logout successful");

      // Clear session storage
      sessionStorage.clear();

      // Log the successful logout
      console.log("Logout successful");

      // Optionally redirect to the login page
      router.push('/login');
    } catch (error) {
      console.error("Error during logout:", error);

      // Optionally show an error message in a toast
      // toastService.error((error.response?.data?.error) || (error.message));

      // Handle any additional error handling logic here
    }
  };





  return (
    <>
      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
      >

        <Avatar
          ref={anchorRef}
          alt={user?.firstName || 'User'}

          // src={user ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${user.profilePicture}` : `${DefaultAvatar}`}

          src={'https://img.freepik.com/premium-photo/3d-avatar-cartoon-character_113255-93124.jpg?w=740'}

          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
        />
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-4 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper
              elevation={settings.skin === 'bordered' ? 0 : 8}
              {...(settings.skin === 'bordered' && { className: 'border' })}
            >
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-4 gap-2' tabIndex={-1}>
                    <Avatar alt={user?.firstName || 'User'} src={'https://img.freepik.com/premium-photo/3d-avatar-cartoon-character_113255-93124.jpg?w=740'} />
                    <div className='flex items-start flex-col'>
                      <Typography variant='body2' className='font-medium' color='text.primary'>
                        {user ? `${user.firstName} ${user.lastName}` : 'User'}

                      </Typography>
                      <Typography variant='caption'>{user?.email || 'user@example.com'}</Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  <MenuItem className='gap-3 pli-4' onClick={e => handleDropdownClose(e, '/pages/user-profile')}>
                    <i className='ri-user-3-line' />
                    <Typography color='text.primary'>My Profile</Typography>
                  </MenuItem>
                  <MenuItem className='gap-3 pli-4' onClick={e => handleDropdownClose(e, '/pages/account-settings')}>
                    <i className='ri-settings-4-line' />
                    <Typography color='text.primary'>Settings</Typography>
                  </MenuItem>
                  <MenuItem className='gap-3 pli-4' onClick={e => handleDropdownClose(e, '/pages/pricing')}>
                    <i className='ri-money-dollar-circle-line' />
                    <Typography color='text.primary'>Pricing</Typography>
                  </MenuItem>
                  <MenuItem className='gap-3 pli-4' onClick={e => handleDropdownClose(e, '/pages/faq')}>
                    <i className='ri-question-line' />
                    <Typography color='text.primary'>FAQ</Typography>
                  </MenuItem>
                  <div className='flex items-center plb-1.5 pli-4'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='ri-logout-box-r-line' />}
                      onClick={handleUserLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default UserDropdown
