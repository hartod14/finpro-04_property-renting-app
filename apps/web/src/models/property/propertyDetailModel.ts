import { useState, useEffect } from 'react';
import { IProperty, IRoom, IRoomImage } from '@/interfaces/property.interface';
import { IFacility } from '@/interfaces/facility.interface';
import { getPropertyById, getPropertyBySlug, getPropertyBySlugWithFilters } from '@/handlers/property';
import { enhanceFacilitiesWithIcons } from '@/utils/facilityIcons';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Type for enhanced facility with React icon node
export interface IFacilityWithIcon extends Omit<IFacility, 'icon'> {
  icon: React.ReactNode;
  id: number;
  name: string;
  type?: 'PROPERTY' | 'ROOM';
}

// Extend IRoom to include availability status
export interface IRoomWithAvailability extends IRoom {
  isAvailable: boolean;
}

export default function PropertyDetailModel(
  propertySlug: string | string[] | undefined,
  options?: {
    initialStartDate?: string | null;
    initialEndDate?: string | null;
    initialAdults?: string | null;
    initialCapacity?: string | null;
  }
) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [property, setProperty] = useState<IProperty | null>(null);
  const [filteredRooms, setFilteredRooms] = useState<IRoomWithAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [error, setError] = useState('');
  const [unavailableRoomIds, setUnavailableRoomIds] = useState<number[]>([]);

  const [activeRoomPhoto, setActiveRoomPhoto] = useState<
    Record<number, number>
  >({});

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showRoomPhotoModal, setShowRoomPhotoModal] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);

  const [searchDate, setSearchDate] = useState('');
  const [searchAdults, setSearchAdults] = useState(
    options?.initialAdults || 
    options?.initialCapacity || 
    searchParams.get('adults') || 
    searchParams.get('capacity') || 
    '2'
  );

  // Initialize dateRange
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let initialStartDate = today;
  let initialEndDate = tomorrow;

  // Parse date from string while preserving the original date
  const safeParseDate = (dateString: string | null): Date | undefined => {
    if (!dateString) return undefined;
    
    try {
      // Create a date that preserves the timezone
      const date = new Date(dateString);
      // Check if it's a valid date
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return undefined;
      }
      // For ISO strings, set the time to start of day to avoid timezone issues
      date.setHours(0, 0, 0, 0);
      return date;
    } catch (e) {
      console.error("Error parsing date:", e);
      return undefined;
    }
  };

  // Use provided dates from options if available, with safer date parsing
  if (options?.initialStartDate) {
    const parsedDate = safeParseDate(options.initialStartDate);
    if (parsedDate) initialStartDate = parsedDate;
  } else if (searchParams.get('startDate')) {
    const parsedDate = safeParseDate(searchParams.get('startDate'));
    if (parsedDate) initialStartDate = parsedDate;
  }

  if (options?.initialEndDate) {
    const parsedDate = safeParseDate(options.initialEndDate);
    if (parsedDate) initialEndDate = parsedDate;
  } else if (searchParams.get('endDate')) {
    const parsedDate = safeParseDate(searchParams.get('endDate'));
    if (parsedDate) initialEndDate = parsedDate;
  }

  console.log("Initial date range:", {
    startDate: initialStartDate.toISOString(),
    endDate: initialEndDate.toISOString()
  });

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: initialStartDate,
    to: initialEndDate,
  });

  const fetchProperties = async () => {
    try {
      if (dateRange.from) {
        dateRange.from.toISOString();
      }

      if (dateRange.to) {
        dateRange.to.toISOString();
      }

      if (searchAdults && searchAdults !== '') {
        parseInt(searchAdults);
      }
    } catch (err) {
      setError('Failed to load properties. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      try {
        setLoading(true);

        let slugValue: string;
        if (typeof propertySlug == 'string') {
          slugValue = propertySlug;
        } else if (Array.isArray(propertySlug) && propertySlug.length > 0) {
          slugValue = propertySlug[0];
        } else {
          throw new Error('Invalid property slug');
        }

        // Check if we have filter parameters
        const hasFilters = (
          options?.initialStartDate || 
          options?.initialEndDate || 
          options?.initialAdults || 
          options?.initialCapacity
        );

        let data;
        
        if (hasFilters) {
          // Use the filtered version of the API call
          data = await getPropertyBySlugWithFilters(slugValue, {
            startDate: options?.initialStartDate,
            endDate: options?.initialEndDate,
            capacity: options?.initialCapacity || options?.initialAdults
          });
          
          // Handle no results case
          if (!data) {
            setError('No property found with the selected criteria. Try adjusting your filters.');
            setLoading(false);
            return;
          }
        } else {
          // Use the regular API call
          data = await getPropertyBySlug(slugValue);
        }

        // Ensure each room has its facilities and data properly set
        if (data && data.rooms) {
          // Process the rooms to ensure correct structure
          data.rooms = data.rooms.map((room: any) => {
            // API sometimes returns roomImages but the UI uses room.images
            // Make sure both properties are available for compatibility
            if (room.roomImages && !room.images) {
              room.images = room.roomImages;
            }
            
            // If room doesn't have facilities initialized, set it to an empty array
            if (!room.facilities) {
              room.facilities = [];
            }
            
            // Initialize roomHasUnavailableDates if not present
            if (!room.roomHasUnavailableDates) {
              room.roomHasUnavailableDates = [];
            }
            
            return room;
          });
        }

        setProperty(data);

        if (data && data.rooms) {
          const initialActivePhotos = data.rooms.reduce(
            (acc: Record<number, number>, room: IRoom) => {
              acc[room.id] = 0;
              return acc;
            },
            {},
          );
          setActiveRoomPhoto(initialActivePhotos);
          
          // Check for unavailable rooms if there are dates selected
          if (dateRange.from && dateRange.to) {
            const unavailableIds: number[] = [];
            data.rooms.forEach((room: any) => {
              const isAvailable = checkRoomAvailability(room, dateRange.from!, dateRange.to!);
              if (!isAvailable) {
                unavailableIds.push(room.id);
              }
            });
            console.log('Initial unavailable room IDs:', unavailableIds);
            setUnavailableRoomIds(unavailableIds);
          }
          
          // Set filtered rooms with availability status
          const roomsWithAvailability = data.rooms.map((room: any) => {
            // Default availability if no dates are selected
            let isAvailable = true;
            
            // Check availability if dates are selected
            if (dateRange.from && dateRange.to) {
              isAvailable = checkRoomAvailability(room, dateRange.from, dateRange.to);
            }
            
            return {
              ...room,
              isAvailable
            };
          });
          
          setFilteredRooms(roomsWithAvailability);
        }
      } catch (err) {
        setError('Failed to load property details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (propertySlug) {
      fetchPropertyDetail();
    }
  }, [propertySlug]);

  // Check if a room is available for the selected date range
  const checkRoomAvailability = (room: any, startDate: Date, endDate: Date): boolean => {
    // If the room has no unavailability data, assume it's available
    if (!room.roomHasUnavailableDates || !Array.isArray(room.roomHasUnavailableDates) || room.roomHasUnavailableDates.length === 0) {
      return true;
    }

    // Normalize dates to compare just the date portion
    const normalizeDate = (date: Date): string => {
      return date.toISOString().split('T')[0];
    };

    const requestStartStr = normalizeDate(startDate);
    const requestEndStr = normalizeDate(endDate);

    // Check if there's an overlap with any unavailable dates
    for (const unavailable of room.roomHasUnavailableDates) {
      if (!unavailable.roomUnavailableDate) continue;
      
      const roomStartDate = new Date(unavailable.roomUnavailableDate.start_date);
      const roomEndDate = new Date(unavailable.roomUnavailableDate.end_date);
      
      const roomStartStr = normalizeDate(roomStartDate);
      const roomEndStr = normalizeDate(roomEndDate);
      
      // If start date of request falls on any day in the unavailable range
      if (requestStartStr >= roomStartStr && requestStartStr <= roomEndStr) {
        return false;
      }
      
      // If end date of request falls on any day in the unavailable range
      if (requestEndStr >= roomStartStr && requestEndStr <= roomEndStr) {
        return false;
      }
      
      // If request period completely contains the unavailable period
      if (requestStartStr <= roomStartStr && requestEndStr >= roomEndStr) {
        return false;
      }
    }
    
    return true;
  };

  // Update the room availability when date range changes or when property loads
  useEffect(() => {
    if (property && property.rooms && dateRange.from && dateRange.to) {
      const unavailableIds: number[] = [];
      
      property.rooms.forEach((room: any) => {
        const isAvailable = checkRoomAvailability(room, dateRange.from!, dateRange.to!);
        if (!isAvailable) {
          unavailableIds.push(room.id);
        }
      });
      
      setUnavailableRoomIds(unavailableIds);
      console.log('Unavailable room IDs:', unavailableIds);
    } else {
      // No date range selected, all rooms are available
      setUnavailableRoomIds([]);
    }
  }, [property, dateRange.from, dateRange.to]);

  // Handle keyboard navigation for photo modals
  const handleKeyboardNavigation = () => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showPhotoModal && !showRoomPhotoModal) return;

      if (e.key === 'ArrowRight') {
        goToNextPhoto();
      } else if (e.key === 'ArrowLeft') {
        goToPreviousPhoto();
      } else if (e.key === 'Escape') {
        if (showPhotoModal) closePhotoModal();
        if (showRoomPhotoModal) closeRoomPhotoModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  };

  const handleChangeRoomPhoto = (roomId: number, index: number) => {
    setActiveRoomPhoto((prev) => ({
      ...prev,
      [roomId]: index,
    }));
  };

  const handleDateRangeChange = (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    setDateRange(range);
  };

  const handleDateChange = (value: string) => {
    setSearchDate(value);
  };

  const handleAdultsChange = (value: string) => {
    // Just update the state without filtering
    console.log('Capacity selection changed to:', value, '- waiting for Apply Filter button to filter');
    setSearchAdults(value);
  };

  const handleSearch = () => {
    console.log('Search button clicked - filtering rooms with params:', {
      dates: [dateRange.from?.toISOString(), dateRange.to?.toISOString()],
      capacity: searchAdults
    });
    
    // Perform a new API request with filtered parameters
    const fetchFilteredProperty = async () => {
      try {
        setFiltering(true);
        setLoading(true);
        
        let slugValue: string;
        if (typeof propertySlug == 'string') {
          slugValue = propertySlug;
        } else if (Array.isArray(propertySlug) && propertySlug.length > 0) {
          slugValue = propertySlug[0];
        } else {
          throw new Error('Invalid property slug');
        }
        
        // Format dates for API
        const startDateStr = dateRange.from ? dateRange.from.toISOString() : null;
        const endDateStr = dateRange.to ? dateRange.to.toISOString() : null;
        
        // Use the filtered API endpoint
        const data = await getPropertyBySlugWithFilters(slugValue, {
          startDate: startDateStr,
          endDate: endDateStr,
          capacity: searchAdults
        });
        
        // Set the property with filtered data
        if (data) {
          // Process the rooms to ensure correct structure
          if (data.rooms) {
            data.rooms = data.rooms.map((room: any) => {
              // API sometimes returns roomImages but the UI uses room.images
              if (room.roomImages && !room.images) {
                room.images = room.roomImages;
              }
              
              // If room doesn't have facilities initialized, set it to an empty array
              if (!room.facilities) {
                room.facilities = [];
              }
              
              // Initialize roomHasUnavailableDates if not present
              if (!room.roomHasUnavailableDates) {
                room.roomHasUnavailableDates = [];
              }
              
              return room;
            });
          } else {
            // If no rooms are returned, initialize as empty array
            data.rooms = [];
          }
          
          setProperty(data);
          
          // Update room photos state
          if (data.rooms && data.rooms.length > 0) {
            const initialActivePhotos = data.rooms.reduce(
              (acc: Record<number, number>, room: IRoom) => {
                acc[room.id] = 0;
                return acc;
              },
              {},
            );
            setActiveRoomPhoto(initialActivePhotos);
            
            // Set filtered rooms with availability status
            const roomsWithAvailability = data.rooms.map((room: any) => {
              return {
                ...room,
                isAvailable: true // All returned rooms are available (filtered by server)
              };
            });
            
            setFilteredRooms(roomsWithAvailability);
          } else {
            // No rooms available
            setFilteredRooms([]);
          }
        } else {
          // Handle case where no property data is returned
          setError('No property found matching the selected criteria.');
          setFilteredRooms([]);
        }
      } catch (err) {
        setError('Failed to load filtered property data. Please try again.');
      } finally {
        setLoading(false);
        setFiltering(false);
      }
    };
    
    fetchFilteredProperty();
    
    // Update URL query params
    updateUrlWithCurrentFilters();
  };

  // Update URL with the current filter values in consistent format
  const updateUrlWithCurrentFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Add current filter values - maintain both adults and capacity for compatibility
    params.set('adults', searchAdults);
    params.set('capacity', searchAdults); // Set both parameters to the same value
    
    // Add date parameters in ISO string format
    if (dateRange.from) {
      // Set to start of day in ISO format to avoid timezone issues
      const startDate = new Date(dateRange.from);
      startDate.setHours(0, 0, 0, 0);
      params.set('startDate', startDate.toISOString());
    }
    
    if (dateRange.to) {
      // Set to start of day in ISO format to avoid timezone issues
      const endDate = new Date(dateRange.to);
      endDate.setHours(0, 0, 0, 0);
      params.set('endDate', endDate.toISOString());
    }
    
    // Construct the slug path
    let slugPath = '';
    if (typeof propertySlug === 'string') {
      slugPath = propertySlug;
    } else if (Array.isArray(propertySlug) && propertySlug.length > 0) {
      slugPath = propertySlug[0];
    }
    
    // Update the URL without triggering navigation
    router.replace(`/property/${slugPath}?${params.toString()}`, {
      scroll: false
    });
  };

  const handleDateRangePickerChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    handleDateRangeChange({
      from: start || undefined,
      to: end || undefined,
    });
    
    // Don't update URL here - we'll only do that when Apply Filter is clicked
  };

  // Property photo modal controls
  const openPhotoModal = (index: number) => {
    setActivePhotoIndex(index);
    setShowPhotoModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closePhotoModal = () => {
    setShowPhotoModal(false);
    document.body.style.overflow = 'auto';
  };

  const openRoomPhotoModal = (roomId: number, index: number) => {
    setActiveRoomId(roomId);
    setActivePhotoIndex(index);
    setShowRoomPhotoModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeRoomPhotoModal = () => {
    setShowRoomPhotoModal(false);
    setActiveRoomId(null);
    document.body.style.overflow = 'auto';
  };

  const goToNextPhoto = () => {
    if (!property) return;

    if (showPhotoModal && property.images) {
      setActivePhotoIndex((prevIndex) =>
        prevIndex === property.images.length - 1 ? 0 : prevIndex + 1,
      );
    } else if (showRoomPhotoModal && activeRoomId && property.rooms) {
      const room = property.rooms.find((r) => r.id === activeRoomId);
      if (room) {
        // Use roomImages or fallback to images if available
        const roomPhotos = room.roomImages || (room as any).images || [];
        setActivePhotoIndex((prevIndex) =>
          prevIndex === roomPhotos.length - 1 ? 0 : prevIndex + 1,
        );
      }
    }
  };

  const goToPreviousPhoto = () => {
    if (!property) return;

    if (showPhotoModal && property.images) {
      setActivePhotoIndex((prevIndex) =>
        prevIndex === 0 ? property.images.length - 1 : prevIndex - 1,
      );
    } else if (showRoomPhotoModal && activeRoomId && property.rooms) {
      const room = property.rooms.find((r) => r.id === activeRoomId);
      if (room) {
        // Use roomImages or fallback to images if available
        const roomPhotos = room.roomImages || (room as any).images || [];
        setActivePhotoIndex((prevIndex) =>
          prevIndex === 0 ? roomPhotos.length - 1 : prevIndex - 1,
        );
      }
    }
  };

  const getCurrentRoomPhotos = (): IRoomImage[] => {
    if (!property || !activeRoomId || !property.rooms) return [];
    const room = property.rooms.find((r) => r.id === activeRoomId);
    if (!room) return [];
    
    // Use both properties for compatibility
    return room.roomImages || (room as any).images || [];
  };

  // Get property facilities with icons
  const getPropertyFacilities = (): IFacilityWithIcon[] => {
    const facilities =
      property?.facilities.filter((f) => f.type === 'PROPERTY') || [];
    return enhanceFacilitiesWithIcons(facilities) as IFacilityWithIcon[];
  };

  // Get room facilities with icons
  const getRoomFacilities = (): IFacilityWithIcon[] => {
    const facilities =
      property?.facilities.filter((f) => f.type === 'ROOM') || [];
    return enhanceFacilitiesWithIcons(facilities) as IFacilityWithIcon[];
  };

  // Set up keyboard navigation effect
  useEffect(() => {
    const cleanup = handleKeyboardNavigation();
    return cleanup;
  }, [
    showPhotoModal,
    showRoomPhotoModal,
  ]);

  return {
    property,
    loading,
    filtering,
    error,
    filteredRooms,
    activeRoomPhoto,
    showPhotoModal,
    showRoomPhotoModal,
    activePhotoIndex,
    activeRoomId,
    unavailableRoomIds,

    propertyFacilities: getPropertyFacilities(),
    roomFacilities: getRoomFacilities(),

    handleChangeRoomPhoto,
    openPhotoModal,
    closePhotoModal,
    openRoomPhotoModal,
    closeRoomPhotoModal,
    goToNextPhoto,
    goToPreviousPhoto,
    getCurrentRoomPhotos,
    handleDateChange,
    handleAdultsChange,
    searchDate,
    searchAdults,
    handleSearch,
    dateRange,
    handleDateRangePickerChange,
    handleKeyboardNavigation,
  };
}
