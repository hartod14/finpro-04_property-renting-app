import { api } from './_api';
import { getAccessToken } from './auth';

export const getAllRoomAvailability = async (
  search: string,
  page: number,
  limit: number,
  date: string,
  status: string,
) => {
  return await api(
    `/tenant-room-availability?search=${search}&page=${page}&limit=${limit}&date=${date}&status=${status}`,
    'GET',
    undefined,
    await getAccessToken(),
  );
};

export const getRoomAvailabilityData = async (id: number) => {
  return await api(
    `/tenant-room-availability/${id}`,
    'GET',
    undefined,
    await getAccessToken(),
  );
};

export const createRoomAvailability = async (data: any) => {
  return await api(
    `/tenant-room-availability`,
    'POST',
    {
      body: data,
      contentType: 'application/json',
    },
    await getAccessToken(),
  );
};

export const updateRoomAvailability = async (id: number, data: any) => {
  console.log('Data being sent in handler:', data);
  
  // Ensure data is an object with the required properties
  const payload = {
    start_date: data.start_date,
    end_date: data.end_date,
    description: data.description || '',
    rooms: Array.isArray(data.rooms) ? data.rooms : [],
  };
  
  return await api(
    `/tenant-room-availability/${id}`,
    'PUT',
    { body: payload, contentType: 'application/json' },
    await getAccessToken(),
  );
};

export const deleteRoomAvailabilityData = async (id: string) => {
  return await api(
    `/tenant-room-availability/${id}`,
    'DELETE',
    undefined,
    await getAccessToken(),
  );
};
