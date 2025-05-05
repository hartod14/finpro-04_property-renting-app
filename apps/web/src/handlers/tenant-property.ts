import { api } from './_api';
import { getAccessToken } from './auth';

export const getAllProperty = async (
  name: string,
  page: number,
  limit: number,
) => {
  return await api(
    `/tenant-property?search=${name}&page=${page}&limit=${limit}`,
    'GET',
    undefined,
    await getAccessToken(),
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
};

export const deleteProperty = async (id: string) => {
  return await api(
    `/tenant-property/${id}`,
    'DELETE',
    undefined,
    await getAccessToken(),
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
};

export const getPropertyById = async (id: string) => {
  return await api(
    `/tenant-property/${id}`,
    'GET',
    undefined,
    await getAccessToken(),
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
};

export const createProperty = async (data: any) => {
  return await api(
    '/tenant-property',
    'POST',
    {
      body: data,
      contentType: 'application/json',
    },
    await getAccessToken(),
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
};

export const updateProperty = async (id: string, data: any) => {
  return await api(
    `/tenant-property/${id}`,
    'PUT',
    {
      body: data,
      contentType: 'application/json',
    },
    await getAccessToken(),
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
};
