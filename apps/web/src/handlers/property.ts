import { api } from './_api';

export interface PropertyFilterParams {
  categoryID?: number | number[];
  categoryName?: string | string[];
  tenantID?: number | number[] | null;
  facilityID?: number | number[];
  cityID?: number | number[];
  sortBy?: 'name' | 'price';
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  capacity?: number;
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  properties: any[];
  pagination: {
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  };
}

export const getAllProperty = async (
  filters: PropertyFilterParams = {},
): Promise<PaginationResponse> => {
  // Build query parameters
  const params = new URLSearchParams();

  // Handle arrays for multi-select filters
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      params.append(key, value.join(','));
    } else if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });

  const res = await api(`/property?${params.toString()}`, 'GET');
  return res.data;
};

// Get property by ID with full details including rooms
export const getPropertyById = async (id: string | number) => {
  const res = await api(`/property/${id}`, 'GET');
  return res.data;
};

// Get property by slug with full details including rooms
export const getPropertyBySlug = async (slug: string) => {
  const res = await api(`/property/slug/${slug}`, 'GET');
  return res.data;
};

// Get property by slug with filters applied at the server level
export const getPropertyBySlugWithFilters = async (
  slug: string,
  filters: {
    startDate?: string | null;
    endDate?: string | null;
    capacity?: string | null | number;
    adults?: string | null | number;
  },
) => {
  // Build query parameters
  const params = new URLSearchParams();

  // Handle each filter parameter
  if (filters.startDate) {
    params.append('startDate', filters.startDate);
  }

  if (filters.endDate) {
    params.append('endDate', filters.endDate);
  }

  // Handle capacity (support both adults and capacity params for compatibility)
  if (filters.capacity) {
    params.append('capacity', String(filters.capacity));
  } else if (filters.adults) {
    params.append('capacity', String(filters.adults));
  }

  try {
    // First get the property details using the dedicated slug endpoint
    const propertyRes = await api(`/property/slug/${slug}`, 'GET');
    
    if (!propertyRes.data) {
      return null;
    }
    
    const property = propertyRes.data;
    
    // If we need to apply filters (capacity, dates), use the dedicated rooms endpoint
    if (filters.capacity || filters.adults || filters.startDate || filters.endDate) {
      // Build room query parameters
      const roomParams = new URLSearchParams();
      
      if (filters.capacity || filters.adults) {
        const capacityValue = Number(filters.capacity || filters.adults || 0);
        if (capacityValue > 0) {
          roomParams.append('capacity', String(capacityValue));
        }
      }
      
      // Add date filters to calculate adjusted prices for peak season rates
      if (filters.startDate) {
        roomParams.append('startDate', String(filters.startDate));
      }
      
      if (filters.endDate) {
        roomParams.append('endDate', String(filters.endDate));
      }
      
      if (roomParams.toString()) {
        // Use the updated slug/rooms endpoint with filters
        const roomsRes = await api(`/property/slug/${slug}/rooms?${roomParams.toString()}`, 'GET');
        
        if (roomsRes.data) {
          // Replace the rooms with the filtered ones
          property.rooms = roomsRes.data;
        }
      }
    }
    
    return property;
  } catch (error) {
    throw error;
  }
};

export interface RecommendedPropertyParams {
  limit?: number;
  cityID?: number | number[];
  categoryID?: number | number[];
}

// Get recommended properties with simplified data
export const getRecommendedProperties = async (
  params: RecommendedPropertyParams = {},
) => {
  // Build query parameters
  const queryParams = new URLSearchParams();

  // Handle parameters
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      queryParams.append(key, value.join(','));
    } else if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  const res = await api(
    `/property/recommended?${queryParams.toString()}`,
    'GET',
  );
  return res.data;
};

// Function to get rooms by property slug
export const getRoomsByPropertySlug = async (
  slug: string,
  filters: {
    capacity?: string | number | null;
    startDate?: string | null;
    endDate?: string | null;
  } = {}
) => {
  const params = new URLSearchParams();
  
  // Add capacity filter if provided
  if (filters.capacity) {
    params.append('capacity', String(filters.capacity));
  }
  
  // Add date filters to calculate adjusted prices for peak season rates
  if (filters.startDate) {
    params.append('startDate', String(filters.startDate));
  }
  
  if (filters.endDate) {
    params.append('endDate', String(filters.endDate));
  }
  
  try {
    const queryParams = params.toString() ? `?${params.toString()}` : '';
    
    // Use the updated endpoint structure
    const res = await api(`/property/slug/${slug}/rooms${queryParams}`, 'GET');
    return res.data;
  } catch (error) {
    throw error;
  }
};
