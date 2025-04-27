import { prisma } from '@/config';
import { Request } from 'express';

class PropertyService {
    async getAllData(req: Request) {
        const { 
            categoryID, tenantID, facilityID, cityID, 
            sortBy = 'name', sortOrder = 'asc',
            minPrice, maxPrice, capacity, searchTerm
        } = req.query;
        
        // Log query parameters for debugging
        console.log('Property service - query parameters:');
        console.log('sortBy:', sortBy);
        console.log('sortOrder:', sortOrder);
        console.log('capacity:', capacity);
        
        // Prepare filter conditions
        const filters: any = {
            deleted_at: null,
        };

        // Handle multiple category IDs (comma-separated)
        if (categoryID) {
            const categoryIds = String(categoryID).split(',').map(Number);
            filters.category_id = { in: categoryIds };
        }

        // Handle multiple tenant IDs (comma-separated)
        if (tenantID) {
            const tenantIds = String(tenantID).split(',').map(Number);
            filters.tenant_id = { in: tenantIds };
        }

        // Handle multiple city IDs (comma-separated)
        if (cityID) {
            const cityIds = String(cityID).split(',').map(Number);
            filters.city_id = { in: cityIds };
        }
        
        // Get properties with their rooms, facilities, and images
        const properties = await prisma.property.findMany({
            where: filters,
            include: {
                rooms: {
                    where: {
                        deleted_at: null
                    },
                    orderBy: {
                        base_price: 'asc'
                    },
                    include: {
                        roomHasFacilities: {
                            include: {
                                facility: true
                            }
                        },
                        RoomImage: true
                    }
                },
                propertyHasFacilities: {
                    include: {
                        facility: true
                    }
                },
                category: true,
                city: true,
                tenant: true,
                propertyImages: true
            }
        });

        // Filter by facility if needed
        let filteredProperties = properties;
        if (facilityID) {
            const facilityIds = String(facilityID).split(',').map(Number);
            
            filteredProperties = properties.filter(property => {
                return property.propertyHasFacilities.some(pf => 
                    facilityIds.includes(pf.facility_id)
                );
            });
        }

        // Filter by price range if specified
        if (minPrice || maxPrice) {
            filteredProperties = filteredProperties.filter(property => {
                // Check if the property has any rooms within the price range
                if (property.rooms.length === 0) return false;
                
                const lowestPrice = Number(property.rooms[0].base_price);
                const minPriceValue = minPrice ? Number(minPrice) : 0;
                const maxPriceValue = maxPrice ? Number(maxPrice) : Number.MAX_SAFE_INTEGER;
                
                return lowestPrice >= minPriceValue && lowestPrice <= maxPriceValue;
            });
        }
        
        // Filter by capacity if specified
        if (capacity) {
            const requiredCapacity = Number(capacity);
            filteredProperties = filteredProperties.filter(property => {
                // Check if any room in the property has sufficient capacity
                return property.rooms.some(room => 
                    room.capacity >= requiredCapacity
                );
            });
        }
        
        // Filter by search term if specified
        if (searchTerm) {
            const term = String(searchTerm).toLowerCase();
            filteredProperties = filteredProperties.filter(property => {
                return (
                    property.name.toLowerCase().includes(term) ||
                    (property.address && property.address.toLowerCase().includes(term)) ||
                    property.city.name.toLowerCase().includes(term)
                );
            });
        }

        // Sort properties
        const normalizedSortBy = String(sortBy).toLowerCase();
        const normalizedSortOrder = String(sortOrder).toLowerCase();
        
        console.log('Normalized sort parameters:', normalizedSortBy, normalizedSortOrder);
        
        if (normalizedSortBy === 'name') {
            console.log('Sorting by name:', normalizedSortOrder);
            filteredProperties.sort((a, b) => {
                // Use more robust string comparison with case insensitivity
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                
                return normalizedSortOrder === 'asc'
                    ? nameA.localeCompare(nameB)
                    : nameB.localeCompare(nameA);
            });
        } else if (normalizedSortBy === 'price') {
            console.log('Sorting by price:', normalizedSortOrder);
            filteredProperties.sort((a, b) => {
                const aPrice = a.rooms.length > 0 ? Number(a.rooms[0].base_price) : Number.MAX_SAFE_INTEGER;
                const bPrice = b.rooms.length > 0 ? Number(b.rooms[0].base_price) : Number.MAX_SAFE_INTEGER;
                
                return normalizedSortOrder === 'asc' ? aPrice - bPrice : bPrice - aPrice;
            });
        }

        // Transform response to include only the room with lowest price
        const formattedProperties = filteredProperties.map(property => {
            // If capacity filter is applied, find the lowest priced room that meets the capacity requirement
            let lowestPriceRoom = null;
            
            if (capacity) {
                const requiredCapacity = Number(capacity);
                const roomsWithSufficientCapacity = property.rooms.filter(room => 
                    room.capacity >= requiredCapacity
                );
                
                if (roomsWithSufficientCapacity.length > 0) {
                    // Sort by price and get the lowest price room with sufficient capacity
                    roomsWithSufficientCapacity.sort((a, b) => 
                        Number(a.base_price) - Number(b.base_price)
                    );
                    lowestPriceRoom = roomsWithSufficientCapacity[0];
                }
            } else {
                // No capacity filter, just get the lowest price room
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
                    email: property.tenant.email
                },
                facilities: property.propertyHasFacilities.map(pf => pf.facility),
                images: property.propertyImages,
                lowestPriceRoom: lowestPriceRoom ? {
                    id: lowestPriceRoom.id,
                    name: lowestPriceRoom.name,
                    base_price: lowestPriceRoom.base_price,
                    capacity: lowestPriceRoom.capacity,
                    size: lowestPriceRoom.size,
                    total_room: lowestPriceRoom.total_room,
                    facilities: lowestPriceRoom.roomHasFacilities.map(rf => rf.facility),
                    images: lowestPriceRoom.RoomImage
                } : null
            };
        });

        return formattedProperties;
    }
}

export default new PropertyService();   
