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

export const deleteRoomAvailabilityData = async (id: string) => {
  return await api(
    `/tenant-room-availability/${id}`,
    'DELETE',
    undefined,
    await getAccessToken(),
  );
};
