import { api } from './_api';
import { getAccessToken, getAuth } from './auth';

export const getAllCategory = async () => {
  const res = await api('/category', 'GET').catch((err) =>
    err instanceof Error ? { error: err.message } : err,
  );

  return res.data;
};

