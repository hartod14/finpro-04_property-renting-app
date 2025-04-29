import { Prisma } from '@prisma/client';

//all password = user123

export const userSeed: Prisma.UserCreateManyInput[] = [
  {
    id: 1,
    name: 'Hari Tody',
    email: 'haritody@gmail.com',
    phone: '1234567890',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1739848466/oq064fyxu0pfcmybph1f.jpg',
    is_verified: true,
    role: 'USER',
  },
  {
    id: 2,
    name: 'Aryaduta Group',
    email: 'aryaduta@mail.com',
    phone: '0812345678',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    phone: '1122334455',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1739848466/oq064fyxu0pfcmybph1f.jpg',
    is_verified: true,
    role: 'USER',
  },
  {
    id: 4,
    name: 'Swiss-Belinn Hotels',
    email: 'swissbelinn@mail.com',
    phone: '0823456789',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 5,
    name: 'Favehotel Group',
    email: 'favehotel@mail.com',
    phone: '0834567890',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 6,
    name: 'Marriott International',
    email: 'marriott@mail.com',
    phone: '0845678901',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 7,
    name: 'Grand City Hospitality',
    email: 'grandcity@mail.com',
    phone: '0856789012',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 8,
    name: 'Accor Hotels',
    email: 'accorhotels@mail.com',
    phone: '0867890123',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 9,
    name: 'RedDoorz Properties',
    email: 'reddoorz@mail.com',
    phone: '0878901234',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 10,
    name: 'Harlys Group',
    email: 'harlys@mail.com',
    phone: '0889012345',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 11,
    name: 'Ascott Limited',
    email: 'ascott@mail.com',
    phone: '0890123456',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 12,
    name: 'Bali Villa Management',
    email: 'balivilla@mail.com',
    phone: '0801234567',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 13,
    name: 'Wyndham Hotels',
    email: 'wyndham@mail.com',
    phone: '0812345670',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 14,
    name: 'Aston Hospitality',
    email: 'aston@mail.com',
    phone: '0823456781',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 15,
    name: 'Sapadia Group',
    email: 'sapadia@mail.com',
    phone: '0834567892',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 16,
    name: 'Pension Properties',
    email: 'pension@mail.com',
    phone: '0845678903',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 17,
    name: 'De Rossa Hospitality',
    email: 'derossa@mail.com',
    phone: '0856789014',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 18,
    name: 'Marindu Villa Group',
    email: 'marindu@mail.com',
    phone: '0867890125',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 19,
    name: 'Green Park Properties',
    email: 'greenpark@mail.com',
    phone: '0878901236',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 20,
    name: 'Mirta Management',
    email: 'mirta@mail.com',
    phone: '0889012347',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 21,
    name: 'Sahid Hotels',
    email: 'sahid@mail.com',
    phone: '0890123458',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 22,
    name: 'Malioboro Hospitality',
    email: 'malioboro@mail.com',
    phone: '0891234567',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 23,
    name: 'Platinum Hotels',
    email: 'platinum@mail.com',
    phone: '0811223344',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
  {
    id: 24,
    name: 'Sheraton Group',
    email: 'sheraton@mail.com',
    phone: '0822334455',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1745734467/wdbal2ss2jmhsv35k65j.png',
    is_verified: true,
    role: 'TENANT',
  },
];
