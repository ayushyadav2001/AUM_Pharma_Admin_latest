/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button, Card, CardContent, CardHeader, Checkbox, Divider, FormControlLabel, TextField, IconButton } from '@mui/material';
// eslint-disable-next-line import/no-unresolved

// eslint-disable-next-line import/no-unresolved
// import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Select from 'react-select';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';

import sectionSchema from './schema';

// Define the schema and default values
const { sectionValidationSchema, defaultValues } = sectionSchema;

const HomeSectionAdd = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<'banner' | 'product_slider' | null>('banner');
  const [products, setProducts] = useState([]);

  // Initialize form handling with validation schema
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<any>({
    resolver: yupResolver(sectionValidationSchema),
    defaultValues
  });

  const { fields: bannerFields, append, remove } = useFieldArray({
    control,
    name: 'banners'
  });

  console.log("errors", errors)


  // Fetch product options for the Select component
  const fetchProductOptions = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get-all-product`, { withCredentials: true });

      setProducts(response.data.products.map((product: any) => ({
        value: product._id,
        label: product.product_name
      })));

    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  // Handle form submission
  const onSubmit = async (data: any) => {
    console.log("submitted", data);

    // Create a FormData object to handle file uploads
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('type', data.type);

    // Append banners or products based on the type
    if (data.type === 'banner') {
      data.banners.forEach((banner: any, index: number) => {
        formData.append(`banner_image`, banner.imageUrl[0]);
        formData.append(`linkUrl${index}`, banner.linkUrl);
      });
    } else if (data.type === 'product_slider') {
      data.products.forEach((product: any, index: number) => {
        formData.append('products[]', product); // Assuming products is an array of product IDs
      });
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/home-section/add-section`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success("Section added successfully!");
      setTimeout(() => {
        router.push("/apps/homeSections");
      }, 2000);
    } catch (err) {
      console.error('Failed to submit', err);
    }
  };

  // Fetch product options on component mount
  useEffect(() => {
    fetchProductOptions();
  }, []);

  return (
    <div>
      <Card>
        <CardHeader title='Add Home Section' className='pbe-4' />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-wrap items-center gap-4'>
              <TextField
                label="Title"
                {...register('title')}
                error={Boolean(errors.title)}
                helperText={errors.title?.message as string}
                fullWidth
              />
            </div>
            <br />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedOption === 'banner'}
                  onChange={() => {


                    if (selectedOption !== 'banner') {

                      // setSelectedOption(selectedOption === 'banner' ? null : 'banner')

                      setValue("products", [])
                      setValue("type", "banner")
                      setValue("banners", [{ imageUrl: null, linkUrl: '' }])
                      setSelectedOption('banner');

                    }

                  }}
                />
              }
              label="Add Banners"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedOption === 'product_slider'}
                  onChange={() => {

                    if (selectedOption !== 'product_slider') {

                      setSelectedOption('product_slider');

                      // setSelectedOption(selectedOption === 'product_slider' ? null : 'product_slider')
                      setValue("banners", [])
                      setValue("type", "product_slider")
                    }

                  }}
                />
              }
              label="Add Products"
            />
            <br />
            <br />
            {selectedOption === 'banner' && (
              <>
                {bannerFields.map((field, index) => {
                  return (
                    <div key={field.id} className='flex items-center gap-4 mb-4'>
                      <TextField
                        InputLabelProps={{ shrink: true }}
                        label="Banner File"
                        type="file"
                        {...register(`banners.${index}.imageUrl` as const)}
                        fullWidth
                      />
                      <TextField
                        label="Banner Link"
                        {...register(`banners.${index}.linkUrl` as string)}
                        fullWidth
                      />
                      {bannerFields.length > 1 && (
                        <IconButton
                          onClick={() => remove(index)}
                          aria-label="Remove banner"
                        >
                          <i className="ri-delete-bin-6-line"></i>
                        </IconButton>
                      )}
                    </div>
                  )
                })}

                <div className='flex justify-end '>
                  <Button
                    startIcon={<i className="ri-add-large-fill"></i>}
                    onClick={() => append({ imageUrl: '', linkUrl: '' })}
                    variant="outlined"
                  >
                    Add More
                  </Button>
                </div>
              </>
            )}
            {selectedOption === 'product_slider' && (
              <div className='w-full'>
                <Select
                  isMulti

                  // value={sections}
                  closeMenuOnSelect={false}
                  isClearable={false}
                  onChange={(e: any) => {

                    const selectedValues = e.map((option: any) => option.value);



                    setValue('products', selectedValues);


                  }}
                  options={products}

                // {...register('products')}
                />
              </div>
            )}
            <div className='flex justify-center items-center mt-[100px]'>
              <Button type='submit' color='primary' variant='contained' className='capitalize'>
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeSectionAdd;
