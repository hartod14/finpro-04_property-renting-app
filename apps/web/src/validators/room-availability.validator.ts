import * as Yup from 'yup';

export const storeRoomAvailabilityValidator = Yup.object({
  start_date: Yup.string().required('Start date is required'),
  end_date: Yup.string().required('End date is required'),
  description: Yup.string().nullable(),
  rooms: Yup.array().of(Yup.number()).required('Rooms are required'),
});
