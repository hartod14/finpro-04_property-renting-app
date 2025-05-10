import { prisma } from '@/config';
import { pagination } from '@/helpers/pagination';
import { decodeVerificationJwt } from '@/helpers/verification.jwt';
import { Request } from 'express';

class TenantSeasonRateService {
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
      roomHasPeakSeasonRates: {
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
      whereClause.roomHasPeakSeasonRates = {
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

    const data = await prisma.peakSeasonRate.findMany({
      where: whereClause,
      include: {
        roomHasPeakSeasonRates: {
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

    const total = await prisma.peakSeasonRate.count({
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

      // Check if any rooms match the search term, but keep all rooms
      let roomHasPeakSeasonRates = item.roomHasPeakSeasonRates;
      if (search) {
        const hasMatchingRoom = item.roomHasPeakSeasonRates.some(
          (roomData) => 
            roomData.room.name.toLowerCase().includes(String(search).toLowerCase()) ||
            roomData.room.property.name.toLowerCase().includes(String(search).toLowerCase())
        );
        
        // If no rooms match, return empty array
        if (!hasMatchingRoom) {
          roomHasPeakSeasonRates = [];
        }
        // If matching rooms exist, keep all original rooms
      }

      return {
        ...item,
        status: calculatedStatus,
        roomHasPeakSeasonRates,
      };
    });

    return { data: processedData, total };
  }

  async getDataById(id: number) {
    const data = await prisma.peakSeasonRate.findUnique({
      where: { id },
      include: {
        roomHasPeakSeasonRates: {
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
      throw new Error('Season rate not found');
    }

    return data;
  }

  async createData(req: Request) {
    const { value_type, value, start_date, end_date, type, description, rooms } = req.body;
    const { authorization } = req.headers;

    const token = String(authorization || '').split('Bearer ')[1];
    const user = decodeVerificationJwt(token) as { id: number };

    const overlappingDates = await prisma.roomHasPeakSeasonRate.findMany({
      where: {
        room_id: {
          in: rooms.map((room: number) => Number(room)),
        },
        peakSeasonRate: {
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
        peakSeasonRate: {
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
        existingStartDate: item.peakSeasonRate.start_date,
        existingEndDate: item.peakSeasonRate.end_date,
      }));

      throw {
        status: 400,
        message: 'Date range overlaps with existing season rates',
        details: {
          conflictingRooms,
        },
      };
    }

    const result = await prisma.$transaction(async (tx) => {
      const data = await tx.peakSeasonRate.create({
        data: {
          value_type,
          value,
          start_date: new Date(String(start_date)),
          end_date: new Date(String(end_date)),
          type,
          description,
          tenant_id: user.id,
        },
      });

      await tx.roomHasPeakSeasonRate.createMany({
        data: rooms.map((room: number) => ({
          room_id: Number(room),
          peak_season_rate_id: data.id,
        })),
      });

      return data;
    });

    return result;
  }

  async updateData(id: number, req: Request) {
    const { value_type, value, start_date, end_date, type, description, rooms } = req.body;
    const { authorization } = req.headers;

    const token = String(authorization || '').split('Bearer ')[1];
    const user = decodeVerificationJwt(token) as { id: number };

    const existingData = await prisma.peakSeasonRate.findUnique({
      where: { id },
      include: {
        roomHasPeakSeasonRates: true,
      },
    });

    if (!existingData) {
      throw new Error('Season rate not found');
    }

    if (existingData.tenant_id !== user.id) {
      throw new Error('Unauthorized');
    }

    const overlappingDates = await prisma.roomHasPeakSeasonRate.findMany({
      where: {
        room_id: {
          in: rooms.map((room: number) => Number(room)),
        },
        peakSeasonRate: {
          id: { not: id },
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
        peakSeasonRate: {
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
        existingStartDate: item.peakSeasonRate.start_date,
        existingEndDate: item.peakSeasonRate.end_date,
      }));

      throw {
        status: 400,
        message: 'Date range overlaps with existing season rates',
        details: {
          conflictingRooms,
        },
      };
    }

    const result = await prisma.$transaction(async (tx) => {
      // Delete existing room associations
      await tx.roomHasPeakSeasonRate.deleteMany({
        where: {
          peak_season_rate_id: id,
        },
      });

      // Update the peak season rate
      const data = await tx.peakSeasonRate.update({
        where: { id },
        data: {
          value_type,
          value,
          start_date: new Date(String(start_date)),
          end_date: new Date(String(end_date)),
          type,
          description,
          updated_at: new Date(),
        },
      });

      // Create new room associations
      await tx.roomHasPeakSeasonRate.createMany({
        data: rooms.map((room: number) => ({
          room_id: Number(room),
          peak_season_rate_id: id,
        })),
      });

      return data;
    });

    return result;
  }

  async deleteData(id: number) {
    const existingData = await prisma.peakSeasonRate.findUnique({
      where: { id },
    });

    if (!existingData) {
      throw new Error('Season rate not found');
    }

    // Soft delete
    const result = await prisma.$transaction(async (tx) => {
      // Delete room associations
      await tx.roomHasPeakSeasonRate.deleteMany({
        where: {
          peak_season_rate_id: id,
        },
      });

      // Update the peak season rate to mark as deleted
      const data = await tx.peakSeasonRate.update({
        where: { id },
        data: {
          deleted_at: new Date(),
        },
      });

      return data;
    });

    return result;
  }
}

export default new TenantSeasonRateService(); 