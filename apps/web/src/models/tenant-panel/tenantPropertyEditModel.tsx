import { getAllCategory } from '@/handlers/tenant-category';
import { getAllFacility } from '@/handlers/facility';
import { updateProperty } from '@/handlers/tenant-property';
import { uploadImage } from '@/handlers/upload';
import { ICategory } from '@/interfaces/category.interface';
import { ICity } from '@/interfaces/city.interface';
import { IFacility } from '@/interfaces/facility.interface';
import { useRouter } from 'next/navigation';
import { use, useCallback, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { getAllCity } from '@/handlers/city';
import { getPropertyById } from '@/handlers/tenant-property';
import { IPropertyDetail } from '@/interfaces/property.interface';
import { log } from 'console';

export default function TenantPropertyEditModel(id: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<ICity[]>([]);
  const [initialValues, setInitialValues] = useState<IPropertyDetail>({
    id: 0,
    name: '',
    checkin_time: '',
    checkout_time: '',
    description: '',
    address: '',
    city_id: '',
    category_id: '',
    images: [],
    facilities: [],
  });
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [facilities, setFacilities] = useState<IFacility[]>([]);

  const [images, setImages] = useState<string[]>([]);
  const [uploadImageError, setUploadImageError] = useState<string>('');
  const refImage = useRef<HTMLInputElement>(null);
  const router = useRouter();

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

  async function getPropertyDetail() {
    let property = await getPropertyById(id);
    if (property.error == 'forbidden') {
      router.push('/forbidden');
    } else {
      if (property) {
        property = property.data;
        setInitialValues({
          id: property.id,
          name: property.name,
          checkin_time: new Date(property.checkin_time)
            .toTimeString()
            .slice(0, 5),
          checkout_time: new Date(property.checkout_time)
            .toTimeString()
            .slice(0, 5),
          description: property.description,
          address: property.address,
          city_id: property.city.id,
          category_id: property.category.id,
          images: property.images.map((img: any) => img.path),
          facilities: property.facilities.map((facility: any) => facility.id),
        });

        setImages(property.images.map((img: any) => img.path));
      }
    }
  }

  async function getCityList() {
    const cities = await getAllCity();
    setCities(cities);
  }

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
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  }

  useEffect(() => {
    getCityList();
    getCategoryList();
    getFacilityList();
    getPropertyDetail();
  }, []);

  const handleEditProperty = async (values: any) => {
    return Swal.fire({
      title: 'Update this property?',
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
          const res = await updateProperty(id, values);

          if (res?.error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again later!',
            });
          } else {
            Swal.fire({
              title: 'Saved!',
              text: 'Your property has been updated.',
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
    handleEditProperty,
    cities,
    categories,
    facilities,
    images,
    refImage,
    upload,
    deleteImage,
    uploadImageError,
    initialValues,
  };
}
