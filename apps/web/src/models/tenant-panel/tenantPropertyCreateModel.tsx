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
import { useJsApiLoader } from '@react-google-maps/api';

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

  // Google Maps API loader
  const { isLoaded: mapsLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  // Map related state
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [mapCenter, setMapCenter] = useState({
    lat: -6.2088, // Default to Jakarta, Indonesia
    lng: 106.8456,
  });

  // Map container style
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem',
  };

  // Map functions
  const onMapLoad = useCallback((map: google.maps.Map, formikValues?: any, setFieldValue?: any) => {
    setMap(map);
    
    // Create marker from latitude and longitude if provided in formik values
    if (formikValues && formikValues.latitude && formikValues.longitude && !marker) {
      const position = {
        lat: parseFloat(formikValues.latitude),
        lng: parseFloat(formikValues.longitude)
      };
      
      const newMarker = new google.maps.Marker({
        position: position,
        map: map,
        draggable: true,
      });
      
      setMarker(newMarker);
      
      // Center map on marker position
      map.setCenter(position);
    }
  }, [marker]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent, setFieldValue: any) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    
    if (lat && lng) {
      // Update marker position
      if (marker) {
        marker.setPosition(e.latLng);
      } else {
        const newMarker = new google.maps.Marker({
          position: e.latLng,
          map: map,
          draggable: true,
        });
        
        // Add drag event to marker
        newMarker.addListener('dragend', function(evt) {
          const position = newMarker.getPosition();
          if (position) {
            setFieldValue('latitude', position.lat().toString());
            setFieldValue('longitude', position.lng().toString());
            getAddressByCoordinates(position.lat(), position.lng(), setFieldValue);
          }
        });
        
        setMarker(newMarker);
      }
      
      // Update form values
      setFieldValue('latitude', lat.toString());
      setFieldValue('longitude', lng.toString());
      
      // Get address from coordinates
      getAddressByCoordinates(lat, lng, setFieldValue);
    }
  }, [map, marker]);

  const getAddressByCoordinates = useCallback(async (lat: number, lng: number, setFieldValue: any) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat, lng }
      });
      
      if (response.results && response.results.length > 0) {
        const address = response.results[0].formatted_address;
        setFieldValue('address', address);
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
  }, []);

  const searchLocation = useCallback(async (address: string, setFieldValue: any) => {
    if (!address) return;
    
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({
        address: address
      });
      
      if (response.results && response.results.length > 0) {
        const location = response.results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        
        // Update map center and zoom
        if (map) {
          map.setCenter(location);
          map.setZoom(15);
        }
        
        // Update marker
        if (marker) {
          marker.setPosition(location);
        } else {
          const newMarker = new google.maps.Marker({
            position: location,
            map: map,
            draggable: true,
          });
          
          newMarker.addListener('dragend', function(evt) {
            const position = newMarker.getPosition();
            if (position) {
              setFieldValue('latitude', position.lat().toString());
              setFieldValue('longitude', position.lng().toString());
              getAddressByCoordinates(position.lat(), position.lng(), setFieldValue);
            }
          });
          
          setMarker(newMarker);
        }
        
        // Update form values
        setFieldValue('latitude', lat.toString());
        setFieldValue('longitude', lng.toString());
        setFieldValue('address', response.results[0].formatted_address);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  }, [map, marker, getAddressByCoordinates]);

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

  // Effect to initialize map when coordinates are loaded
  useEffect(() => {
    getCityList();
    getCategoryList();
    getFacilityList();
  }, []);

  // This function will be called by the page component to initialize the marker
  const initializeMarker = useCallback((latitude: string, longitude: string, setFieldValue: any) => {
    if (map && latitude && longitude) {
      // Clear existing marker
      if (marker) {
        marker.setMap(null);
      }
      
      const position = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude)
      };
      
      // Create new marker
      const newMarker = new google.maps.Marker({
        position: position,
        map: map,
        draggable: true,
      });
      
      // Add drag event
      newMarker.addListener('dragend', function(evt) {
        const newPosition = newMarker.getPosition();
        if (newPosition && setFieldValue) {
          setFieldValue('latitude', newPosition.lat().toString());
          setFieldValue('longitude', newPosition.lng().toString());
          getAddressByCoordinates(newPosition.lat(), newPosition.lng(), setFieldValue);
        }
      });
      
      setMarker(newMarker);
      
      // Center map on marker
      map.setCenter(position);
    }
  }, [map, getAddressByCoordinates]);

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
    // Map related exports
    mapsLoaded,
    mapContainerStyle,
    mapCenter,
    onMapLoad,
    onMapClick,
    searchLocation,
    getAddressByCoordinates,
    initializeMarker,
    map,
  };
}
