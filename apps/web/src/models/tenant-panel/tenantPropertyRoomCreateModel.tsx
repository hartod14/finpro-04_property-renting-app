'use client';

import PanelButtonAction from '@/components/common/button/panelButtonAction';
import { getAllFacility } from '@/handlers/facility';
import {
  createRoom,
  deleteProperty,
  deleteRoom,
  getAllProperty,
  getRoomById,
  getRoomByPropertyId,
} from '@/handlers/tenant-property';
// import { deleteCategory, getAllCategory } from '@/handlers/tenant-category';
import { ICategory } from '@/interfaces/category.interface';
import { IFacility } from '@/interfaces/facility.interface';
import { IProperty, IRoom } from '@/interfaces/property.interface';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function TenantPropertyRoomCreateModel(propertyId: string) {
  // const loading = useContext(LoadingContext);
  const [isLoading, setIsLoading] = useState(false);
  const [roomFacilities, setRoomFacilities] = useState<IFacility[]>([]);
  //   const loading = useContext(LoadingContext);
  const [images, setImages] = useState<string[]>([]);
  const [uploadImageError, setUploadImageError] = useState<string>('');

  const refImage = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
    roomIndex: number,
    currentValues: any,
  ) => {
    if (e.target.files?.length) {
      const image: File = e.target.files[0];

      // Clear previous error for this room
      setUploadImageError((prev) => ({ ...prev, [roomIndex]: '' }));

      // Validate image size
      if (image.size > 1048576) {
        setUploadImageError((prev) => ({
          ...prev,
          [roomIndex]: 'Image size should not exceed 1MB',
        }));
        return;
      }

      // Validate image type
      const acceptedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!acceptedTypes.includes(image.type)) {
        setUploadImageError((prev) => ({
          ...prev,
          [roomIndex]: 'File must be an image (PNG, JPG, JPEG)',
        }));
        return;
      }

      const form = new FormData();
      form.append('image', image);

      try {
        setIsLoading(true);
        const resImage = await uploadImage(form);

        const updatedRooms = [...currentValues.rooms];

        if (!updatedRooms[roomIndex].images) {
          updatedRooms[roomIndex].images = [];
        }

        updatedRooms[roomIndex].images = [
          ...updatedRooms[roomIndex].images,
          resImage.data,
        ];
        setFieldValue('rooms', updatedRooms);
      } catch (error) {
        setUploadImageError((prev) => ({
          ...prev,
          [roomIndex]: 'Failed to upload image',
        }));
        console.error('Error uploading image:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deleteRoomImage = (
    roomIndex: number,
    imageIndex: number,
    setFieldValue: (field: string, value: any) => void,
    values: any,
  ) => {
    const updatedRooms = [...values.rooms];
    updatedRooms[roomIndex].images.splice(imageIndex, 1);
    setFieldValue('rooms', updatedRooms);
  };

  const ensureRoomImageRefs = (roomCount: number) => {
    if (roomImageRefs.current.length < roomCount) {
      roomImageRefs.current = Array(roomCount).fill(null);
    }
  };



  async function getFacilityList() {
    try {
      const allFacilities = await getAllFacility(undefined);

      const propertyFacilities = allFacilities.filter(
        (facility: IFacility  ) => facility.type === 'PROPERTY',
      );
      setFacilities(propertyFacilities);

      const roomFacilitiesList = allFacilities.filter(
        (facility: IFacility) => facility.type === 'ROOM',
      );
      setRoomFacilities(roomFacilitiesList);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  }

  useEffect(() => {
    getFacilityList();
  }, []);

  const handleCreateProperty = async (values: any) => {
    return Swal.fire({
      title: 'Submit this new property?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#ABABAB',
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'Back',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const res = await createRoom(values);

          if (res?.error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again later!',
            });
          } else {
            Swal.fire({
              title: 'Saved!',
              text: 'Your new property has been created.',
              icon: 'success',
              confirmButtonColor: '#3085d6',
            }).then(() => {
              router.push('/tenant/property');
            });
          }
        } catch (error) {
          alert('something error');
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  return {
    isLoading,
    setIsLoading,
    router,
    handleCreateProperty,
    facilities,
    roomFacilities,
    images,
    refImage,
    upload,
    deleteImage,
    deleteRoomImage,
    roomImageRefs,
    ensureRoomImageRefs,
    uploadImageError,
  };
}
