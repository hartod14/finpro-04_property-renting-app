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
    email_verified: true,
    role: 'USER',
  },
  {
    id: 2,
    name: 'Tenant',
    email: 'tenant@mail.com',
    phone: '0987654321',
    password: '$2a$12$s04QDF9eMHocZ92VCRdwEOUpR6QrkLzU6JCwyae9JyWonQPkAHoXG',
    profile_picture:
      'https://res.cloudinary.com/dv1ehfskz/image/upload/v1739848466/oq064fyxu0pfcmybph1f.jpg',
    email_verified: true,
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
    email_verified: true,
    role: 'USER',
  },
];
