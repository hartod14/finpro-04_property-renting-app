import { createCategory, getAllCategory } from '@/handlers/tenant-category';
import { useCallback, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { createProperty } from '@/handlers/tenant-property';
import { getAllCity } from '@/handlers/city';
import { ICity } from '@/interfaces/city.interface';
import { ICategory } from '@/interfaces/category.interface';
import { uploadImage } from '@/handlers/upload';
import { getAllFacility } from '@/handlers/facility';
import { IFacility } from '@/interfaces/facility.interface';

export default function TenantPropertyCreateModel() {
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<ICity[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [facilities, setFacilities] = useState<IFacility[]>([]);
  const [roomFacilities, setRoomFacilities] = useState<IFacility[]>([]);
  //   const loading = useContext(LoadingContext);
  const [images, setImages] = useState<string[]>([]);
  const [uploadImageError, setUploadImageError] = useState<string>('');
  const [roomImageErrors, setRoomImageErrors] = useState<{[key: number]: string}>({});
  const refImage = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const roomImageRefs = useRef<Array<HTMLInputElement | null>>([]);

  async function getCityList() {
    const cities = await getAllCity();
    setCities(cities);
  }

  const upload = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      setFieldValue: (field: string, value: any) => void,
    ) => {
      setIsLoading(true);
      setUploadImageError('');
      if (e.target.files?.length) {
        const image: File = e.target.files[0];

        if (image.size > 1048576) {
          setUploadImageError('Image size should not exceed 1MB');
          setIsLoading(false);
          return;
        }

        const acceptedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        if (!acceptedTypes.includes(image.type)) {
          setUploadImageError('file must be image');
          setIsLoading(false);
          return;
        }

        const form = new FormData();
        form.append('image', image);

        const resImage = await uploadImage(form);

        const updatedImages = [...images, resImage.data];
        setImages(updatedImages);
        setFieldValue('images', updatedImages);
      }
      setIsLoading(false);
    },
    [images],
  );

  const deleteImage = useCallback(
    (index: number, setFieldValue: (field: string, value: any) => void) => {
      const updatedImages = [...images];
      updatedImages.splice(index, 1);
      setImages(updatedImages);
      setFieldValue('images', updatedImages);
    },
    [images],
  );

  const uploadRoomImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
    roomIndex: number,
    currentValues: any,
  ) => {
    if (e.target.files?.length) {
      const image: File = e.target.files[0];
      
      // Clear previous error for this room
      setRoomImageErrors(prev => ({...prev, [roomIndex]: ''}));
      
      // Validate image size
      if (image.size > 1048576) {
        setRoomImageErrors(prev => ({...prev, [roomIndex]: 'Image size should not exceed 1MB'}));
        return;
      }
      
      // Validate image type
      const acceptedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!acceptedTypes.includes(image.type)) {
        setRoomImageErrors(prev => ({...prev, [roomIndex]: 'File must be an image (PNG, JPG, JPEG)'}));
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
        setRoomImageErrors(prev => ({...prev, [roomIndex]: 'Failed to upload image'}));
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

  async function getCategoryList() {
    const categories = await getAllCategory('', '', '');
    setCategories(categories.data);
  }

  async function getFacilityList() {
    try {
      const allFacilities = await getAllFacility(undefined);

      const propertyFacilities = allFacilities.filter(
        (facility: IFacility) => facility.type === 'PROPERTY',
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
    getCityList();
    getCategoryList();
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
          const res = await createProperty(values);

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
    cities,
    categories,
    facilities,
    roomFacilities,
    images,
    refImage,
    upload,
    deleteImage,
    uploadRoomImage,
    deleteRoomImage,
    roomImageRefs,
    ensureRoomImageRefs,
    uploadImageError,
    roomImageErrors,
  };
}
