import { prisma } from '@/config';
import { Request } from 'express';
import { pagination } from '@/helpers/pagination';

class PropertyService {
  async getAllData(req: Request) {
    const {
      categoryID,
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

    // Parse pagination parameters
    const pageNumber = parseInt(String(page), 10) || 1;
    const limitNumber = parseInt(String(limit), 10) || 15;

    const filters: any = {
      deleted_at: null,
    };

    if (categoryID) {
      const categoryIds = String(categoryID).split(',').map(Number);
      filters.category_id = { in: categoryIds };
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

    // Get the total count for pagination
    const totalProperties = await prisma.property.count({
      where: filters,
    });

    // Get properties with pagination
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
            roomHasFacilities: {
              include: {
                facility: true,
              },
            },
            RoomImage: true,
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
      orderBy: sortBy === 'name' 
        ? { name: sortOrder === 'asc' ? 'asc' : 'desc' }
        : undefined,
      ...pagination(pageNumber, limitNumber),
    });

    // Post-process for filters that can't be done directly in Prisma
    let filteredProperties = properties;

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

    if (capacity) {
      const requiredCapacity = Number(capacity);
      filteredProperties = filteredProperties.filter((property) => {
        return property.rooms.some((room) => room.capacity >= requiredCapacity);
      });
    }

    // Sort by price (can't be done directly in Prisma with our model)
    if (sortBy === 'price') {
      filteredProperties.sort((a, b) => {
        const aPrice =
          a.rooms.length > 0
            ? Number(a.rooms[0].base_price)
            : Number.MAX_SAFE_INTEGER;
        const bPrice =
          b.rooms.length > 0
            ? Number(b.rooms[0].base_price)
            : Number.MAX_SAFE_INTEGER;

        return sortOrder === 'asc'
          ? aPrice - bPrice
          : bPrice - aPrice;
      });
    }

    // Format properties for response
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
              images: lowestPriceRoom.RoomImage,
            }
          : null,
      };
    });

    // Return pagination metadata with the data
    return {
      properties: formattedProperties,
      pagination: {
        total: totalProperties,
        totalPage: Math.ceil(totalProperties / limitNumber),
        page: pageNumber,
        limit: limitNumber
      }
    };
  }
}

export default new PropertyService();
