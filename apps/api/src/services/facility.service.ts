import { prisma } from '../config';
import { Request } from 'express';

class FacilityService {
  async getAllData(req: Request) {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    return await prisma.facility.findMany({
      select: {
        id: true,
        name: true,
        type: true,
      },
      take: limit && limit > 0 ? limit : undefined,
      where: {
        deleted_at: null,
      },
    });
  }
}

export default new FacilityService();
