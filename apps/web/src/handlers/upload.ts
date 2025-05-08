import { api } from './_api';

export const uploadImage = async (formData: FormData) => {
  return await api('/upload-image', 'POST', {
    body: formData,
  }).catch((err) => (err instanceof Error ? { error: err.message } : err));
};
