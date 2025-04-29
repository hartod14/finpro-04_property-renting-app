import { api } from './_api';

export const getAllFacility = async (limit: number | undefined) => {
  const res = await api(`/facility?limit=${limit}`, 'GET');
  return res.data;
};
