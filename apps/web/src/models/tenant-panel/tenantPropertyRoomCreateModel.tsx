import { createCategory, getAllCategory } from '@/handlers/tenant-category';
import { useCallback, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { createProperty, createRoom } from '@/handlers/tenant-property';
import { getAllCity } from '@/handlers/city';
import { ICity } from '@/interfaces/city.interface';
import { ICategory } from '@/interfaces/category.interface';
import { uploadImage } from '@/handlers/upload';
import { getAllFacility } from '@/handlers/facility';
import { IFacility } from '@/interfaces/facility.interface';
import { IRoomCreate } from '@/interfaces/property.interface';

export default function TenantPropertyRoomCreateModel(propertyId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [roomFacilities, setRoomFacilities] = useState<IFacility[]>([]);
  //   const loading = useContext(LoadingContext);
  const [roomImageErrors, setRoomImageErrors] = useState<{
    [key: number]: string;
  }>({});
  const router = useRouter();

  const roomImageRefs = useRef<Array<HTMLInputElement | null>>([]);

  const uploadRoomImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
    values?: any
  ) => {
    if (e.target.files?.length) {
      const image: File = e.target.files[0];

      // Clear previous error for this room
      setRoomImageErrors((prev) => ({ ...prev, [0]: '' }));

      // Validate image size
      if (image.size > 1048576) {
        setRoomImageErrors((prev) => ({
          ...prev,
          [0]: 'Image size should not exceed 1MB',
        }));
        return;
      }

      // Validate image type
      const acceptedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!acceptedTypes.includes(image.type)) {
        setRoomImageErrors((prev) => ({
          ...prev,
          [0]: 'File must be an image (PNG, JPG, JPEG)',
        }));
        return;
      }

      const form = new FormData();
      form.append('image', image);

      try {
        setIsLoading(true);
        const resImage = await uploadImage(form);

        // Get current images array or initialize if empty
        const currentImages = values?.roomImages || [];
        // Add new image
        const updatedImages = [...currentImages, resImage.data];
        setFieldValue('roomImages', updatedImages);
      } catch (error) {
        setRoomImageErrors((prev) => ({
          ...prev,
          [0]: 'Failed to upload image',
        }));
        console.error('Error uploading image:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deleteRoomImage = (
    imageIndex: number,
    setFieldValue: (field: string, value: any) => void,
    values: any,
  ) => {
    const updatedImages = [...values.roomImages];
    updatedImages.splice(imageIndex, 1);
    setFieldValue('roomImages', updatedImages);
  };

  const ensureRoomImageRefs = (roomCount: number = 1) => {
    if (roomImageRefs.current.length < roomCount) {
      roomImageRefs.current = Array(roomCount).fill(null);
    }
  };

  async function getFacilityList() {
    try {
      const allFacilities = await getAllFacility(undefined);

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

  const handleCreateRoom = async (values: IRoomCreate) => {
    return Swal.fire({
      title: 'Submit this new room?',
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
          const res = await createRoom(propertyId, values);

          if (res?.error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again later!',
            });
          } else {
            Swal.fire({
              title: 'Saved!',
              text: 'Your new room has been created.',
              icon: 'success',
              confirmButtonColor: '#3085d6',
            }).then(() => {
              router.push(`/tenant/property/${propertyId}/room`);
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
    handleCreateRoom,
    roomFacilities,
    uploadRoomImage,
    deleteRoomImage,
    roomImageRefs,
    ensureRoomImageRefs,
    roomImageErrors,
  };
}
