import { prisma } from '../config';
import { Request } from 'express';
import { pagination } from '../helpers/pagination';
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
            bookings: {
              where: {
                status: 'DONE',
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
        reviews: true,
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

      // Get all dates in the range excluding checkout date
      const getDatesInRange = (start: Date, end: Date): string[] => {
        const dates: string[] = [];
        const currentDate = new Date(start);

        // End date is exclusive (checkout date)
        const endDateExclusive = new Date(end);

        while (currentDate < endDateExclusive) {
          dates.push(normalizeDate(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
      };

      filteredProperties = filteredProperties.map((property) => {
        // Filter out unavailable rooms (from unavailable dates or fully booked)
        const availableRooms = property.rooms.filter((room) => {
          // First check unavailable dates
          const hasUnavailableDates = room.roomHasUnavailableDates.some(
            (unavailable) => {
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
              if (
                requestEndStr >= roomStartStr &&
                requestEndStr <= roomEndStr
              ) {
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
            },
          );

          // If room has unavailable dates during the requested period, exclude it
          if (hasUnavailableDates) {
            return false;
          }

          // Now check bookings to calculate available rooms
          if (room.bookings && room.bookings.length > 0) {
            // Create a map to store booked room count for each date
            const dateBookingMap: Record<string, number> = {};

            // Calculate all dates in request range (excluding checkout date)
            const requestDates = getDatesInRange(
              requestStartDate,
              requestEndDate,
            );

            // Initialize booking count for each date
            requestDates.forEach((date) => {
              dateBookingMap[date] = 0;
            });

            // Count bookings for each date in the requested range
            for (const booking of room.bookings) {
              // Only consider DONE bookings
              if (booking.status !== 'DONE') continue;

              const bookingStart = new Date(booking.checkin_date);
              const bookingEnd = new Date(booking.checkout_date);
              const bookingDates = getDatesInRange(bookingStart, bookingEnd);

              // Increase booking count for each date that overlaps with the request
              bookingDates.forEach((date) => {
                if (requestDates.includes(date)) {
                  dateBookingMap[date] = (dateBookingMap[date] || 0) + 1;
                }
              });
            }

            // Find the maximum number of bookings on any single day
            const maxBookings = Math.max(...Object.values(dateBookingMap), 0);

            // Calculate rooms left
            const roomsLeft = room.total_room - maxBookings;

            // Include the room only if there are rooms left
            return roomsLeft > 0;
          }

          // If no bookings or no unavailable dates, room is available
          return true;
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
              if (
                requestStartDate <= rateEndDate &&
                requestEndDate >= rateStartDate
              ) {
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

        const propertyALowestPrice =
          getLowestPriceRoom(aRooms)?.price || Number.MAX_SAFE_INTEGER;
        const propertyBLowestPrice =
          getLowestPriceRoom(bRooms)?.price || Number.MAX_SAFE_INTEGER;

        return sortOrder === 'asc'
          ? propertyALowestPrice - propertyBLowestPrice
          : propertyBLowestPrice - propertyALowestPrice;
      });
    }

    const formattedProperties = filteredProperties.map((property) => {
      // First calculate adjusted prices for all rooms
      const roomsWithCalculatedPrices = property.rooms.map((room) => {
        let calculatedPrice = Number(room.base_price);
        let roomsLeft = room.total_room;

        // Calculate room availability if dates are provided
        if (startDate && endDate && room.bookings && room.bookings.length > 0) {
          const requestStartDate = new Date(String(startDate));
          const requestEndDate = new Date(String(endDate));

          // Reuse the normalizeDate function from above
          const normalizeDate = (date: Date): string => {
            return date.toISOString().split('T')[0];
          };

          // Reuse the getDatesInRange function logic
          const getDatesInRange = (start: Date, end: Date): string[] => {
            const dates: string[] = [];
            const currentDate = new Date(start);

            // End date is exclusive (checkout date)
            const endDateExclusive = new Date(end);

            while (currentDate < endDateExclusive) {
              dates.push(normalizeDate(currentDate));
              currentDate.setDate(currentDate.getDate() + 1);
            }
            return dates;
          };

          // Calculate all dates in request range (excluding checkout date)
          const requestDates = getDatesInRange(
            requestStartDate,
            requestEndDate,
          );

          // Create a map to store booked room count for each date
          const dateBookingMap: Record<string, number> = {};

          // Initialize booking count for each date
          requestDates.forEach((date: string) => {
            dateBookingMap[date] = 0;
          });

          // Count bookings for each date in the requested range
          for (const booking of room.bookings) {
            // Only consider DONE bookings
            if (booking.status !== 'DONE') continue;

            const bookingStart = new Date(booking.checkin_date);
            const bookingEnd = new Date(booking.checkout_date);
            const bookingDates = getDatesInRange(bookingStart, bookingEnd);

            // Increase booking count for each date that overlaps with the request
            bookingDates.forEach((date: string) => {
              if (requestDates.includes(date)) {
                dateBookingMap[date] = (dateBookingMap[date] || 0) + 1;
              }
            });
          }

          // Find the maximum number of bookings on any single day
          const maxBookings = Math.max(...Object.values(dateBookingMap), 0);

          // Calculate rooms left
          roomsLeft = room.total_room - maxBookings;
        }

        // Calculate adjusted price if dates are provided
        if (
          startDate &&
          endDate &&
          room.roomHasPeakSeasonRates &&
          room.roomHasPeakSeasonRates.length > 0
        ) {
          const requestStartDate = new Date(String(startDate));
          const requestEndDate = new Date(String(endDate));

          for (const peakRateRelation of room.roomHasPeakSeasonRates) {
            const peakRate = peakRateRelation.peakSeasonRate;
            const peakStartDate = new Date(peakRate.start_date);
            const peakEndDate = new Date(peakRate.end_date);

            // Check if dates overlap
            if (
              requestStartDate <= peakEndDate &&
              requestEndDate >= peakStartDate
            ) {
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
          calculatedPrice,
          roomsLeft,
        };
      });

      // Filter for capacity
      let eligibleRooms = roomsWithCalculatedPrices;
      if (capacity) {
        const requiredCapacity = Number(capacity);
        eligibleRooms = roomsWithCalculatedPrices.filter(
          (room) => room.capacity >= requiredCapacity,
        );
      }

      // Sort by calculated price to find true lowest price
      eligibleRooms.sort((a, b) => a.calculatedPrice - b.calculatedPrice);

      // Get the lowest price room after adjustments
      const lowestPriceRoom =
        eligibleRooms.length > 0 ? eligibleRooms[0] : null;

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
              rooms_left: lowestPriceRoom.roomsLeft,
              facilities: lowestPriceRoom.roomHasFacilities.map(
                (rf) => rf.facility,
              ),
              images: lowestPriceRoom.roomImages,
              peak_season_rates: lowestPriceRoom.roomHasPeakSeasonRates.map(
                (rr) => rr.peakSeasonRate,
              ),
            }
          : null,
        reviews: property.reviews,
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
        reviews: true,
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
            bookings: {
              where: {
                status: 'DONE', // Only include confirmed bookings
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
        reviews: true,
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
        roomHasUnavailableDates: room.roomHasUnavailableDates,
        roomHasPeakSeasonRates: room.roomHasPeakSeasonRates,
        bookings: room.bookings,
      })),
      reviews: property.reviews,
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
        reviews: true,
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
        reviews: property.reviews,
      };
    });

    return formattedProperties;
  }

  async getRoomsByPropertySlug(slug: string, req: Request) {
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
        bookings: {
          where: {
            status: 'DONE', // Only include confirmed bookings
          },
        },
      },
    });

    // If we have date parameters, calculate adjusted prices based on peak season rates
    if (startDate && endDate) {
      const requestStartDate = new Date(String(startDate));
      const requestEndDate = new Date(String(endDate));

      return rooms.map((room) => {
        let adjusted_price = Number(room.base_price);

        // Check if room has peak season rates that overlap with the requested dates
        if (
          room.roomHasPeakSeasonRates &&
          room.roomHasPeakSeasonRates.length > 0
        ) {
          for (const peakRateRelation of room.roomHasPeakSeasonRates) {
            const peakRate = peakRateRelation.peakSeasonRate;
            const peakStartDate = new Date(peakRate.start_date);
            const peakEndDate = new Date(peakRate.end_date);

            // Check if dates overlap
            if (
              requestStartDate <= peakEndDate &&
              requestEndDate >= peakStartDate
            ) {
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
          adjusted_price:
            adjusted_price !== Number(room.base_price)
              ? adjusted_price
              : undefined,
        };
      });
    }

    return rooms;
  }
}

export default new PropertyService();
