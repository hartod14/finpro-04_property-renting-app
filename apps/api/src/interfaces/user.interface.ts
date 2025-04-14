import { Role } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface IUserLogin {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  password?: string;
  profile_picture?: string | null;
  point?: Decimal;
  is_verified: boolean;
  role: Role;
}
