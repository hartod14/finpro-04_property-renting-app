import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import {
  getSeasonRateData,
  updateSeasonRate,
} from '@/handlers/tenant-season-rate';
import { getAllProperty } from '@/handlers/tenant-property';
import { IProperty } from '@/interfaces/property.interface';
import { ISeasonRateCreate } from '@/interfaces/season-rate.interface';

export default function TenantSeasonRateEditModel(id: number) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [tenantProperty, setTenantProperty] = useState<IProperty[]>([]);
  const [initialValues, setInitialValues] = useState<ISeasonRateCreate>({
    value_type: 'PERCENTAGE',
    value: 0,
    start_date: '',
    end_date: '',
    type: 'INCREASE',
    description: '',
    rooms: [],
  });

  async function getTenantProperty() {
    const res = await getAllProperty('', '', '');
    setTenantProperty(res.data);
  }

  async function getSeasonRate() {
    const res = await getSeasonRateData(id);
    
    // Extract room IDs from roomHasPeakSeasonRates array
    const roomIds = res.data.roomHasPeakSeasonRates 
      ? res.data.roomHasPeakSeasonRates.map(item => item.room_id) 
      : [];
    
    setInitialValues({
      value_type: res.data.value_type || 'PERCENTAGE',
      value: res.data.value || 0,
      start_date: res.data.start_date || '',
      end_date: res.data.end_date || '',
      type: res.data.type || 'INCREASE',
      description: res.data.description || '',
      rooms: roomIds,
    });
  }

  useEffect(() => {
    getTenantProperty();
    getSeasonRate();
  }, []);

  const handleUpdateSeasonRate = async (values: any) => {
    return Swal.fire({
      title: 'Submit this updated season rate?',
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
          
          // Make sure values has the correct structure
          const dataToSend = {
            value_type: values.value_type,
            value: values.value,
            start_date: values.start_date,
            end_date: values.end_date,
            type: values.type,
            description: values.description,
            rooms: values.rooms
          };
          
          const res = await updateSeasonRate(id, dataToSend);

          // If we get here, the request was successful
          Swal.fire({
            title: 'Saved!',
            text: 'Your season rate has been updated.',
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
    handleUpdateSeasonRate,
    initialValues,
  };
} 