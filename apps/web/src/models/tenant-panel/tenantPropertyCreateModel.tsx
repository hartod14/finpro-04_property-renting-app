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
  const refImage = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  // Array of refs for room image uploads
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
      if (e.target.files?.length) {
        const image: File = e.target.files[0];
        const form = new FormData();
        form.append('image', image);

        const resImage = await uploadImage(form);
        
        // Add the new image to the existing images array
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

  // Handle room image upload
  const uploadRoomImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    roomIndex: number,
    setFieldValue: (field: string, value: any) => void,
    currentValues: any
  ) => {
    if (e.target.files?.length) {
      const image: File = e.target.files[0];
      const form = new FormData();
      form.append('image', image);

      try {
        setIsLoading(true);
        const resImage = await uploadImage(form);
        
        // Get current room images
        const updatedRooms = [...currentValues.rooms];
        
        // Initialize images array if it doesn't exist
        if (!updatedRooms[roomIndex].images) {
          updatedRooms[roomIndex].images = [];
        }
        
        // Add the new image
        updatedRooms[roomIndex].images = [...updatedRooms[roomIndex].images, resImage.data];
        setFieldValue('rooms', updatedRooms);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle room image deletion
  const deleteRoomImage = (
    roomIndex: number,
    imageIndex: number,
    setFieldValue: (field: string, value: any) => void,
    values: any
  ) => {
    const updatedRooms = [...values.rooms];
    updatedRooms[roomIndex].images.splice(imageIndex, 1);
    setFieldValue('rooms', updatedRooms);
  };

  // Ensure we have enough refs for all rooms
  const ensureRoomImageRefs = (roomCount: number) => {
    // Resize roomImageRefs array if needed
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
      
      // Filter facilities with type PROPERTY
      const propertyFacilities = allFacilities.filter(
        (facility: IFacility) => facility.type === 'PROPERTY'
      );
      setFacilities(propertyFacilities);
      
      // Filter facilities with type ROOM
      const roomFacilitiesList = allFacilities.filter(
        (facility: IFacility) => facility.type === 'ROOM'
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
    // Check if all rooms have at least 1 facility
    if (values.rooms.some((room: any) => !room.facilities || room.facilities.length < 1)) {
      return Swal.fire({
        icon: 'error',
        title: 'Missing Room Facilities',
        text: 'Please select at least one facility for each room.',
      });
    }

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
  };
}
