import { prisma } from '@/config';
import { pagination } from '@/helpers/pagination';
import { decodeVerificationJwt } from '@/helpers/verification.jwt';
import { Request } from 'express';

class TenantRoomAvailabilityService {
  async getAllData(req: Request) {
    const { search, page, limit } = req.query;
    const { authorization } = req.headers;

    const token = String(authorization || '').split('Bearer ')[1];
    const user = decodeVerificationJwt(token) as { id: number };

    const data = await prisma.roomUnavailableDate.findMany({
      where: {
        room: {
          property: {
            tenant_id: user.id,
          },
        },
      },
      ...pagination(Number(page), Number(limit)),
    });

    return data;
  }
}

export default new TenantRoomAvailabilityService();
