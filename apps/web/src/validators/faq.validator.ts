import * as Yup from 'yup';

export const storeCategoryValidator = Yup.object({
  name: Yup.string().required('Name is required'),
});
