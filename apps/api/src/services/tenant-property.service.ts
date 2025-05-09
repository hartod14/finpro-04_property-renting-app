import { prisma } from '@/config';
import { decodeVerificationJwt } from '@/helpers/verification.jwt';
import { pagination } from '@/helpers/pagination';
import { Request } from 'express';
import slugify from 'slugify';
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
        rooms: {
          include: {
            roomImages: true,
          },
        },
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

  async getPropertyById(id: number) {
    const property = await prisma.property.findUnique({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        rooms: {
          where: {
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
        },
        propertyHasFacilities: {
          include: {
            facility: true,
          },
        },
        category: true,
        city: true,
        tenant: true,
        propertyImages: true,
      },
    });

    if (!property) {
      throw new Error('Property not found');
    }

    return {
      id: property.id,
      name: property.name,
      slug: property.slug,
      description: property.description,
      address: property.address,
      checkin_time: property.checkin_time,
      checkout_time: property.checkout_time,
      category: property.category,
      city: property.city,
      tenant: {
        id: property.tenant.id,
        name: property.tenant.name,
        email: property.tenant.email,
        profile_picture: property.tenant.profile_picture,
      },
      facilities: property.propertyHasFacilities.map((pf) => ({
        ...pf.facility,
        type: 'PROPERTY',
      })),
      images: property.propertyImages,
      rooms: property.rooms.map((room) => ({
        id: room.id,
        name: room.name,
        base_price: room.base_price,
        description: room.description,
        capacity: room.capacity,
        size: room.size,
        total_room: room.total_room,
        facilities: room.roomHasFacilities.map((rf) => ({
          ...rf.facility,
          type: 'ROOM',
        })),
        images: room.roomImages,
      })),
    };
  }

  async createData(req: Request) {
    const { authorization } = req.headers;

    const token = String(authorization || '').split('Bearer ')[1];
    const user = decodeVerificationJwt(token) as { id: number };

    const result = await prisma.$transaction(async (tx) => {
      const {
        name,
        checkin_time,
        checkout_time,
        description,
        address,
        city_id,
        category_id,
        images,
        facilities,
        rooms,
      } = req.body;

      let city: string = '';
      try {
        const cityData = await tx.city.findUnique({
          where: {
            id: Number(city_id),
          },

          select: {
            name: true,
          },
        });

        city = cityData?.name || '';
      } catch (error) {
        throw new Error('City not found');
      }

      const timestamp = new Date().getTime();
      const slug = slugify(name + '-' + city + '-' + timestamp, {
        lower: true,
      });

      const property = await tx.property.create({
        data: {
          name,
          checkin_time: new Date(`1970-01-01T${checkin_time}`),
          checkout_time: new Date(`1970-01-01T${checkout_time}`),
          description,
          address,
          city_id: Number(city_id),
          category_id: Number(category_id),
          tenant_id: user.id,
          slug,
        },
      });

      await tx.propertyImage.createMany({
        data: images.map((image: string) => ({
          property_id: property.id,
          path: image,
        })),
      });

      await tx.propertyHasFacility.createMany({
        data: facilities.map((facility: string) => ({
          property_id: property.id,
          facility_id: facility,
        })),
      });

      await Promise.all(
        rooms.map(async (room: any) => {
          const roomData = await tx.room.create({
            data: {
              name: room.name,
              property_id: property.id,
              base_price: room.base_price,
              description: room.description,
              capacity: room.capacity,
              size: room.size,
              total_room: room.total_room,
            },
          });

          await tx.roomImage.createMany({
            data: room.images.map((image: string) => ({
              room_id: roomData.id,
              path: image,
            })),
          });

          await tx.roomHasFacility.createMany({
            data: room.facilities.map((facility: string) => ({
              room_id: roomData.id,
              facility_id: facility,
            })),
          });
        }),
      );

      return tx.property.findUnique({
        where: {
          id: property.id,
        },
        include: {
          propertyImages: true,
          propertyHasFacilities: true,
          rooms: {
            include: {
              roomImages: true,
              roomHasFacilities: true,
            },
          },
        },
      });
    });

    return result;
  }

  async updateData(req: Request) {
    const { id } = req.params;
    const {
      name,
      checkin_time,
      checkout_time,
      description,
      address,
      city_id,
      category_id,
      images,
      facilities,
    } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      try {
        await tx.property.findUnique({
          where: { id: Number(id) },
        });
      } catch (error) {
        throw new Error('Property not found');
      }

      await tx.property.update({
        where: { id: Number(id) },
        data: {
          name,
          checkin_time: new Date(`1970-01-01T${checkin_time}`),
          checkout_time: new Date(`1970-01-01T${checkout_time}`),
          description,
          address,
          city_id: Number(city_id),
          category_id: Number(category_id),
        },
      });

      await tx.propertyImage.deleteMany({
        where: { property_id: Number(id) },
      });

      await tx.propertyHasFacility.deleteMany({
        where: { property_id: Number(id) },
      });

      await tx.propertyImage.createMany({
        data: images.map((image: string) => ({
          property_id: Number(id),
          path: image,
        })),
      });

      await tx.propertyHasFacility.createMany({
        data: facilities.map((facility: string) => ({
          property_id: Number(id),
          facility_id: facility,
        })),
      });

      return tx.property.findUnique({
        where: { id: Number(id) },
        include: {
          propertyImages: true,
          propertyHasFacilities: true,
          rooms: {
            include: {
              roomImages: true,
              roomHasFacilities: true,
            },
          },
        },
      });
    });

    return result;
  }

  async deleteData(id: number) {
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new Error('Property not found');
    }

    await prisma.property.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}

export default new TenantPropertyService();
