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
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export default function PropertyModel() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [limit, setLimit] = useState(parseInt(searchParams.get('limit') || '10', 10));
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Get search term from URL or use default
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('searchTerm') || '',
  );
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchAdults, setSearchAdults] = useState(
    searchParams.get('capacity') || '2',
  );

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startDate = searchParams.get('startDate')
    ? new Date(searchParams.get('startDate') as string)
    : today;

  const endDate = searchParams.get('endDate')
    ? new Date(searchParams.get('endDate') as string)
    : tomorrow;

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: startDate,
    to: endDate,
  });

  // Initialize filter states from URL parameters
  const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[]>(
    searchParams.get('categoryName')?.split(',') || []
  );
  
  const [selectedTenants, setSelectedTenants] = useState<number[]>(
    searchParams.get('tenantID')?.split(',').map(Number) || []
  );
  
  const [selectedFacilities, setSelectedFacilities] = useState<number[]>(
    searchParams.get('facilityID')?.split(',').map(Number) || []
  );
  
  const [selectedCities, setSelectedCities] = useState<number[]>(
    searchParams.get('cityID')?.split(',').map(Number) || []
  );

  const [sortValue, setSortValue] = useState<SortDirection>(
    (searchParams.get('sortBy') === 'name' && searchParams.get('sortOrder') as SortDirection) || 'asc'
  );
  
  const [priceValue, setPriceValue] = useState<PriceDirection>(
    searchParams.get('sortBy') === 'price' 
      ? (searchParams.get('sortOrder') === 'asc' ? 'low-to-high' : 'high-to-low')
      : 'low-to-high'
  );

  const sortRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);

  // Function to update URL with current filter parameters
  const updateURL = (filters: PropertyFilterParams) => {
    // Create a URLSearchParams object
    const params = new URLSearchParams();
    
    // Add all filters to the URL
    if (Array.isArray(filters.categoryName) && filters.categoryName.length) {
      params.set('categoryName', filters.categoryName.join(','));
    }
    if (Array.isArray(filters.tenantID) && filters.tenantID.length) {
      params.set('tenantID', filters.tenantID.join(','));
    }
    if (Array.isArray(filters.facilityID) && filters.facilityID.length) {
      params.set('facilityID', filters.facilityID.join(','));
    }
    if (Array.isArray(filters.cityID) && filters.cityID.length) {
      params.set('cityID', filters.cityID.join(','));
    }
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
    if (filters.searchTerm) params.set('searchTerm', filters.searchTerm);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    if (filters.capacity) params.set('capacity', filters.capacity.toString());
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.limit) params.set('limit', filters.limit.toString());
    
    // Update the URL without refreshing the page
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const fetchProperties = async () => {
    try {
      const filters: PropertyFilterParams = {};

      if (selectedCategoryNames.length > 0) {
        filters.categoryName = selectedCategoryNames;
      }
      
      if (selectedTenants.length > 0) filters.tenantID = selectedTenants;
      if (selectedFacilities.length > 0)
        filters.facilityID = selectedFacilities;
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
        filters.startDate = dateRange.from.toISOString();
      }

      if (dateRange.to) {
        filters.endDate = dateRange.to.toISOString();
      }

      if (searchAdults && searchAdults !== '') {
        filters.capacity = parseInt(searchAdults);
      }

      // Add pagination parameters
      filters.page = page;
      filters.limit = limit;

      // Update URL with current filters
      updateURL(filters);

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
          getFacilityList(),
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
  }, [
    selectedCategoryNames,
    selectedTenants,
    selectedFacilities,
    selectedCities,
    sortValue,
    priceValue,
    page,
    limit,
  ]);

  useEffect(() => {
    if (!loading && properties.length === 0) {
      handleSearch();
    }
  }, [loading]);

  // Reset page when search or filters change
  useEffect(() => {
    setPage(1);
  }, [
    selectedCategoryNames,
    selectedTenants,
    selectedFacilities,
    selectedCities,
    sortValue,
    priceValue,
    searchTerm,
    searchAdults,
  ]);

  // Handle URL changes (back/forward navigation)
  useEffect(() => {
    const handleRouteChange = () => {
      const newSearchParams = new URLSearchParams(window.location.search);
      
      // Update state from URL parameters
      setPage(parseInt(newSearchParams.get('page') || '1', 10));
      setLimit(parseInt(newSearchParams.get('limit') || '10', 10));
      setSearchTerm(newSearchParams.get('searchTerm') || '');
      setSearchAdults(newSearchParams.get('capacity') || '2');
      
      const newCategories = newSearchParams.get('categoryName')?.split(',') || [];
      const newTenants = newSearchParams.get('tenantID')?.split(',').map(Number) || [];
      const newFacilities = newSearchParams.get('facilityID')?.split(',').map(Number) || [];
      const newCities = newSearchParams.get('cityID')?.split(',').map(Number) || [];
      
      setSelectedCategoryNames(newCategories);
      setSelectedTenants(newTenants);
      setSelectedFacilities(newFacilities);
      setSelectedCities(newCities);
      
      const newSortBy = newSearchParams.get('sortBy') || 'name';
      const newSortOrder = newSearchParams.get('sortOrder') || 'asc';
      
      if (newSortBy === 'price') {
        setPriceValue(newSortOrder === 'asc' ? 'low-to-high' : 'high-to-low');
      } else {
        setSortValue(newSortOrder as SortDirection);
        setPriceValue(null as any);
      }
      
      // Update date range
      const newStartDate = newSearchParams.get('startDate');
      const newEndDate = newSearchParams.get('endDate');
      
      setDateRange({
        from: newStartDate ? new Date(newStartDate) : undefined,
        to: newEndDate ? new Date(newEndDate) : undefined,
      });
    };

    // Set up event listener for URL changes
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

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

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle guest dropdown
      const guestDropdown = document.getElementById('guestDropdown');
      const guestButton = document.getElementById('guestButton');

      if (
        guestDropdown &&
        !guestDropdown.classList.contains('hidden') &&
        event.target instanceof Node &&
        !guestDropdown.contains(event.target) &&
        guestButton &&
        !guestButton.contains(event.target)
      ) {
        guestDropdown.classList.add('hidden');
      }

      // Handle sort dropdown
      const sortElement = sortRef.current;
      if (
        sortElement &&
        openDropdown.sort &&
        event.target instanceof Node &&
        !sortElement.contains(event.target)
      ) {
        toggleDropdown('sort');
      }

      // Handle price dropdown
      const priceElement = priceRef.current;
      if (
        priceElement &&
        openDropdown.price &&
        event.target instanceof Node &&
        !priceElement.contains(event.target)
      ) {
        toggleDropdown('price');
      }

      // Handle filter sections
      if (event.target instanceof Node) {
        const isFilterButton = (event.target as Element).closest(
          '[data-filter-button]',
        );
        const isFilterSection = (event.target as Element).closest(
          '[data-filter-section]',
        );

        if (!isFilterButton && !isFilterSection) {
          setOpenFilters({
            category: false,
            propertyName: false,
            facility: false,
            city: false,
          });
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown, toggleDropdown]);

  const toggleFilter = (name: FilterName) => {
    setOpenFilters((prev) => ({
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

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategoryNames((prev) => {
      if (prev.includes(categoryName)) {
        return prev.filter(name => name !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  const handleTenantClick = (tenantId: number) => {
    setSelectedTenants((prev) => {
      if (prev.includes(tenantId)) {
        return prev.filter((id) => id !== tenantId);
      } else {
        return [...prev, tenantId];
      }
    });
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

  const handleFacilityClick = (facilityId: number) => {
    setSelectedFacilities((prev) => {
      if (prev.includes(facilityId)) {
        return prev.filter((id) => id !== facilityId);
      } else {
        return [...prev, facilityId];
      }
    });
  };

  const handleCityClick = (cityId: number) => {
    setSelectedCities((prev) => {
      if (prev.includes(cityId)) {
        return prev.filter((id) => id !== cityId);
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
    // When capacity changes, we should also update the page to 1
    setPage(1);
    // Fetch properties with new capacity immediately to fix filtering issue
    if (value && value !== '') {
      const parsedValue = parseInt(value);
      if (!isNaN(parsedValue)) {
        const filters: PropertyFilterParams = {
          capacity: parsedValue,
          page: 1,
          limit: limit
        };
        
        // Include any current active filters
        if (selectedCategoryNames.length > 0) {
          filters.categoryName = selectedCategoryNames;
        }
        
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
        
        // Call fetchProperties explicitly after updating the state
        setTimeout(() => {
          fetchProperties();
        }, 0);
      }
    }
  };

  const handleDateRangeChange = (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    setDateRange(range);
  };

  const handleSearch = () => {
    setPage(1);
    fetchProperties();
  };

  const clearFilters = () => {
    setSelectedCategoryNames([]);
    setSelectedTenants([]);
    setSelectedFacilities([]);
    setSelectedCities([]);
    setPage(1);
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
    selectedCategoryNames,
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
    handleDateRangePickerChange,
    setOpenFilters,
    clearFilters,
    // Pagination props
    page,
    setPage,
    limit,
    setLimit,
    totalItems,
    totalPages,
  };
}
