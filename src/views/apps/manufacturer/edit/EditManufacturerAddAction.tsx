/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

// React Imports
import { useEffect, useState } from 'react'

// import { useRouter } from 'next/router'

import { useRouter } from 'next/navigation'

import { useDispatch } from 'react-redux'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'

// MUI Imports
// Third-party Imports

// import type { Theme } from '@mui/material/styles'

// Third-party Imports
// import type { SubmitHandler } from 'react-hook-form'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import axios from 'axios'

import { toast } from 'react-toastify'

import { Country, State, City } from 'country-state-city';

// import createProductSchema from './create-form'


import { setData } from '@/redux-store/slices/customerSlice'
import createUserSchema from './create-form'
import FileUploaderSingle from '../../customers/ProductFileUpload/FileUploaderSingle'
import { setUsersData } from '@/redux-store/slices/userSlice'
import { setPackagingTypeData } from '@/redux-store/slices/packagingType.Slice'
import { setManufacturersData } from '@/redux-store/slices/manufacturerSlice'

const EditManufacturerActions = ({ data, id }: { data?: any, id?: any }) => {
  // States
  const router = useRouter()

  const dispatch = useDispatch()
  const { userValidationSchema, defaultValues } = createUserSchema




  const {
    register,

    setValue,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(userValidationSchema),
    defaultValues: {
      name: data.name,
      address: data?.address,
      city: data?.city,
      state: data?.state,
      postal_code: data?.postal_code,
      country: data?.country
    }
  })



  const [countries, setCountries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<any>([]);
  const [cities, setCities] = useState<any>([]);
  const [selectedCountry, setSelectedCountry] = useState(data?.country);
  const [selectedState, setSelectedState] = useState(data?.state);
  const [selectedCity, setSelectedCity] = useState(`${data?.city}`);


  const handleCountryChange = (event: any) => {
    const countryName = event.target.value;

    setValue("country", countryName)
    setSelectedCountry(countryName);
    const selectedCountryObj = countries.find((country: any) => country.name === countryName);

    if (selectedCountryObj) {
      setStates(State.getStatesOfCountry(selectedCountryObj.isoCode));
      setCities([]); // Clear cities when a new country is selected
    }
  };

  const handleStateChange = (event: any) => {
    const stateName = event.target.value;

    setValue("state", stateName)

    setSelectedState(stateName);
    const selectedStateObj = states.find((state: any) => state.name === stateName);

    if (selectedStateObj) {
      setCities(City.getCitiesOfState(selectedStateObj.countryCode, selectedStateObj.isoCode));
    }
  };

  const handleCityChangeChange = (event: any) => {
    const stateCode = event.target.value;

    setSelectedCity(stateCode);
    setValue("city", stateCode)

  };

  // useEffect(() => {
  //   const selectedCountryObj = countries.find((country: any) => country.name === 'India')

  //   if (selectedCountryObj) {
  //     setStates(State.getStatesOfCountry(selectedCountryObj.isoCode))
  //   }
  // }, [countries])

  useEffect(() => {
    if (data) {
      // Set the default selected country
      const selectedCountryObj = countries.find((country: any) => country.name === data.country)

      if (selectedCountryObj) {
        setSelectedCountry(selectedCountryObj.name)
        setStates(State.getStatesOfCountry(selectedCountryObj.isoCode))

        // Set the default selected state after country is set
        const selectedStateObj = State.getStatesOfCountry(selectedCountryObj.isoCode).find((state: any) => state.name === data.state)

        if (selectedStateObj) {
          setSelectedState(selectedStateObj.name)
          setCities(City.getCitiesOfState(selectedStateObj.countryCode, selectedStateObj.isoCode))

          // Set the default selected city after state is set
          setSelectedCity(data.city)
        }
      }

      // Reset form fields with the fetched data
      reset({
        name: data?.name || '',
        address: data?.address || '',
        postal_code: data?.postal_code || '',
        country: data?.country || '',
        state: data?.state || '',
        city: data?.city || ''
      })
    }
  }, [data, countries, reset])



  const fetchLatestData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/manufacturer/get-all-manufacturer`, { withCredentials: true })

      dispatch(setManufacturersData(response.data.data)) // Ensure `setData` action is correctly set
    } catch (err) {
      console.error('Failed to fetch sub admins', err) // Log the error for debugging

    }
  }


  const onSubmit = async (data: any) => {

    try {
      const response = await axios
        .put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/manufacturer/update-manufacturer/${id}`, data, { withCredentials: true })
        .then(res => {
          toast.success('Manufacturer Updated Successfully!')
          fetchLatestData()
          router.push('/apps/manufacturer')
        })
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Something went wrong!')
    }
  }

  // Fetch vendors when the component mounts

  useEffect(() => {
    if (data) {
      reset({
        name: data?.name || "",
        address: data?.address || "",
        city: data?.city || "",
        state: data?.state || "",
        postal_code: data?.postal_code || "",
        country: data?.country || ""
      });
    }
  }, [data, reset]);

  return (
    <Card>
      <CardHeader
        title='Edit Manufacturer'
        titleTypographyProps={{
          variant: 'h5',
          color: 'primary'
        }}
      />
      <CardContent className='sm:!p-12'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6} className=' '>

            <Grid item xs={12} md={4}>
              <TextField

                error={!!errors.name} // `error` expects a boolean
                helperText={errors.name?.message?.toString() || ''}
                InputLabelProps={{
                  shrink: !!data?.name
                }} defaultValue={data?.name}
                {...register('name')} fullWidth id='outlined-basic' label='Manufacturer Name' />

            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                InputLabelProps={{
                  shrink: !!data?.address
                }} defaultValue={data?.address}
                type="text"
                error={!!errors.address} // `error` expects a boolean
                helperText={errors.address?.message?.toString() || ''}
                {...register('address')} fullWidth id='outlined-basic' label='Address' />

            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                type="text"
                error={!!errors.postal_code} // `error` expects a boolean
                helperText={errors.postal_code?.message?.toString() || ''}
                {...register('postal_code')} fullWidth id='outlined-basic' label='Postal Code' />

            </Grid>


            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!errors.country}>
                <InputLabel id="country-label">Country</InputLabel>
                <Select
                  labelId="country-label"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  label="Country"

                // {...register('country')}
                >
                  {countries.map((country) => (
                    <MenuItem key={country.isoCode} value={country.name}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.country?.message?.toString() || ''}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!errors.state}>
                <InputLabel id="state-label">State</InputLabel>
                <Select
                  labelId="state-label"
                  value={selectedState}
                  onChange={handleStateChange}
                  label="State"

                  // {...register('state')}
                  disabled={!selectedCountry} // Disable if no country is selected
                >
                  {states.map((state: any) => (
                    <MenuItem key={state.isoCode} value={state.name} >
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.state?.message?.toString() || ''}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!errors.city}>
                <InputLabel id="city-label">City</InputLabel>
                <Select
                  labelId="city-label"
                  value={selectedCity}
                  {...register('city')}
                  label="City"
                  onChange={handleCityChangeChange}
                  disabled={!selectedState} // Disable if no state is selected
                >
                  {cities.map((city: any) => (
                    <MenuItem key={city.name} value={city.name}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.city?.message?.toString() || ''}</FormHelperText>
              </FormControl>
            </Grid>









          </Grid>
          <div className='flex justify-center mt-4'>
            <Button type='submit' color='primary' variant='contained' className='capitalize'>
              Update
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default EditManufacturerActions
