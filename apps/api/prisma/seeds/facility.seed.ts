import { Prisma } from '@prisma/client';

export const facilitySeed: Prisma.FacilityCreateManyInput[] = [
  {
    id: 1,
    type: 'PROPERTY',
    name: 'Area Parkir',
    deleted_at: new Date(),
  },
  {
    id: 2,
    type: 'PROPERTY',
    name: 'Check-out Express',
    deleted_at: new Date(),
  },
  {
    id: 3,
    type: 'PROPERTY',
    name: 'Lift',
    deleted_at: new Date(),
  },
  {
    id: 4,
    type: 'PROPERTY',
    name: 'Layanan Kamar 24 Jam',
    deleted_at: new Date(),
  },
  {
    id: 5,
    type: 'PROPERTY',
    name: 'Restoran',
    deleted_at: new Date(),
  },
  {
    id: 6,
    type: 'PROPERTY',
    name: 'Kolam Renang',
    deleted_at: new Date(),
  },
  {
    id: 7,
    type: 'PROPERTY',
    name: 'Resepsionis 24 Jam',
    deleted_at: new Date(),
  },
  {
    id: 8,
    type: 'PROPERTY',
    name: 'Keamanan 24 Jam',
    deleted_at: new Date(),
  },
  {
    id: 9,
    type: 'PROPERTY',
    name: 'Penitipan Bagasi',
    deleted_at: new Date(),
  },
  {
    id: 10,
    type: 'PROPERTY',
    name: 'Laundry',
    deleted_at: new Date(),
  },
  {
    id: 11,
    type: 'ROOM',
    name: 'AC',
    deleted_at: new Date(),
  },
  {
    id: 12,
    type: 'ROOM',
    name: 'Pembuat Kopi/Teh',
    deleted_at: new Date(),
  },
  {
    id: 13,
    type: 'ROOM',
    name: 'Televisi',
    deleted_at: new Date(),
  },
  {
    id: 14,
    type: 'ROOM',
    name: 'Hair Dryer',
    deleted_at: new Date(),
  },
  {
    id: 15,
    type: 'ROOM',
    name: 'Shower',
    deleted_at: new Date(),
  },
  {
    id: 16,
    type: 'ROOM',
    name: 'Brankas Kamar',
    deleted_at: new Date(),
  },
  {
    id: 17,
    type: 'ROOM',
    name: 'Kulkas',
    deleted_at: new Date(),
  },
  {
    id: 18,
    type: 'ROOM',
    name: 'Setrika',
    deleted_at: new Date(),
  },
  {
    id: 19,
    type: 'ROOM',
    name: 'Minibar',
    deleted_at: new Date(),
  },
  {
    id: 20,
    type: 'ROOM',
    name: 'Balkon/Teras',
    deleted_at: new Date(),
  },
];
