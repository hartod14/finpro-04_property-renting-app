import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserLocationName } from '@/handlers/geolocation';

export default function HomeModel() {
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationLoaded, setLocationLoaded] = useState(false);
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: today,
    to: tomorrow,
  });
  
  const [searchAdults, setSearchAdults] = useState('2');
  
  const getLocation = async () => {
    if (searchTerm || locationLoaded) {
      return;
    }
    
    setLocationLoaded(true);
    setLocationLoading(true);
    
    try {
      const locationPromise = getUserLocationName();
      const timeoutPromise = new Promise<{locationName: string}>((resolve) => {
        setTimeout(() => resolve({locationName: ''}), 8000);
      });
      
      const { locationName } = await Promise.race([locationPromise, timeoutPromise]);
      
      if (locationName) {
        setSearchTerm(locationName);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setLocationLoading(false);
    }
  };
  
  const isBrowser = typeof window !== 'undefined';
  
  useEffect(() => {
    if (!isBrowser) return;
    
    const timer = setTimeout(() => {
      getLocation();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isBrowser]);
  
  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };
  
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
  };
  
  const handleAdultsChange = (value: string) => {
    setSearchAdults(value);
  };
  
  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    
    if (searchTerm) {
      searchParams.append('searchTerm', searchTerm);
    }
    
    if (dateRange.from) {
      searchParams.append('startDate', dateRange.from.toISOString());
    }
    
    if (dateRange.to) {
      searchParams.append('endDate', dateRange.to.toISOString());
    }
    
    if (searchAdults) {
      searchParams.append('capacity', searchAdults);
    }
    
    router.push(`/property?${searchParams.toString()}`);
  };
  
  const handleDateRangePickerChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    
    // If both dates are provided, check they are not the same
    if (start && end) {
      // Format to yyyy-mm-dd for proper date comparison (without time)
      const startFormatted = start.toISOString().split('T')[0];
      const endFormatted = end.toISOString().split('T')[0];
      
      // Only update if end date is after start date
      if (endFormatted > startFormatted) {
        handleDateRangeChange({
          from: start,
          to: end,
        });
      } else if (startFormatted === endFormatted) {
        // If same date was selected, just update the start date
        handleDateRangeChange({
          from: start,
          to: undefined,
        });
      }
    } else {
      // Handle case when only one date or no dates are selected
      handleDateRangeChange({
        from: start || undefined,
        to: end || undefined,
      });
    }
  };
  
  return {
    searchTerm,
    dateRange,
    searchAdults,
    locationLoading,
    handleSearchTermChange,
    handleDateRangeChange,
    handleAdultsChange,
    handleSearch,
    handleDateRangePickerChange
  };
} 