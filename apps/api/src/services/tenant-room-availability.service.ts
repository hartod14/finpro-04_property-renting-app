import { prisma } from '@/config';
import { pagination } from '@/helpers/pagination';
import { decodeVerificationJwt } from '@/helpers/verification.jwt';
import { Request } from 'express';
import { roomSeed } from 'prisma/seeds/room.seed';

class TenantRoomAvailabilityService {
  async getAllData(req: Request) {
    const { search, page, limit, date, status } = req.query;
    const { authorization } = req.headers;

    const token = String(authorization || '').split('Bearer ')[1];
    const user = decodeVerificationJwt(token) as { id: number };

    const now = new Date();

    let whereClause: any = {
      deleted_at: null,
      tenant_id: user.id,
      ...(date
        ? {
            AND: [
              { start_date: { lte: new Date(String(date)) } },
              { end_date: { gte: new Date(String(date)) } },
            ],
          }
        : {}),
      roomHasUnavailableDates: {
        some: {
          room: {
            property: {
              tenant_id: user.id,
            },
          },
        },
      },
    };

    if (status) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      switch (String(status)) {
        case 'passed':
          whereClause.end_date = { lt: now };
          break;
        case 'ongoing':
          whereClause.start_date = { lte: now };
          whereClause.end_date = { gte: now };
          break;
        case 'incoming':
          whereClause.start_date = { gt: now };
          break;
      }
    }

    if (search) {
      whereClause.roomHasUnavailableDates = {
        some: {
          room: {
            OR: [
              {
                name: {
                  contains: String(search),
                  mode: 'insensitive',
                },
              },
              {
                property: {
                  name: {
                    contains: String(search),
                    mode: 'insensitive',
                  },
                  deleted_at: null,
                },
              },
            ],
            property: {
              tenant_id: user.id,
            },
          },
        },
      };
    }

    const data = await prisma.roomUnavailableDate.findMany({
      where: whereClause,
      include: {
        roomHasUnavailableDates: {
          include: {
            room: {
              include: {
                property: {
                  include: {
                    city: true,
                  },
                },
              },
            },
          },
        },
      },
      ...pagination(Number(page), Number(limit)),
    });

    const total = await prisma.roomUnavailableDate.count({
      where: whereClause,
    });

    const processedData = data.map((item) => {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const startDate = new Date(item.start_date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(item.end_date);
      endDate.setHours(0, 0, 0, 0);

      let calculatedStatus = '';

      if (endDate.getTime() < currentDate.getTime()) {
        calculatedStatus = 'passed';
      } else if (
        startDate.getTime() <= currentDate.getTime() &&
        endDate.getTime() >= currentDate.getTime()
      ) {
        calculatedStatus = 'ongoing';
      } else {
        calculatedStatus = 'incoming';
      }

      let roomHasUnavailableDates = item.roomHasUnavailableDates;
      if (search) {
        const hasMatchingRoom = item.roomHasUnavailableDates.some(
          (roomData) => 
            roomData.room.name.toLowerCase().includes(String(search).toLowerCase()) ||
            roomData.room.property.name.toLowerCase().includes(String(search).toLowerCase())
        );
        
        if (!hasMatchingRoom) {
          roomHasUnavailableDates = [];
        }
      }

      return {
        ...item,
        status: calculatedStatus,
        roomHasUnavailableDates,
      };
    });

    return { data: processedData, total };
  }

