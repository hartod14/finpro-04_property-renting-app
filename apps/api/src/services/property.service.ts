import { prisma } from '@/config';
import { Request } from 'express';
import { pagination } from '@/helpers/pagination';
import { log } from 'console';

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
      startDate,
      endDate,
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
          in: String(categoryName).split(','),
        },
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
    // const totalProperties = await prisma.property.count({
    //   where: filters,
    // });

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
            roomHasUnavailableDates: {
              include: {
                roomUnavailableDate: true,
              },
            },
            roomHasPeakSeasonRates: {
              include: {
                peakSeasonRate: true,
              },
            },
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

    // Filter out rooms that are unavailable during the requested dates
    let filteredProperties = properties;

    if (startDate && endDate) {
      // Convert query parameters to Date objects and set to start of day
      const requestStartDate = new Date(String(startDate));
      const requestEndDate = new Date(String(endDate));

      // Remove time component for cleaner comparison
      const normalizeDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
      };

      const requestStartStr = normalizeDate(requestStartDate);
      const requestEndStr = normalizeDate(requestEndDate);

      filteredProperties = filteredProperties.map((property) => {
        // Filter out unavailable rooms
        const availableRooms = property.rooms.filter((room) => {
          // Check if room has any unavailable dates that overlap with requested dates
          return !room.roomHasUnavailableDates.some((unavailable) => {
            const roomStartDate = new Date(
              unavailable.roomUnavailableDate.start_date,
            );
            const roomEndDate = new Date(
              unavailable.roomUnavailableDate.end_date,
            );

            const roomStartStr = normalizeDate(roomStartDate);
            const roomEndStr = normalizeDate(roomEndDate);

            // If start date of request falls on any day in the unavailable range
            if (
              requestStartStr >= roomStartStr &&
              requestStartStr <= roomEndStr
            ) {
              return true;
            }

            // If end date of request falls on any day in the unavailable range
            if (requestEndStr >= roomStartStr && requestEndStr <= roomEndStr) {
              return true;
            }

            // If request period completely contains the unavailable period
            if (
              requestStartStr <= roomStartStr &&
              requestEndStr >= roomEndStr
            ) {
              return true;
            }

            return false;
          });
        });

        return {
          ...property,
          rooms: availableRooms,
        };
      });

      // Filter out properties with no available rooms
      filteredProperties = filteredProperties.filter(
        (property) => property.rooms.length > 0,
      );
    } else {
      // If no date filter, just ensure properties have at least one room
      filteredProperties = filteredProperties.filter(
        (property) => property.rooms.length > 0,
      );
    }

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
      // When sorting by price, ensure we compare based on the adjusted price when available
      filteredProperties.sort((a, b) => {
        const aRooms = capacity
          ? a.rooms.filter((room) => room.capacity >= Number(capacity))
          : a.rooms;

        const bRooms = capacity
          ? b.rooms.filter((room) => room.capacity >= Number(capacity))
          : b.rooms;

        // Helper function to get the effective price of a room
        const getEffectivePrice = (room: any) => {
          if (!room) return Number.MAX_SAFE_INTEGER;
          
          // Start with base price
          let price = Number(room.base_price);
          
          // If we have date filters and the room has peak season rates, calculate adjusted price
          if (startDate && endDate && room.roomHasPeakSeasonRates?.length > 0) {
            const requestStartDate = new Date(String(startDate));
            const requestEndDate = new Date(String(endDate));
            
            // Look for applicable peak season rates
            for (const relation of room.roomHasPeakSeasonRates) {
              const rate = relation.peakSeasonRate;
              const rateStartDate = new Date(rate.start_date);
              const rateEndDate = new Date(rate.end_date);
              
              // Check if dates overlap
              if (requestStartDate <= rateEndDate && requestEndDate >= rateStartDate) {
                // Apply rate adjustment
                if (rate.value_type === 'PERCENTAGE') {
                  const percentValue = Number(rate.value) / 100;
                  if (rate.type === 'INCREASE') {
                    price += price * percentValue;
                  } else if (rate.type === 'DECREASE') {
                    price -= price * percentValue;
                  }
                } else if (rate.value_type === 'NOMINAL') {
                  if (rate.type === 'INCREASE') {
                    price += Number(rate.value);
                  } else if (rate.type === 'DECREASE') {
                    price -= Number(rate.value);
                  }
                }
                // Only apply the first matching rate
                break;
              }
            }
          }
          
          return price;
        };

        // Find the lowest effective price for each property's rooms
        const getLowestPriceRoom = (rooms: any[]) => {
          if (rooms.length === 0) return null;
          
          let lowestRoom = rooms[0];
          let lowestPrice = getEffectivePrice(lowestRoom);
          
          for (let i = 1; i < rooms.length; i++) {
            const roomPrice = getEffectivePrice(rooms[i]);
            if (roomPrice < lowestPrice) {
              lowestPrice = roomPrice;
              lowestRoom = rooms[i];
            }
          }
          
          return { room: lowestRoom, price: lowestPrice };
        };
        
        const propertyALowestPrice = getLowestPriceRoom(aRooms)?.price || Number.MAX_SAFE_INTEGER;
        const propertyBLowestPrice = getLowestPriceRoom(bRooms)?.price || Number.MAX_SAFE_INTEGER;
        
        return sortOrder === 'asc' 
          ? propertyALowestPrice - propertyBLowestPrice 
          : propertyBLowestPrice - propertyALowestPrice;
      });
    }

    const formattedProperties = filteredProperties.map((property) => {
      // First calculate adjusted prices for all rooms
      const roomsWithCalculatedPrices = property.rooms.map(room => {
        let calculatedPrice = Number(room.base_price);
        
        // Calculate adjusted price if dates are provided
        if (startDate && endDate && room.roomHasPeakSeasonRates && room.roomHasPeakSeasonRates.length > 0) {
          const requestStartDate = new Date(String(startDate));
          const requestEndDate = new Date(String(endDate));
          
          for (const peakRateRelation of room.roomHasPeakSeasonRates) {
            const peakRate = peakRateRelation.peakSeasonRate;
            const peakStartDate = new Date(peakRate.start_date);
            const peakEndDate = new Date(peakRate.end_date);
            
            // Check if dates overlap
            if (requestStartDate <= peakEndDate && requestEndDate >= peakStartDate) {
              // Apply rate adjustment
              const basePrice = Number(room.base_price);
              if (peakRate.value_type === 'PERCENTAGE') {
                const percentValue = Number(peakRate.value) / 100;
                if (peakRate.type === 'INCREASE') {
                  calculatedPrice = basePrice + basePrice * percentValue;
                } else if (peakRate.type === 'DECREASE') {
                  calculatedPrice = basePrice - basePrice * percentValue;
                }
              } else if (peakRate.value_type === 'NOMINAL') {
                if (peakRate.type === 'INCREASE') {
                  calculatedPrice = basePrice + Number(peakRate.value);
                } else if (peakRate.type === 'DECREASE') {
                  calculatedPrice = basePrice - Number(peakRate.value);
                }
              }
              
              // Only consider the first applicable peak rate
              break;
            }
          }
        }
        
        return {
          ...room,
          calculatedPrice
        };
      });
      
      // Filter for capacity
      let eligibleRooms = roomsWithCalculatedPrices;
      if (capacity) {
        const requiredCapacity = Number(capacity);
        eligibleRooms = roomsWithCalculatedPrices.filter(
          room => room.capacity >= requiredCapacity,
        );
      }
      
      // Sort by calculated price to find true lowest price
      eligibleRooms.sort((a, b) => a.calculatedPrice - b.calculatedPrice);
      
      // Get the lowest price room after adjustments
      const lowestPriceRoom = eligibleRooms.length > 0 ? eligibleRooms[0] : null;

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
              adjusted_price: lowestPriceRoom.calculatedPrice,
              capacity: lowestPriceRoom.capacity,
              size: lowestPriceRoom.size,
              total_room: lowestPriceRoom.total_room,
              facilities: lowestPriceRoom.roomHasFacilities.map(
                (rf) => rf.facility,
              ),
              images: lowestPriceRoom.roomImages,
              peak_season_rates: lowestPriceRoom.roomHasPeakSeasonRates.map(
                (rr) => rr.peakSeasonRate
              ),
            }
          : null,
      };
    });

    // Calculate the accurate total count of filteredProperties to fix pagination display
    const filteredTotalCount =
      filteredProperties.length > 0 ? filteredProperties.length : 0;

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

  async getRoomsByPropertyId(slug: string, req: Request) {
    const { startDate, endDate, capacity } = req.query;

    const capacityNumber = capacity ? Number(capacity) : null;

    const whereClause: any = {
      property: {
        slug: slug,
      },
      deleted_at: null,
    };

    if (capacityNumber) {
      whereClause.capacity = {
        gte: capacityNumber,
      };
    }

    const rooms = await prisma.room.findMany({
      where: whereClause,
      include: {
        roomImages: true,
        roomHasFacilities: {
          include: {
            facility: true,
          },
        },
        roomHasUnavailableDates: {
          include: {
            roomUnavailableDate: true,
          },
        },
        roomHasPeakSeasonRates: {
          include: {
            peakSeasonRate: true,
          },
        },
      },
    });

    // If we have date parameters, calculate adjusted prices based on peak season rates
    if (startDate && endDate) {
      const requestStartDate = new Date(String(startDate));
      const requestEndDate = new Date(String(endDate));

      return rooms.map(room => {
        let adjusted_price = Number(room.base_price);
        
        // Check if room has peak season rates that overlap with the requested dates
        if (room.roomHasPeakSeasonRates && room.roomHasPeakSeasonRates.length > 0) {
          for (const peakRateRelation of room.roomHasPeakSeasonRates) {
            const peakRate = peakRateRelation.peakSeasonRate;
            const peakStartDate = new Date(peakRate.start_date);
            const peakEndDate = new Date(peakRate.end_date);
            
            // Check if dates overlap
            if (requestStartDate <= peakEndDate && requestEndDate >= peakStartDate) {
              // Apply rate adjustment
              const basePrice = Number(room.base_price);
              if (peakRate.value_type === 'PERCENTAGE') {
                const percentValue = Number(peakRate.value) / 100;
                if (peakRate.type === 'INCREASE') {
                  adjusted_price = basePrice + basePrice * percentValue;
                } else if (peakRate.type === 'DECREASE') {
                  adjusted_price = basePrice - basePrice * percentValue;
                }
              } else if (peakRate.value_type === 'NOMINAL') {
                if (peakRate.type === 'INCREASE') {
                  adjusted_price = basePrice + Number(peakRate.value);
                } else if (peakRate.type === 'DECREASE') {
                  adjusted_price = basePrice - Number(peakRate.value);
                }
              }
              
              // Only consider the first applicable peak rate
              break;
            }
          }
        }
        
        return {
          ...room,
          adjusted_price: adjusted_price !== Number(room.base_price) ? adjusted_price : undefined
        };
      });
    }

    return rooms;
  }
}

export default new PropertyService();
