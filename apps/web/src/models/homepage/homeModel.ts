import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeModel() {
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  
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
    handleDateRangeChange({
      from: start || undefined,
      to: end || undefined,
    });
  };
  
  return {
    searchTerm,
    dateRange,
    searchAdults,
    handleSearchTermChange,
    handleDateRangeChange,
    handleAdultsChange,
    handleSearch,
    handleDateRangePickerChange
  };
} 