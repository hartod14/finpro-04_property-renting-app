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
import { useJsApiLoader } from '@react-google-maps/api';

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
    latitude: '',
    longitude: '',
  });
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [facilities, setFacilities] = useState<IFacility[]>([]);

  const [images, setImages] = useState<string[]>([]);
  const [uploadImageError, setUploadImageError] = useState<string>('');
  const refImage = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    // Create marker from initial latitude and longitude if available
    if (initialValues.latitude && initialValues.longitude && !marker) {
      const position = {
        lat: parseFloat(initialValues.latitude),
        lng: parseFloat(initialValues.longitude)
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
  }, [initialValues.latitude, initialValues.longitude, marker]);

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
        
        // Update map center if coordinates are available
        if (property.latitude && property.longitude) {
          setMapCenter({
            lat: parseFloat(property.latitude),
            lng: parseFloat(property.longitude)
          });
        }
        
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
          latitude: property.latitude || '',
          longitude: property.longitude || '',
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

  // Effect to reset the marker when the map changes or coordinates are updated
  useEffect(() => {
    if (map && initialValues.latitude && initialValues.longitude) {
      // Clear existing marker
      if (marker) {
        marker.setMap(null);
      }
      
      // Create new marker
      const position = {
        lat: parseFloat(initialValues.latitude),
        lng: parseFloat(initialValues.longitude)
      };
      
      const newMarker = new google.maps.Marker({
        position: position,
        map: map,
        draggable: true,
      });
      
      setMarker(newMarker);
      
      // Center map on marker
      map.setCenter(position);
    }
  }, [map, initialValues.latitude, initialValues.longitude]);

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
