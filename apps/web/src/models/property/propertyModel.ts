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

export default function PropertyModel() {
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
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchAdults, setSearchAdults] = useState('');
  
  // Date range state
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Filter states - change to arrays for multiple selections
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTenants, setSelectedTenants] = useState<number[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<number[]>([]);
  const [selectedCities, setSelectedCities] = useState<number[]>([]);

  const [sortValue, setSortValue] = useState<SortDirection>('asc');
  const [priceValue, setPriceValue] = useState<PriceDirection>('low-to-high');

  const sortRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);

  // Function to fetch properties based on current filters
  const fetchProperties = async () => {
    try {
      const filters: PropertyFilterParams = {};
      
      // Add filters if selected (now use arrays)
      if (selectedCategories.length > 0) filters.categoryID = selectedCategories;
      if (selectedTenants.length > 0) filters.tenantID = selectedTenants;
      if (selectedFacilities.length > 0) filters.facilityID = selectedFacilities;
      if (selectedCities.length > 0) filters.cityID = selectedCities;
      
      // Debug current sort state
      console.log('Current sort state:');
      console.log('sortValue:', sortValue);
      console.log('priceValue:', priceValue);
      
      // Add sorting - ensure we set these correctly
      // Changed to separate handling of sorting by name and price
      if (priceValue) {
        // Price sorting
        filters.sortBy = 'price';
        filters.sortOrder = priceValue === 'low-to-high' ? 'asc' : 'desc';
        console.log('Using PRICE sorting');
      } else {
        // Name sorting (default)
        filters.sortBy = 'name';
        filters.sortOrder = sortValue;
        console.log('Using NAME sorting');
      }
      
      console.log(`Sorting by: ${filters.sortBy}, order: ${filters.sortOrder}`);
      
      // Add search term if provided
      if (searchTerm) {
        filters.searchTerm = searchTerm;
      }
      
      // Add date range if provided
      if (dateRange.from) {
        filters.checkInDate = dateRange.from.toISOString();
      }
      
      if (dateRange.to) {
        filters.checkOutDate = dateRange.to.toISOString();
      }
      
      // Add capacity filter if provided - ensure this is properly sent to the API
      if (searchAdults && searchAdults !== '') {
        console.log(`Setting capacity filter to ${searchAdults}`);
        filters.capacity = parseInt(searchAdults);
      }
      
      // Log the filters being sent to the API for debugging
      console.log('Sending filters to API:', filters);
      
      const data = await getAllProperty(filters);
      
      // Log the number of properties returned
      console.log(`API returned ${data.length} properties`);
      
      // We'll rely on the backend filtering for capacity now
      // as we've fixed the backend implementation
      let filteredData = data;
      
      // Client-side filtering for search if needed
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filteredData = filteredData.filter((property: IProperty) => 
          property.name.toLowerCase().includes(lowerSearchTerm) || 
          property.city.name.toLowerCase().includes(lowerSearchTerm) ||
          (property.address && property.address.toLowerCase().includes(lowerSearchTerm))
        );
      }
      
      setProperties(filteredData);
    } catch (err) {
      console.error('Error fetching properties:', err);
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
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Refetch properties when filters change
  useEffect(() => {
    if (!loading) {
      fetchProperties();
    }
  }, [selectedCategories, selectedTenants, selectedFacilities, selectedCities, sortValue, priceValue]);

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
    setOpenFilters({
      ...openFilters,
      [name]: !openFilters[name],
    });
  };

  const handleSortClick = (direction: SortDirection) => {
    setSortValue(direction);
    // Reset price sorting when sorting by name
    setPriceValue(null as any); // Use null to disable price sorting
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
  
  // Date range handling
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
  };
  
  const handleSearch = () => {
    // This will trigger the useEffect to refetch properties with the search term
    fetchProperties();
  };

  return {
    openFilters,
    openDropdown,
    categories,
    tenants,
    facilities,
    cities,
    properties,
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
    // Search related returns
    searchTerm,
    searchDate,
    searchAdults,
    handleSearchTermChange,
    handleDateChange,
    handleAdultsChange,
    handleSearch,
    // Date range
    dateRange,
    handleDateRangeChange,
  };
}
