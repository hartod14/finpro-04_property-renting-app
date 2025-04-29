import { prisma } from '@/config';
import { Request } from 'express';

class UserService {
  async getAllTenant(req: Request) {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        profile_picture: true,
      },
      where: {
        role: 'TENANT',
        deleted_at: null,
      },
      take: limit && limit > 0 ? limit : undefined,
    });
  }
}

export default new UserService();
