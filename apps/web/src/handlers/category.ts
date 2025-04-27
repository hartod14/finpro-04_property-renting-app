import { api } from './_api';

export const getAllCategory = async () => {
  const res = await api('/category', 'GET');
  return res.data;
};
