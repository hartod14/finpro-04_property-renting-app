import { pagination } from '../helpers/pagination';
import prisma from '../prisma';
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

  async getRoomById(roomId: number) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        roomImages: true,
        roomHasFacilities: {
          include: {
            facility: true,
          },
        },
      },
    });
    return room;
  }

  async createRoom(propertyId: number, req: Request) {
    const {
      name,
      base_price,
      description,
      capacity,
      size,
      total_room,
      roomImages,
      facilities,
    } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      const room = await tx.room.create({
        data: {
          name,
          base_price,
          description,
          capacity,
          size,
          total_room,
          property_id: propertyId,
        },
      });

      await tx.roomImage.createMany({
        data: roomImages.map((image: string) => ({
          room_id: room.id,
          path: image,
        })),
      });

      await tx.roomHasFacility.createMany({
        data: facilities.map((facility: string) => ({
          room_id: room.id,
          facility_id: facility,
        })),
      });

      return room;
    });

    return result;
  }

  async updateRoom(roomId: number, req: Request) {
    const {
      name,
      base_price,
      description,
      capacity,
      size,
      total_room,
      roomImages,
      facilities,
    } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      await tx.room.update({
        where: { id: roomId },
        data: { name, base_price, description, capacity, size, total_room },
      });

      await tx.roomImage.deleteMany({
        where: { room_id: roomId },
      });

      await tx.roomImage.createMany({
        data: roomImages.map((image: string) => ({
          room_id: roomId,
          path: image,
        })),
      });

      await tx.roomHasFacility.deleteMany({
        where: { room_id: roomId },
      });

      await tx.roomHasFacility.createMany({
        data: facilities.map((facility: string) => ({
          room_id: roomId,
          facility_id: facility,
        })),
      });

      return tx.room.findUnique({
        where: { id: roomId },
        include: {
          roomImages: true,
          roomHasFacilities: {
            include: {
              facility: true,
            },
          },
        },
      });
    });

    return result;
  }

  async deleteRoom(roomId: number) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new Error('Room not found');
    }

    await prisma.room.update({
      where: { id: roomId },
      data: { deleted_at: new Date() },
    });

    return room;
  }
}

export default new TenantPropertyRoomService();
