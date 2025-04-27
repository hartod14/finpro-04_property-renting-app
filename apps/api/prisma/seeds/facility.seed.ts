import { Prisma } from '@prisma/client';

export const facilitySeed: Prisma.FacilityCreateManyInput[] = [
  {
    id: 1,
    type: 'PROPERTY',
    name: 'Parking Area',
  },
  {
    id: 2,
    type: 'PROPERTY',
    name: 'Express Check-out',
  },
  {
    id: 3,
    type: 'PROPERTY',
    name: 'Elevator',
  },
  {
    id: 4,
    type: 'PROPERTY',
    name: '24-Hour Room Service',
  },
  {
    id: 5,
    type: 'PROPERTY',
    name: 'Restaurant',
  },
  {
    id: 6,
    type: 'PROPERTY',
    name: 'Swimming Pool',
  },
  {
    id: 7,
    type: 'PROPERTY',
    name: '24-Hour Reception',
  },
  {
    id: 8,
    type: 'PROPERTY',
    name: '24-Hour Security',
  },
  {
    id: 9,
    type: 'PROPERTY',
    name: 'Luggage Storage',
  },
  {
    id: 10,
    type: 'PROPERTY',
    name: 'Laundry',
  },
  {
    id: 11,
    type: 'ROOM',
    name: 'Air Conditioning',
  },
  {
    id: 12,
    type: 'ROOM',
    name: 'Coffee/Tea Maker',
  },
  {
    id: 13,
    type: 'ROOM',
    name: 'Television',
  },
  {
    id: 14,
    type: 'ROOM',
    name: 'Hair Dryer',
  },
  {
    id: 15,
    type: 'ROOM',
    name: 'Shower',
  },
  {
    id: 16,
    type: 'ROOM',
    name: 'Room Safe',
  },
  {
    id: 17,
    type: 'ROOM',
    name: 'Refrigerator',
  },
  {
    id: 18,
    type: 'ROOM',
    name: 'Iron',
  },
  {
    id: 19,
    type: 'ROOM',
    name: 'Minibar',
  },
  {
    id: 20,
    type: 'ROOM',
    name: 'Balcony/Terrace',
  },
];
