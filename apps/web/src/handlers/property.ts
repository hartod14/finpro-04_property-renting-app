import { api } from './_api';

export interface PropertyFilterParams {
  categoryID?: number | number[];
  categoryName?: string | string[];
  tenantID?: number | number[];
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
  }
}

export const getAllProperty = async (filters: PropertyFilterParams = {}): Promise<PaginationResponse> => {
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
export const getPropertyBySlugWithFilters = async (slug: string, filters: {
  startDate?: string | null;
  endDate?: string | null;
  capacity?: string | null | number;
  adults?: string | null | number;
}) => {
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

  // Make API call with the query parameters
  // We're using the normal property endpoint with filters as query params
  // This will leverage the server-side filtering in getAllData method
  const res = await api(`/property?slug=${slug}&${params.toString()}`, 'GET');
  
  // The response will contain a property array, but we only want the first one
  // Make sure we handle the response format correctly
  if (res.data && res.data.properties && res.data.properties.length > 0) {
    return res.data.properties[0]; // Return the first (and likely only) property
  } else {
    // Return empty structure if no matching property
    return null;
  }
};

export interface RecommendedPropertyParams {
  limit?: number;
  cityID?: number | number[];
  categoryID?: number | number[];
}

// Get recommended properties with simplified data
export const getRecommendedProperties = async (params: RecommendedPropertyParams = {}) => {
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

  const res = await api(`/property/recommended?${queryParams.toString()}`, 'GET');
  return res.data;
}; 