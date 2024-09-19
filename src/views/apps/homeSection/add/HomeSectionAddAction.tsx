"use client"
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button, Card, CardContent, CardHeader, Checkbox, Divider, FormControlLabel, Grid, List, ListItem, TextField, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup'

import { useForm } from 'react-hook-form'

import { toast } from 'react-toastify'

import { setMasterData } from '@/redux-store/slices/masterSlice'
import Loader from '@/views/Loader/Loader'
import { setRolesData } from '@/redux-store/slices/rolesSlice'




// Define the schema using yup
const itemSchema = yup.object().shape({
  masterId: yup.string().required('Master ID is required'),
  visible: yup.boolean().required('Visibility is required'),
  submenus: yup.array().of(
    yup.object().shape({
      submenuId: yup.string().required('Submenu ID is required'),
      visible: yup.boolean().required('Visibility is required')
    })
  ).required('Submenus are required')
});

const roleValidationSchema = yup.object().shape({
  roleName: yup.string().required('Role name is required'),
  permissions: yup.array().of(itemSchema).required('Permissions are required').min(1, 'At least one permision is required'),
  allowAllPermissions: yup.boolean()
});

const defaultValues = {
  roleName: '',
  permissions: [],
  allowAllPermissions: false
};

const HomeSectionAdd = () => {

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const data = useSelector((state: any) => state?.masters?.data)


  const [selectedMasterIds, setSelectedMasterIds] = useState<string[]>([]);
  const [selectedSubMenus, setSelectedSubMenus] = useState<{ [key: string]: boolean }>({});

  const [adminAccess, setAdminAccess] = useState<boolean>(false);

  const dispatch = useDispatch()

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<any>({
    resolver: yupResolver(roleValidationSchema),
    defaultValues
  });

  const router = useRouter()

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/role/get-roles`, { withCredentials: true })

      dispatch(setRolesData(response.data.roles)) // Ensure `setData` action is correctly set
    } catch (err) {
      console.error('Failed to fetch products', err) // Log the error for debugging
      setError('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: any) => {

    console.log("submited", data)



    const formattedData = {
      roleName: data.roleName,
      permissions: data.permissions.map((perm: any) => ({
        masterId: perm.masterId,
        visible: perm.visible,
        submenus: perm.submenus.map((sub: any) => ({
          submenuId: sub.submenuId,
          visible: sub.visible
        }))
      })),
      allowAllPermissions: data.allowAllPermissions
    };

    try {

      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/role/create-role`, formattedData, { withCredentials: true }).then(() => {
        toast.success("Role added Successfully!")
        fetchProducts()
        setTimeout(() => {
          router.push("/apps/roles")
        }, 2000)

      })

    } catch (err) {
      console.error('Failed to submit', err);

    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/master/get-all-masters`, { withCredentials: true })

        dispatch(setMasterData(response.data.data)) // Ensure `setData` action is correctly set
      } catch (err) {
        console.error('Failed to fetch products', err) // Log the error for debugging
        setError('Failed to fetch products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [dispatch])

  useEffect(() => {
    if (adminAccess) {
      // Select all masters and their submenus
      const allMasterIds = data.map((master: any) => master._id);
      const allSubMenus: { [key: string]: boolean } = {};

      data.forEach((master: any) => {
        master.subMenus.forEach((submenu: any) => {
          allSubMenus[submenu._id] = true;
        });
      });

      setSelectedMasterIds(allMasterIds);
      setSelectedSubMenus(allSubMenus);
    } else {
      // Deselect all masters and their submenus
      setSelectedMasterIds([]);
      setSelectedSubMenus({});
    }
  }, [adminAccess, data]);




  console.log("masters data", data)


  // const handleMasterChange = (masterId: string) => {
  //   setSelectedMasterIds((prevState) =>
  //     prevState.includes(masterId)
  //       ? prevState.filter((id) => id !== masterId)
  //       : [...prevState, masterId]
  //   );
  // };

  // const handleMasterChange = (masterId: string) => {
  //   const isMasterChecked = selectedMasterIds.includes(masterId);

  //   setSelectedMasterIds((prevState) =>
  //     isMasterChecked
  //       ? prevState.filter((id) => id !== masterId)
  //       : [...prevState, masterId]
  //   );

  //   // Uncheck all associated submenus
  //   const updatedSubMenus = { ...selectedSubMenus };

  //   data.find((master: any) => master._id === masterId)?.subMenus.forEach((submenu: any) => {
  //     updatedSubMenus[submenu._id] = !isMasterChecked;
  //   });
  //   setSelectedSubMenus(updatedSubMenus);
  // };


  // const handleMasterChange = (masterId: string) => {
  //   setSelectedMasterIds((prevState) => {
  //     const isSelected = prevState.includes(masterId);

  //     const updatedMasterIds = isSelected
  //       ? prevState.filter(id => id !== masterId)
  //       : [...prevState, masterId];

  //     // Update submenu visibility based on master selection
  //     const updatedSubMenus = { ...selectedSubMenus }; // Get the current state of submenus

  //     data.forEach((master: any) => {
  //       if (master._id === masterId) {
  //         master.subMenus.forEach((submenu: any) => {
  //           updatedSubMenus[submenu._id] = !isSelected; // If master is unselected, uncheck all submenus
  //         });
  //       }
  //     });

  //     // Update form value
  //     setValue('permissions', data.map((master: any) => ({
  //       masterId: master._id,
  //       visible: updatedMasterIds.includes(master._id),
  //       submenus: master.subMenus.map((submenu: any) => ({
  //         submenuId: submenu._id,
  //         visible: updatedMasterIds.includes(master._id) ? updatedSubMenus[submenu._id] : false
  //       }))
  //     })));

  //     return updatedMasterIds;
  //   });
  // };

  console.log("errors", errors)


  const handleMasterChange = (masterId: string) => {
    setSelectedMasterIds((prevState) => {
      const isSelected = prevState.includes(masterId);

      // Update the list of selected master IDs
      const updatedMasterIds = isSelected
        ? prevState.filter(id => id !== masterId)
        : [...prevState, masterId];

      // Update submenu visibility based on master selection
      const updatedSubMenus = { ...selectedSubMenus }; // Copy current submenu state

      // Update the visibility of submenus based on the new master selection state
      data.forEach((master: any) => {
        if (master._id === masterId) {
          master.subMenus.forEach((submenu: any) => {
            updatedSubMenus[submenu._id] = !isSelected; // If master is unselected, uncheck all submenus
          });
        }
      });

      // Update form value
      setValue('permissions', data.map((master: any) => ({
        masterId: master._id,
        visible: updatedMasterIds.includes(master._id),
        submenus: master.subMenus.map((submenu: any) => ({
          submenuId: submenu._id,
          visible: updatedMasterIds.includes(master._id) ? updatedSubMenus[submenu._id] : false
        }))
      })));

      return updatedMasterIds;
    });
  };


  // const handleSubMenuChange = (submenuId: string) => {
  //   setSelectedSubMenus((prevState) => ({
  //     ...prevState,
  //     [submenuId]: !prevState[submenuId]
  //   }));
  // };
  const handleSubMenuChange = (submenuId: string) => {
    setSelectedSubMenus((prevState) => {
      const updatedSubMenus = {
        ...prevState,
        [submenuId]: !prevState[submenuId]
      };

      // Update permissions in the form
      setValue('permissions', data.map((master: any) => ({
        masterId: master._id,
        visible: selectedMasterIds.includes(master._id),
        submenus: master.subMenus.map((submenu: any) => ({
          submenuId: submenu._id,
          visible: updatedSubMenus[submenu._id] || false
        }))
      })));

      return updatedSubMenus;
    });
  };



  // const handleAdminAccessChange = (event: any) => {


  //   setAdminAccess(event.target.checked);
  // };

  const handleAdminAccessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;

    setAdminAccess(isChecked);

    // Update form value
    setValue('allowAllPermissions', isChecked);

    if (isChecked) {
      // Set all permissions and submenus
      const allMasterIds = data.map((master: any) => master._id);
      const allSubMenus: { [key: string]: boolean } = {};

      data.forEach((master: any) => {
        master.subMenus.forEach((submenu: any) => {
          allSubMenus[submenu._id] = true;
        });
      });

      setSelectedMasterIds(allMasterIds);
      setSelectedSubMenus(allSubMenus);

      // Set permissions in the form
      setValue('permissions', data.map((master: any) => ({
        masterId: master._id,
        visible: true,
        submenus: master.subMenus.map((submenu: any) => ({
          submenuId: submenu._id,
          visible: true
        }))
      })));
    } else {
      // Clear permissions and submenus
      setSelectedMasterIds([]);
      setSelectedSubMenus({});
      setValue('permissions', []);
    }
  };

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <div>{error}</div>
  }



  return (
    <div>
      <Card >
        <CardHeader title='Add Role' className='pbe-4' />
        <Divider />
        <CardContent >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-wrap items-center gap-4'>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <TextField

                    error={!!errors.roleName}
                    helperText={errors.roleName?.message as string}
                    fullWidth id='outlined-basic' label='Role Name'   {...register('roleName')} />

                </Grid>
                <Grid item xs={12} md={12}>


                  <div className='flex mt-4 justify-between '>

                    <div className='flex flex-col text-start'>

                      <Typography variant='h6'>Choose Masters</Typography>
                      <div className='text-red-600 inline-start-0 '  >{errors.permissions?.message as string}</div>
                    </div>

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={adminAccess}
                          onChange={handleAdminAccessChange}
                        />
                      }
                      label="Administrator access"
                    />
                  </div>
                </Grid>

                <Grid item xs={12} md={12}>



                  {data && data.length > 0 ? (
                    <List>
                      {data.map((master: any) => (
                        <ListItem key={master._id} className="border-b border-gray-300 py-2">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedMasterIds.includes(master._id)}
                                onChange={() => handleMasterChange(master._id)}
                              />
                            }
                            label={master.name}
                          />
                          {selectedMasterIds.includes(master._id) && (
                            <div >
                              {master.subMenus.map((submenu: any) => (
                                <FormControlLabel
                                  key={submenu._id}
                                  control={
                                    <Checkbox
                                      checked={!!selectedSubMenus[submenu._id]}
                                      onChange={() => handleSubMenuChange(submenu._id)}
                                    />
                                  }
                                  label={submenu.subMenuName}
                                />
                              ))}
                            </div>
                          )}
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography>No masters available</Typography>
                  )}

                </Grid>

              </Grid>
            </div>
            <div className='flex justify-center items-center'>
              <Button type='submit' color='primary' variant='contained' className='capitalize'>
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default HomeSectionAdd
