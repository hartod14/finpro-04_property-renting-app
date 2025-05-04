import { api } from './_api';
import { getAccessToken, getAuth } from './auth';

export const getAllCategory = async () => {
  const res = await api('/category', 'GET').catch((err) =>
    err instanceof Error ? { error: err.message } : err,
  );

  return res.data;
};

export const getAllCategoryByUserId = async (
  name: string,
  page: number,
  limit: number,
) => {
  return await api(
    `/category/list/tenant?search=${name}&page=${page}&limit=${limit}`,
    'GET',
    undefined,
    await getAccessToken(),
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
};

export const getCategoryById = async (id: string) => {
  return await api(
    `/category/${id}`,
    'GET',
    undefined,
    await getAccessToken(),
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
};

export const createCategory = async (inputData: Record<string, unknown>) => {
  return await api(
    '/category',
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
    `/category/${id}`,
    'PUT',
    {
      body: data,
    },
    await getAccessToken(),
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
};

export const deleteCategory = async (id: string) => {
  return await api(
    `/category/${id}`,
    'DELETE',
    undefined,
    await getAccessToken(),
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
};
