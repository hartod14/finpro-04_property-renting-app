import { Prisma } from '@prisma/client';

export const categorySeed: Prisma.CategoryCreateManyInput[] = [
  {
    id: 1,
    name: 'Hotel',
    created_at: new Date('2025-04-12 09:57:27'),
  },
  {
    id: 2,
    name: 'Homestay',
    created_at: new Date('2025-04-12 09:57:27'),
  },
  {
    id: 3,
    name: 'Apartment',
    created_at: new Date('2025-04-12 09:57:27'),
  },
  {
    id: 4,
    name: 'Villa',
    created_at: new Date('2025-04-12 09:57:27'),
  },
]; 