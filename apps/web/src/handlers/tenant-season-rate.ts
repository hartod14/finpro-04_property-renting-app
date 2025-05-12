import { api } from './_api';
import { getAccessToken } from './auth';

export const getAllSeasonRates = async (
  search: string,
  page: number,
  limit: number,
  date: string,
  status: string,
) => {
  return await api(
    `/tenant-season-rate?search=${search}&page=${page}&limit=${limit}&date=${date}&status=${status}`,
    'GET',
    undefined,
    await getAccessToken(),
  );
};

export const getSeasonRateData = async (id: number) => {
  return await api(
    `/tenant-season-rate/${id}`,
    'GET',
    undefined,
    await getAccessToken(),
  );
};

export const createSeasonRate = async (data: any) => {
  return await api(
    `/tenant-season-rate`,
    'POST',
    {
      body: data,
      contentType: 'application/json',
    },
    await getAccessToken(),
  );
};

export const updateSeasonRate = async (id: number, data: any) => {
  // Ensure data is an object with the required properties
  const payload = {
    value_type: data.value_type,
    value: data.value,
    start_date: data.start_date,
    end_date: data.end_date,
    type: data.type,
    description: data.description || '',
    rooms: Array.isArray(data.rooms) ? data.rooms : [],
  };
  
  return await api(
    `/tenant-season-rate/${id}`,
    'PUT',
    { body: payload, contentType: 'application/json' },
    await getAccessToken(),
  );
};

export const deleteSeasonRateData = async (id: string) => {
  return await api(
    `/tenant-season-rate/${id}`,
    'DELETE',
    undefined,
    await getAccessToken(),
  );
}; 