import { prisma } from '@/config';
import { Request } from 'express';
import { pagination } from '@/helpers/pagination';

class PropertyService {
  async getAllData(req: Request) {
    const {
      categoryID,
      categoryName,
      tenantID,
      facilityID,
      cityID,
      sortBy = 'name',
      sortOrder = 'asc',
      minPrice,
      maxPrice,
      capacity,
      searchTerm,
      page = '1',
      limit = '15',
    } = req.query;

    const pageNumber = parseInt(String(page), 10) || 1;
    const limitNumber = parseInt(String(limit), 10) || 15;

    const filters: any = {
      deleted_at: null,
    };

    if (categoryID) {
      const categoryIds = String(categoryID).split(',').map(Number);
      filters.category_id = { in: categoryIds };
    }

    if (categoryName) {
      filters.category = {
        name: {
          in: String(categoryName).split(',')
        }
      };
    }

    if (tenantID) {
      const tenantIds = String(tenantID).split(',').map(Number);
      filters.tenant_id = { in: tenantIds };
    }

    if (cityID) {
      const cityIds = String(cityID).split(',').map(Number);
      filters.city_id = { in: cityIds };
    }

    if (searchTerm) {
      filters.OR = [
        { name: { contains: String(searchTerm), mode: 'insensitive' } },
        { address: { contains: String(searchTerm), mode: 'insensitive' } },
      ];
    }

    const totalProperties = await prisma.property.count({
      where: filters,
    });

    const properties = await prisma.property.findMany({
      where: filters,
      include: {
        rooms: {
          where: {
            deleted_at: null,
            ...(capacity ? { capacity: { gte: Number(capacity) } } : {}),
          },
          orderBy: {
            base_price: 'asc',
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
      orderBy:
        sortBy === 'name'
          ? { name: sortOrder === 'asc' ? 'asc' : 'desc' }
          : undefined,
      ...pagination(pageNumber, limitNumber),
    });

    let filteredProperties = properties.filter(property => property.rooms.length > 0);

    if (facilityID) {
      const facilityIds = String(facilityID).split(',').map(Number);
      filteredProperties = filteredProperties.filter((property) => {
        return property.propertyHasFacilities.some((pf) =>
          facilityIds.includes(pf.facility_id),
        );
      });
    }

    if (minPrice || maxPrice) {
      filteredProperties = filteredProperties.filter((property) => {
        if (property.rooms.length === 0) return false;

        const lowestPrice = Number(property.rooms[0].base_price);
        const minPriceValue = minPrice ? Number(minPrice) : 0;
        const maxPriceValue = maxPrice
          ? Number(maxPrice)
          : Number.MAX_SAFE_INTEGER;

        return lowestPrice >= minPriceValue && lowestPrice <= maxPriceValue;
      });
    }

    if (sortBy === 'price') {
      filteredProperties.sort((a, b) => {
        const aRooms = capacity 
          ? a.rooms.filter(room => room.capacity >= Number(capacity))
          : a.rooms;
        
        const bRooms = capacity
          ? b.rooms.filter(room => room.capacity >= Number(capacity))
          : b.rooms;

        const aPrice = aRooms.length > 0
          ? Number(aRooms[0].base_price)
          : Number.MAX_SAFE_INTEGER;
        
        const bPrice = bRooms.length > 0
          ? Number(bRooms[0].base_price)
          : Number.MAX_SAFE_INTEGER;

        return sortOrder === 'asc' ? aPrice - bPrice : bPrice - aPrice;
      });
    }
    const formattedProperties = filteredProperties.map((property) => {
      let lowestPriceRoom = null;

      if (capacity) {
        const requiredCapacity = Number(capacity);
        const roomsWithSufficientCapacity = property.rooms.filter(
          (room) => room.capacity >= requiredCapacity,
        );

        if (roomsWithSufficientCapacity.length > 0) {
          roomsWithSufficientCapacity.sort(
            (a, b) => Number(a.base_price) - Number(b.base_price),
          );
          lowestPriceRoom = roomsWithSufficientCapacity[0];
        }
      } else {
        lowestPriceRoom = property.rooms.length > 0 ? property.rooms[0] : null;
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
        facilities: property.propertyHasFacilities.map((pf) => pf.facility),
        images: property.propertyImages,
        lowestPriceRoom: lowestPriceRoom
          ? {
              id: lowestPriceRoom.id,
              name: lowestPriceRoom.name,
              base_price: lowestPriceRoom.base_price,
              capacity: lowestPriceRoom.capacity,
              size: lowestPriceRoom.size,
              total_room: lowestPriceRoom.total_room,
              facilities: lowestPriceRoom.roomHasFacilities.map(
                (rf) => rf.facility,
              ),
              images: lowestPriceRoom.roomImages,
            }
          : null,
      };
    });

    // Calculate the accurate total count of filteredProperties to fix pagination display
    const filteredTotalCount = filteredProperties.length > 0 ? filteredProperties.length : 0;

    return {
      properties: formattedProperties,
      pagination: {
        total: filteredTotalCount,
        totalPage: Math.ceil(filteredTotalCount / limitNumber),
        page: pageNumber,
        limit: limitNumber,
      },
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

  async getPropertyBySlug(slug: string) {
    const property = await prisma.property.findUnique({
      where: {
        slug,
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

  async getRecommendedProperties(req: Request) {
    const { limit = '6', cityID, categoryID } = req.query;
    const limitNumber = parseInt(String(limit), 10) || 6;

    const filters: any = {
      deleted_at: null,
    };

    if (cityID) {
      const cityIds = String(cityID).split(',').map(Number);
      filters.city_id = { in: cityIds };
    }

    if (categoryID) {
      const categoryIds = String(categoryID).split(',').map(Number);
      filters.category_id = { in: categoryIds };
    }

    const properties = await prisma.property.findMany({
      where: filters,
      include: {
        rooms: {
          where: {
            deleted_at: null,
          },
          orderBy: {
            base_price: 'asc',
          },
          include: {
            roomImages: true,
          },
          take: 1,
        },
        category: true,
        city: true,
        propertyImages: {
          take: 1,
        },
      },
      orderBy: { id: 'desc' }, // Get newest properties
      take: limitNumber,
    });

    const formattedProperties = properties.map((property) => {
      const lowestPriceRoom =
        property.rooms.length > 0 ? property.rooms[0] : null;

      return {
        id: property.id,
        name: property.name,
        slug: property.slug,
        address: property.address,
        category: property.category,
        city: property.city,
        image:
          property.propertyImages.length > 0
            ? property.propertyImages[0]
            : null,
        lowestPrice: lowestPriceRoom ? lowestPriceRoom.base_price : null,
      };
    });

    return formattedProperties;
  }
}

export default new PropertyService();
