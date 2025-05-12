import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import {
  getRoomAvailabilityData,
  updateRoomAvailability,
} from '@/handlers/tenant-room-availability';
import { getAllTenant } from '@/handlers/user';
import { getAllProperty } from '@/handlers/tenant-property';
import { IProperty } from '@/interfaces/property.interface';
import {
  IRoomAvailability,
  IRoomAvailabilityCreate,
} from '@/interfaces/room-availability.interface';

export default function TenantRoomAvailabilityEditModel(id: number) {
  const [isLoading, setIsLoading] = useState(false);
  //   const loading = useContext(LoadingContext);
  const router = useRouter();
  const [tenantProperty, setTenantProperty] = useState<IProperty[]>([]);
  const [initialValues, setInitialValues] = useState<IRoomAvailabilityCreate>({
    start_date: '',
    end_date: '',
    description: '',
    rooms: [],
  });

  async function getTenantProperty() {
    const res = await getAllProperty('', '', '');
    setTenantProperty(res.data);

    console.log(res.data);
  }

  async function getRoomAvailability() {
    const res = await getRoomAvailabilityData(id);
    
    // Extract room IDs from roomHasUnavailableDates array
    const roomIds = res.data.roomHasUnavailableDates 
      ? res.data.roomHasUnavailableDates.map(item => item.room_id) 
      : [];
    
    setInitialValues({
      start_date: res.data.start_date || '',
      end_date: res.data.end_date || '',
      description: res.data.description || '',
      rooms: roomIds,
    });

    console.log(res);
  }

  useEffect(() => {
    getTenantProperty();
    getRoomAvailability();
  }, []);

  const handleUpdateRoomAvailability = async (values: any) => {
    return Swal.fire({
      title: 'Submit this new unavailable date?',
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
          console.log('Values being sent to backend:', values);
          
          // Make sure values has the correct structure
          const dataToSend = {
            start_date: values.start_date,
            end_date: values.end_date,
            description: values.description,
            rooms: values.rooms
          };
          
          console.log('Formatted data to send:', dataToSend);
          const res = await updateRoomAvailability(id, dataToSend);

          // If we get here, the request was successful
          Swal.fire({
            title: 'Saved!',
            text: 'Your new unavailable date has been created.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            router.push('/tenant/room-availability');
          });
        } catch (error: any) {
          // Handle overlap error - check error message directly
          if (error.message && error.message.includes('Date range overlaps')) {
            Swal.fire({
              icon: 'error',
              title: 'Date Overlap Detected',
              text: 'The selected date range overlaps with existing unavailable dates.',
              footer: 'Please choose a different date range or rooms.',
            });
          } else {
            // Handle other errors
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Something went wrong, please try again later!',
            });
          }
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
    tenantProperty,
    handleUpdateRoomAvailability,
    initialValues,
  };
}
