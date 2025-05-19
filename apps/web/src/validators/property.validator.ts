import * as Yup from 'yup';

export const storePropertyValidator = Yup.object({
  name: Yup.string().required('Name is required'),
  checkin_time: Yup.string().required('Checkin time is required'),
  checkout_time: Yup.string().required('Checkout time is required'),
  description: Yup.string().nullable(),
  address: Yup.string().required('Address is required'),
  city_id: Yup.string().required('City is required'),
  category_id: Yup.string().required('Category is required'),
  latitude: Yup.string().required('Latitude is required'),
  longitude: Yup.string().required('Longitude is required'),
  images: Yup.array()
    .min(3, 'At least 3 images are required')
    .required('Images are required'),
  facilities: Yup.array().required('At least one facility is required'),
  rooms: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required('Room name is required'),
        base_price: Yup.number()
          .required('Base price is required')
          .positive('Price must be positive'),
        description: Yup.string().nullable(),
        capacity: Yup.number()
          .required('Capacity is required')
          .positive('Capacity must be positive')
          .integer('Capacity must be an integer'),
        size: Yup.number()
          .required('Size is required')
          .positive('Size must be positive'),
        total_room: Yup.number()
          .required('Total room is required')
          .positive('Total room must be positive')
          .integer('Total room must be an integer'),
        images: Yup.array()
          .min(2, 'At least 2 images are required per room')
          .required('Room images are required'),
        facilities: Yup.array().required(
          'At least one facility is required per room',
        ),
      }),
    )
    .min(1, 'At least 1 room is required')
    .required('Rooms are required'),
});

export const updatePropertyValidator = Yup.object({
  name: Yup.string().required('Name is required'),
  checkin_time: Yup.string().required('Checkin time is required'),
  checkout_time: Yup.string().required('Checkout time is required'),
  description: Yup.string().nullable(),
  address: Yup.string().required('Address is required'),
  city_id: Yup.string().required('City is required'),
  category_id: Yup.string().required('Category is required'),
  latitude: Yup.string().required('Latitude is required'),
  longitude: Yup.string().required('Longitude is required'),
  images: Yup.array()
    .min(3, 'At least 3 images are required')
    .required('Images are required'),
  facilities: Yup.array().required('At least one facility is required'),
});

export const storeRoomValidator = Yup.object({
  name: Yup.string().required('Room name is required'),
  base_price: Yup.number()
    .required('Base price is required')
    .positive('Price must be positive'),
  description: Yup.string().nullable(),
  capacity: Yup.number()
    .required('Capacity is required')
    .positive('Capacity must be positive')
    .integer('Capacity must be an integer'),
  size: Yup.number()
    .required('Size is required')
    .positive('Size must be positive'),
  total_room: Yup.number()
    .required('Total room is required')
    .positive('Total room must be positive')
    .integer('Total room must be an integer'),
  roomImages: Yup.array()
    .min(2, 'At least 2 images are required per room')
    .required('Room images are required'),
  facilities: Yup.array().required('At least one facility is required'),
});
