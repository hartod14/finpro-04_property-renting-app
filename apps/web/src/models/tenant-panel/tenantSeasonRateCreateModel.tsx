import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { createSeasonRate } from '@/handlers/tenant-season-rate';
import { getAllProperty } from '@/handlers/tenant-property';
import { IProperty } from '@/interfaces/property.interface';

export default function TenantSeasonRateCreateModel() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [tenantProperty, setTenantProperty] = useState<IProperty[]>([]);

  async function getTenantProperty() {
    const res = await getAllProperty('', '', '');
    setTenantProperty(res.data);
  }

  useEffect(() => {
    getTenantProperty();
  }, []);

  const handleCreateSeasonRate = async (values: any) => {
    return Swal.fire({
      title: 'Submit this new season rate?',
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
          const res = await createSeasonRate(values);
          
          // If we get here, the request was successful
          Swal.fire({
            title: 'Saved!',
            text: 'Your new season rate has been created.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            router.push('/tenant/season-rate');
          });
          
        } catch (error: any) {
          
          // Handle overlap error - check error message directly
          if (error.message && error.message.includes('Date range overlaps')) {
            Swal.fire({
              icon: 'error',
              title: 'Date Overlap Detected',
              text: 'The selected date range overlaps with existing season rates.',
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
    handleCreateSeasonRate,
  };
} 