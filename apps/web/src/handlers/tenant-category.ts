import { api } from './_api';
import { getAccessToken, getAuth } from './auth';

export const getAllCategory = async (
  name: string | "",
  page: number | "",
  limit: number | "",
) => {
  return await api(
    `/tenant-category?search=${name}&page=${page}&limit=${limit}`,
    'GET',
    undefined,
    await getAccessToken(),
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
};

export const getCategoryById = async (id: string) => {
  return await api(
    `/tenant-category/${id}`,
    'GET',
    undefined,
    await getAccessToken(),
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
};

export const createCategory = async (inputData: Record<string, unknown>) => {
  return await api(
    '/tenant-category',
    'POST',
    {
      body: inputData,
      contentType: 'application/json',
    },
    await getAccessToken(),
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
};

export const updateCategory = async (id: string, data: any) => {
  return await api(
    `/tenant-category/${id}`,
    'PUT',
    {
      body: data,
      contentType: 'application/json',
    },
    await getAccessToken(),
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
};

export const deleteCategory = async (id: string) => {
  return await api(
    `/tenant-category/${id}`,
    'DELETE',
    undefined,
    await getAccessToken(),
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
};
