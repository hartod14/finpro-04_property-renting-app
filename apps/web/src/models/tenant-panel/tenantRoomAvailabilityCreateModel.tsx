import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { createRoomAvailability } from '@/handlers/tenant-room-availability';
import { getAllTenant } from '@/handlers/user';
import { getAllProperty } from '@/handlers/tenant-property';
import { IProperty } from '@/interfaces/property.interface';

export default function TenantRoomAvailabilityCreateModel() {
  const [isLoading, setIsLoading] = useState(false);
  //   const loading = useContext(LoadingContext);
  const router = useRouter();
  const [tenantProperty, setTenantProperty] = useState<IProperty[]>([]);

  async function getTenantProperty() {
    const res = await getAllProperty('', '', '');
    setTenantProperty(res.data);

    console.log(res.data);
  }

  useEffect(() => {
    getTenantProperty();
  }, []);

  const handleCreateRoomAvailability = async (values: any) => {
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
          const res = await createRoomAvailability(values);
          
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
              footer: 'Please choose a different date range or rooms.'
            });
          } else {
            // Handle other errors
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Something went wrong, please try again later!'
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
    handleCreateRoomAvailability,
  };
}
