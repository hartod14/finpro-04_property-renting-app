import { prisma } from '../config';

export const getUserByEmail = (email: string) =>
  prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      password: true,
      profile_picture: true,
      email_verified: true,
      role: true,
    },
    where: {
      email: email,
    },
  });
