import { prisma } from '@/config';
import { decodeVerificationJwt } from '@/helpers/verification.jwt';
import { pagination } from '@/helpers/pagination';
import { Request } from 'express';

class TenantPropertyService {
  async getAllData(req: Request) {
    const { search, page, limit } = req.query;
    const { authorization } = req.headers;

    const token = String(authorization || '').split('Bearer ')[1];
    const user = decodeVerificationJwt(token) as { id: number };

    const data = await prisma.property.findMany({
      where: {
        name: {
          contains: String(search || ''),
          mode: 'insensitive',
        },
        tenant_id: user.id,
        deleted_at: null,
      },
      include: {
        propertyImages: true,
        category: true,
        rooms: true,
        city: true,
      },
      ...pagination(Number(page), Number(limit)),
    });

    const total = await prisma.property.count({
      where: {
        name: {
          contains: String(search || ''),
          mode: 'insensitive',
        },
        tenant_id: user.id,
        deleted_at: null,
      },
    });

    return {
      data: data,
      total: total,
    };
  }
}

export default new TenantPropertyService();
