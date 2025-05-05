import { api } from './_api';

export const getAllCity = async () => {
  const res = await api('/city', 'GET');
  return res.data;
};
