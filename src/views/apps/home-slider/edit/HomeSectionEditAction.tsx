/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import Image from 'next/image';

import { Button, Card, CardContent, CardHeader, Divider, TextField, IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';

import sectionSchema from './schema';

// Define the schema and default values
const { sectionValidationSchema, defaultValues } = sectionSchema;

const HomeSectionEdit = ({ data, id }: { data?: any, id?: any }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [products, setProducts] = useState([]);

  // Initialize form handling with validation schema
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<any>({
    resolver: yupResolver(sectionValidationSchema),
    defaultValues
  });

  console.log("errors", errors)

  // Field arrays for left and right slider images
  const { fields: leftSliderFields, append: leftAppend, remove: removeLeft } = useFieldArray({
    control,
    name: 'leftSliderImages'
  });

  const { fields: rightSliderFields, append: rightAppend, remove: removeRight } = useFieldArray({
    control,
    name: 'rightSliderImages'
  });

  // Pre-fill the form with the data if available
  useEffect(() => {
    if (data) {
      // Set initial form data
      setValue('leftSliderImages', data.leftSliderImages || []);
      setValue('rightSliderImages', data.rightSliderImages || []);
    }
  }, [data, setValue]);

  // Handle form submission
  const onSubmit = async (formData: any) => {
    const submitData = new FormData();

    // submitData.append('title', formData.title);
    // submitData.append('description', formData.description);

    // Append banners for left slider
    formData.leftSliderImages.forEach((image: any, index: number) => {
      if (image.imageUrl instanceof FileList && image.imageUrl.length > 0) {
        submitData.append(`leftSliderImages`, image.imageUrl[0]);
      }

      submitData.append(`leftLink${index}`, image.link || '');
    });

    // Append banners for right slider
    formData.rightSliderImages.forEach((image: any, index: number) => {
      if (image.imageUrl instanceof FileList && image.imageUrl.length > 0) {
        submitData.append(`rightSliderImages`, image.imageUrl[0]);
      }

      submitData.append(`rightLink${index}`, image.link || '');
    });

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/home-banners/update-banner/${id}`, submitData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success("Section updated successfully!");
      setTimeout(() => {
        router.push("/apps/home-sliders");
      }, 2000);
    } catch (err) {
      console.error('Failed to update section', err);
      toast.error("Failed to update section");
    }
  };



  const deleteSliderImage = async (imageId: any, side: any) => {
    try {
      // Ensure the side parameter is valid
      if (!['left', 'right'].includes(side)) {
        throw new Error("Invalid side. Must be 'left' or 'right'.");
      }

      // Prepare the request body
      const requestBody = {
        imageId: imageId,
        side: side
      };

      // Make the POST request to the API endpoint
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/home-banners/delete-banner/${id}`, requestBody, { withCredentials: true, });

      // Handle the API response
      console.log('Image deleted successfully:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error; // Re-throw the error to handle it in the calling function if needed
    }
  };

  return (
    <div>
      <Card>
        <CardHeader title='Update Home Page Sliders' className='pbe-4' />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Left Slider Images */}
            <label className='text-md text-black mb-6'>Left Slider Images</label>
            {leftSliderFields.map((field: any, index: any) => {



              return (



                <div key={field.id} className="flex items-center mt-4 gap-4 mb-4">


                  {/* Banner Image */}
                  <div className="flex-1">
                    {field.imageUrl && typeof field.imageUrl === 'string' ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${field.imageUrl}`}
                        alt="Slider"
                        width={500} // Example width for the aspect ratio
                        height={250} // Example height for the aspect ratio
                        onClick={() => document.getElementById(`leftSliderImages.${index}.imageUrl`)?.click()}
                        className="cursor-pointer w-full h-auto object-cover"
                        layout="responsive" // Makes the image responsive based on the aspect ratio
                      />
                    ) : (
                      <TextField
                        InputLabelProps={{ shrink: true }}
                        label="Left Banner File"
                        type="file"
                        {...register(`leftSliderImages.${index}.imageUrl`)}
                        fullWidth
                      />
                    )}
                  </div>

                  {/* Banner Link */}
                  <div className="flex-1">
                    <TextField
                      label="Banner Link"
                      {...register(`leftSliderImages.${index}.link`)}
                      defaultValue={field.link}
                      fullWidth
                    />
                  </div>

                  {/* Remove Icon */}
                  {leftSliderFields.length > 1 && (
                    <IconButton
                      onClick={() => {


                        removeLeft(index)

                        deleteSliderImage(field?._id, "left")


                      }}
                      aria-label="Remove banner"
                      className="ml-4"
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
                onClick={() => leftAppend({ imageUrl: '', link: '' })}
                variant="outlined"
              >
                Add More
              </Button>
            </div>

            {/* Right Slider Images */}
            <label className='text-md text-black mb-6'>Right Slider Images</label>
            {rightSliderFields.map((field: any, index: any) => (
              <div key={field.id} className="flex items-center mt-4 gap-4 mb-4">
                {/* Right Banner Image */}
                <div className="flex-1">
                  {field.imageUrl && typeof field.imageUrl === 'string' ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${field.imageUrl}`}
                      alt="Slider"
                      width={500} // Example width for the aspect ratio
                      height={250} // Example height for the aspect ratio
                      onClick={() => document.getElementById(`rightSliderImages.${index}.imageUrl`)?.click()}
                      className="cursor-pointer w-full h-auto object-cover"
                      layout="responsive" // Makes the image responsive based on the aspect ratio
                    />
                  ) : (
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      label="Right Banner File"
                      type="file"
                      {...register(`rightSliderImages.${index}.imageUrl`)}
                      fullWidth
                    />
                  )}
                </div>

                {/* Right Banner Link */}
                <div className="flex-1">
                  <TextField
                    label="Banner Link"
                    {...register(`rightSliderImages.${index}.link`)}
                    defaultValue={field.link}
                    fullWidth
                  />
                </div>

                {/* Remove Icon for Right Slider */}
                {rightSliderFields.length > 1 && (
                  <IconButton
                    onClick={() => {

                      removeRight(index)
                      deleteSliderImage(field?._id, "right")
                    }}
                    aria-label="Remove banner"
                  >
                    <i className="ri-delete-bin-6-line"></i>
                  </IconButton>
                )}
              </div>
            ))}

            <div className='flex justify-end '>
              <Button
                startIcon={<i className="ri-add-large-fill"></i>}
                onClick={() => rightAppend({ imageUrl: '', link: '' })}
                variant="outlined"
              >
                Add More
              </Button>
            </div>

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

export default HomeSectionEdit;
