import * as Yup from 'yup';

export const storeSeasonRateValidator = Yup.object({
  value_type: Yup.string().oneOf(['NOMINAL', 'PERCENTAGE']).required('Value type is required'),
  value: Yup.number().required('Value is required').min(0, 'Value must be a positive number'),
  start_date: Yup.string().required('Start date is required'),
  end_date: Yup.string().required('End date is required'),
  type: Yup.string().oneOf(['INCREASE', 'DECREASE']).required('Rate type is required'),
  description: Yup.string().nullable(),
  rooms: Yup.array().of(Yup.number()).required('Rooms are required'),
}); 