import { api } from './_api';

export const getAllTenant = async (limit: number) => {
  const res = await api(`/user/tenant-role?limit=${limit}`, 'GET');
  return res.data;
};