  async getDataById(id: number) {
    const data = await prisma.roomUnavailableDate.findUnique({
      where: { id },
      include: {
        roomHasUnavailableDates: {
          include: {
            room: {
              include: {
                property: {
                  include: {
                    city: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!data) {
      throw new Error('Room availability not found');
    }

    return data;
  }

  async createData(req: Request) {
    const { start_date, end_date, description, rooms } = req.body;
    const { authorization } = req.headers;

    const token = String(authorization || '').split('Bearer ')[1];
    const user = decodeVerificationJwt(token) as { id: number };

    const overlappingDates = await prisma.roomHasUnavailableDate.findMany({
      where: {
        room_id: {
          in: rooms.map((room: number) => Number(room)),
        },
        roomUnavailableDate: {
          deleted_at: null,
          OR: [
            {
              start_date: { lte: new Date(String(start_date)) },
              end_date: { gte: new Date(String(start_date)) },
            },
            {
              start_date: { lte: new Date(String(end_date)) },
              end_date: { gte: new Date(String(end_date)) },
            },
            {
              start_date: { gte: new Date(String(start_date)) },
              end_date: { lte: new Date(String(end_date)) },
            },
          ],
        },
      },
      include: {
        room: {
          select: {
            name: true,
          },
        },
        roomUnavailableDate: {
          select: {
            start_date: true,
            end_date: true,
          },
        },
      },
    });

    if (overlappingDates.length > 0) {
      const conflictingRooms = overlappingDates.map((item) => ({
        roomName: item.room.name,
        existingStartDate: item.roomUnavailableDate.start_date,
        existingEndDate: item.roomUnavailableDate.end_date,
      }));

      throw {
        status: 400,
        message: 'Date range overlaps with existing unavailable dates',
        details: {
          conflictingRooms,
        },
      };
    }

    const result = await prisma.$transaction(async (tx) => {
      const data = await tx.roomUnavailableDate.create({
        data: {
          start_date: new Date(String(start_date)),
          end_date: new Date(String(end_date)),
          description,
          tenant_id: user.id,
        },
      });

      await tx.roomHasUnavailableDate.createMany({
        data: rooms.map((room: number) => ({
          room_id: Number(room),
          room_unavailable_date_id: data.id,
        })),
      });

      return data;
    });

    return result;
  }

  async updateData(id: number, req: Request) {
    const { start_date, end_date, description, rooms } = req.body;
    const { authorization } = req.headers;

    const token = String(authorization || '').split('Bearer ')[1];
    const user = decodeVerificationJwt(token) as { id: number };

    const overlappingDates = await prisma.roomHasUnavailableDate.findMany({
      where: {
        room_id: {
          in: rooms.map((room: number) => Number(room)),
        },
        roomUnavailableDate: {
          deleted_at: null,
          id: { not: id },
          OR: [
            {
              start_date: { lte: new Date(String(start_date)) },
              end_date: { gte: new Date(String(start_date)) },
            },
            {
              start_date: { lte: new Date(String(end_date)) },
              end_date: { gte: new Date(String(end_date)) },
            },
            {
              start_date: { gte: new Date(String(start_date)) },
              end_date: { lte: new Date(String(end_date)) },
            },
          ],
        },
      },
      include: {
        room: {
          select: {
            name: true,
          },
        },
        roomUnavailableDate: {
          select: {
            start_date: true,
            end_date: true,
          },
        },
      },
    });

    if (overlappingDates.length > 0) {
      const conflictingRooms = overlappingDates.map((item) => ({
        roomName: item.room.name,
        existingStartDate: item.roomUnavailableDate.start_date,
        existingEndDate: item.roomUnavailableDate.end_date,
      }));

      throw {
        status: 400,
        message: 'Date range overlaps with existing unavailable dates',
        details: {
          conflictingRooms,
        },
      };
    }

    const result = await prisma.$transaction(async (tx) => {
      const data = await tx.roomUnavailableDate.update({
        where: { id },
        data: {
          start_date: new Date(String(start_date)),
          end_date: new Date(String(end_date)),
          description,
          tenant_id: user.id,
        },
      });

      await tx.roomHasUnavailableDate.deleteMany({
        where: {
          room_unavailable_date_id: id,
        },
      });

      await tx.roomHasUnavailableDate.createMany({
        data: rooms.map((room: number) => ({
          room_id: Number(room),
          room_unavailable_date_id: data.id,
        })),
      });

      return data;
    });

    return result;
  }

  async deleteData(id: number) {
    const existingRecord = await prisma.roomUnavailableDate.findUnique({
      where: { id },
      include: {
        roomHasUnavailableDates: true,
      },
    });

    if (!existingRecord) {
      throw new Error('Room availability not found');
    }

    try {
      return await prisma.$transaction(async (tx) => {
        await tx.roomHasUnavailableDate.deleteMany({
          where: {
            room_unavailable_date_id: id,
          },
        });

        const data = await tx.roomUnavailableDate.update({
          where: { id },
          data: { deleted_at: new Date() },
        });

        return data;
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new TenantRoomAvailabilityService();
