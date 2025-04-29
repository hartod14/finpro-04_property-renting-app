import { getAllCategory } from '@/handlers/category';
import { getAllTenant } from '@/handlers/user';
import { getAllCity } from '@/handlers/city';
import { useEffect, useRef, useState } from 'react';
import { getAllFacility } from '@/handlers/facility';
import { IProperty } from '@/interfaces/property.interface';
import { PropertyFilterParams, getAllProperty } from '@/handlers/property';
import { ICategory } from '@/interfaces/category.interface';
import { ICity } from '@/interfaces/city.interface';
import { IFacility } from '@/interfaces/facility.interface';
import { useSearchParams } from 'next/navigation';

export default function PropertyModel() {
  // Get search parameters from URL
  const searchParams = useSearchParams();

  type FilterName = 'category' | 'propertyName' | 'facility' | 'city';
  type SortDirection = 'asc' | 'desc';
  type PriceDirection = 'low-to-high' | 'high-to-low';

  const [openFilters, setOpenFilters] = useState({
    category: false,
    propertyName: false,
    facility: false,
    city: false,
  });

  const [openDropdown, setOpenDropdown] = useState({
    sort: false,
    price: false,
  });

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [tenants, setTenants] = useState<ITenant[]>([]);
  const [facilities, setFacilities] = useState<IFacility[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Get search term from URL or use default
  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || '');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchAdults, setSearchAdults] = useState(searchParams.get('capacity') || '2');
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Parse dates from URL params if available
  const checkInDate = searchParams.get('checkInDate') 
    ? new Date(searchParams.get('checkInDate') as string) 
    : today;
  
  const checkOutDate = searchParams.get('checkOutDate') 
    ? new Date(searchParams.get('checkOutDate') as string) 
    : tomorrow;
  
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: checkInDate,
    to: checkOutDate,
  });

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTenants, setSelectedTenants] = useState<number[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<number[]>([]);
  const [selectedCities, setSelectedCities] = useState<number[]>([]);

  const [sortValue, setSortValue] = useState<SortDirection>('asc');
  const [priceValue, setPriceValue] = useState<PriceDirection>('low-to-high');

  const sortRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);

  const fetchProperties = async () => {
    try {
      const filters: PropertyFilterParams = {};
      
      if (selectedCategories.length > 0) filters.categoryID = selectedCategories;
      if (selectedTenants.length > 0) filters.tenantID = selectedTenants;
      if (selectedFacilities.length > 0) filters.facilityID = selectedFacilities;
      if (selectedCities.length > 0) filters.cityID = selectedCities;
      
      if (priceValue) {
        filters.sortBy = 'price';
        filters.sortOrder = priceValue === 'low-to-high' ? 'asc' : 'desc';
      } else {
        filters.sortBy = 'name';
        filters.sortOrder = sortValue;
      }
                  
      if (searchTerm) {
        filters.searchTerm = searchTerm;
      }
      
      if (dateRange.from) {
        filters.checkInDate = dateRange.from.toISOString();
      }
      
      if (dateRange.to) {
        filters.checkOutDate = dateRange.to.toISOString();
      }
      
      if (searchAdults && searchAdults !== '') {
        filters.capacity = parseInt(searchAdults);
      }
      
      // Add pagination parameters
      filters.page = page;
      filters.limit = limit;
      
      const data = await getAllProperty(filters);
      
      // Update properties and pagination data
      setProperties(data.properties);
      setTotalItems(data.pagination.total);
      setTotalPages(data.pagination.totalPage);
      
    } catch (err) {
      setError('Failed to load properties. Please try again later.');
    }
  };

  // Fetch filter data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getCityList(),
          getCategoryList(),
          getTenantList(),
          getFacilityList()
        ]);
        
        // Fetch properties after filters are loaded
        await fetchProperties();
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update properties when filters or pagination changes
  useEffect(() => {
    if (!loading) {
      fetchProperties();
    }
  }, [selectedCategories, selectedTenants, selectedFacilities, selectedCities, sortValue, priceValue, page, limit]);

  useEffect(() => {
    if (!loading && properties.length === 0) {
      handleSearch();
    }
  }, [loading]);

  // Reset page when search or filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategories, selectedTenants, selectedFacilities, selectedCities, sortValue, priceValue, searchTerm, searchAdults]);

  async function getCityList() {
    const cities = await getAllCity();
    setCities(cities);
  }

  async function getCategoryList() {
    const categories = await getAllCategory();
    setCategories(categories);
  }

  async function getTenantList() {
    const tenants = await getAllTenant(10);
    setTenants(tenants);
  }

  async function getFacilityList() {
    const facilities = await getAllFacility(10);
    setFacilities(facilities);
  }

  const toggleDropdown = (type: 'sort' | 'price') => {
    setOpenDropdown({
      sort: type === 'sort' ? !openDropdown.sort : false,
      price: type === 'price' ? !openDropdown.price : false,
    });
  };

  const toggleFilter = (name: FilterName) => {
    setOpenFilters(prev => ({
      category: name === 'category' ? !prev.category : false,
      propertyName: name === 'propertyName' ? !prev.propertyName : false,
      facility: name === 'facility' ? !prev.facility : false,
      city: name === 'city' ? !prev.city : false,
    }));
  };

  const handleSortClick = (direction: SortDirection) => {
    setSortValue(direction);
    setPriceValue(null as any); 
    setOpenDropdown((prev) => ({ ...prev, sort: false }));
  };

  const handlePriceClick = (direction: PriceDirection) => {
    setPriceValue(direction);
    setOpenDropdown((prev) => ({ ...prev, price: false }));
  };

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleTenantClick = (tenantId: number) => {
    setSelectedTenants(prev => {
      if (prev.includes(tenantId)) {
        return prev.filter(id => id !== tenantId);
      } else {
        return [...prev, tenantId];
      }
    });
  };

  const handleFacilityClick = (facilityId: number) => {
    setSelectedFacilities(prev => {
      if (prev.includes(facilityId)) {
        return prev.filter(id => id !== facilityId);
      } else {
        return [...prev, facilityId];
      }
    });
  };

  const handleCityClick = (cityId: number) => {
    setSelectedCities(prev => {
      if (prev.includes(cityId)) {
        return prev.filter(id => id !== cityId);
      } else {
        return [...prev, cityId];
      }
    });
  };
  
  // Search handling functions
  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };
  
  const handleDateChange = (value: string) => {
    setSearchDate(value);
  };
  
  const handleAdultsChange = (value: string) => {
    setSearchAdults(value);
  };
  
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
  };
  
  const handleSearch = () => {
    setPage(1);
    fetchProperties();
  };

  return {
    openFilters,
    openDropdown,
    categories,
    tenants,
    facilities,
    cities,
    loading,
    error,
    selectedCategories,
    selectedTenants,
    selectedFacilities,
    selectedCities,
    sortValue,
    priceValue,
    sortRef,
    priceRef,
    toggleDropdown,
    toggleFilter,
    handlePriceClick,
    handleSortClick,
    handleCategoryClick,
    handleTenantClick,
    handleFacilityClick,
    handleCityClick,
    properties,
    searchTerm,
    searchDate,
    searchAdults,
    handleSearchTermChange,
    handleDateChange,
    handleAdultsChange,
    handleSearch,
    dateRange,
    handleDateRangeChange,
    setOpenFilters,
    // Pagination props
    page,
    setPage,
    limit,
    setLimit,
    totalItems,
    totalPages,
  };
}
