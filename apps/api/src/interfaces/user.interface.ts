import { Role } from '@prisma/client';

export interface IUserLogin {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  password?: string;
  profile_picture?: string | null;
  is_verified: boolean;
  role: Role;
}
