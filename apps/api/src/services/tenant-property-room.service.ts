import { pagination } from '@/helpers/pagination';
import prisma from '@/prisma';
import { Request } from 'express';

class TenantPropertyRoomService {
  async getRoomByPropertyId(propertyId: number, req: Request) {
    const { search, page, limit } = req.query;

    const data = await prisma.room.findMany({
      where: {
        property_id: propertyId,
        name: {
          contains: String(search || ''),
          mode: 'insensitive',
        },
        deleted_at: null,
      },
      include: {
        roomHasFacilities: {
          include: {
            facility: true,
          },
        },
        roomImages: true,
      },
      orderBy: {
        id: 'desc',
      },

      ...pagination(Number(page), Number(limit)),
    });

    const total = await prisma.room.count({
      where: {
        name: {
          contains: String(search || ''),
          mode: 'insensitive',
        },
        property_id: propertyId,
        deleted_at: null,
      },
    });
    return {
      data: data,
      total: total,
    };
  }
}

export default new TenantPropertyRoomService();
