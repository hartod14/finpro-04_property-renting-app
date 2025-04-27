import { api } from './_api';

export interface PropertyFilterParams {
  categoryID?: number | number[];
  tenantID?: number | number[];
  facilityID?: number | number[];
  cityID?: number | number[];
  sortBy?: 'name' | 'price';
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  checkInDate?: string;
  checkOutDate?: string;
  capacity?: number;
}

export const getAllProperty = async (filters: PropertyFilterParams = {}) => {
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