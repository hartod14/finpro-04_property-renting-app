import { Prisma } from '@prisma/client';

export const citySeed: Prisma.CityCreateManyInput[] = [
  {
    id: 1,
    name: 'Medan',
  },
  {
    id: 2,
    name: 'Jakarta',
  },
  {
    id: 3,
    name: 'Bali',
  },
  {
    id: 4,
    name: 'Bandung',
  },
  {
    id: 5,
    name: 'Yogyakarta',
  },
  {
    id: 6,
    name: 'Surabaya',
  },
]; 