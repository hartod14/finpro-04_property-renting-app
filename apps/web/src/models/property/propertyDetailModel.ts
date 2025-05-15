import { useState, useEffect, useRef } from 'react';
import {
  IProperty,
  IRoom,
  IRoomImage,
  IRoomWithAvailability,
} from '@/interfaces/property.interface';
import { IFacility, IFacilityWithIcon } from '@/interfaces/facility.interface';
import {
  getPropertyBySlug,
  getPropertyBySlugWithFilters,
  getRoomsByPropertySlug,
} from '@/handlers/property';
import { enhanceFacilitiesWithIcons } from '@/utils/facilityIcons';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ICalendarState,
  CalendarRenderProps,
} from '@/interfaces/calendar.interface';

export default function PropertyDetailModel(
  propertySlug: string | string[] | undefined,
  options?: {
    initialStartDate?: string | null;
    initialEndDate?: string | null;
    initialAdults?: string | null;
    initialCapacity?: string | null;
  },
) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [property, setProperty] = useState<IProperty | null>(null);
  const [filteredRooms, setFilteredRooms] = useState<IRoomWithAvailability[]>(
    [],
  );
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

  // Get the capacity from URL parameters, preferring 'capacity' over 'adults'
  const initialCapacity =
    options?.initialCapacity ||
    options?.initialAdults ||
    searchParams.get('capacity') ||
    searchParams.get('adults') ||
    '2';

  const [searchAdults, setSearchAdults] = useState(initialCapacity);

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
        return undefined;
      }
      // For ISO strings, set the time to start of day to avoid timezone issues
      date.setHours(0, 0, 0, 0);
      return date;
    } catch (e) {
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

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: initialStartDate,
    to: initialEndDate,
  });

  // Calendar state and functions
  const getCurrentMonth = (): Date => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  };

  const getNextMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 1);
  };

  const [calendarState, setCalendarState] = useState<ICalendarState>({
    currentMonth: getCurrentMonth(),
    selectedStartDate: dateRange.from ? new Date(dateRange.from) : null,
    selectedEndDate: dateRange.to ? new Date(dateRange.to) : null,
    hoverDate: null,
    showCalendar: false,
  });

  const calendarRef = useRef<HTMLDivElement | null>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        toggleCalendar(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calendar helper functions
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const isMaxMonthReached = (date: Date): boolean => {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear(),
      today.getMonth() + 12,
      today.getDate(),
    );
    return date >= maxDate;
  };

  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const isDateEqual = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return formatDate(new Date(date1)) === formatDate(new Date(date2));
  };

  const isDateInRange = (
    date: Date,
    startDate: Date | null,
    endDate: Date | null,
  ): boolean => {
    if (!startDate || !endDate) return false;
    const d = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return d > start && d < end;
  };

  const isDateBeforeOrEqual = (
    date1: Date | null,
    date2: Date | null,
  ): boolean => {
    if (!date1 || !date2) return false;
    return new Date(date1) <= new Date(date2);
  };

  const isDateInPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date: Date): void => {
    if (isDateInPast(date)) return;

    if (
      !calendarState.selectedStartDate ||
      (calendarState.selectedStartDate && calendarState.selectedEndDate)
    ) {
      setCalendarState((prev) => ({
        ...prev,
        selectedStartDate: date,
        selectedEndDate: null,
      }));
    } else {
      // Get the selected start date and the clicked date
      const startDate = new Date(calendarState.selectedStartDate!);
      const clickedDate = new Date(date);

      // Format to yyyy-mm-dd for proper date comparison (without time)
      const startFormatted = startDate.toISOString().split('T')[0];
      const clickedFormatted = clickedDate.toISOString().split('T')[0];

      // Check if the clicked date is after the start date (not the same day)
      if (clickedFormatted > startFormatted) {
        setCalendarState((prev) => ({
          ...prev,
          selectedEndDate: date,
          showCalendar: false,
        }));
        handleDateRangePickerChange([calendarState.selectedStartDate, date]);
      } else if (clickedFormatted < startFormatted) {
        // If user clicks a date before the start date, make that the new start date
        setCalendarState((prev) => ({
          ...prev,
          selectedStartDate: date,
          selectedEndDate: null,
        }));
      }
      // If they click the same date, do nothing (don't allow same date for check-in and check-out)
    }
  };

  const handleHover = (date: Date): void => {
    // Don't highlight anything if the date is in the past
    if (isDateInPast(date)) return;

    // Don't highlight if it's the same date as the start date
    if (
      calendarState.selectedStartDate &&
      isDateEqual(date, calendarState.selectedStartDate)
    ) {
      return;
    }

    setCalendarState((prev) => ({ ...prev, hoverDate: date }));
  };

  const isDateHighlighted = (date: Date): boolean => {
    if (
      calendarState.selectedStartDate &&
      !calendarState.selectedEndDate &&
      calendarState.hoverDate
    ) {
      // Don't highlight the start date itself
      if (isDateEqual(date, calendarState.selectedStartDate)) {
        return false;
      }

      // Make sure the hover date is after the start date
      if (
        isDateBeforeOrEqual(
          calendarState.selectedStartDate,
          calendarState.hoverDate,
        )
      ) {
        return (
          isDateInRange(
            date,
            calendarState.selectedStartDate,
            calendarState.hoverDate,
          ) || isDateEqual(date, calendarState.hoverDate)
        );
      }
    }
    return false;
  };

  const nextMonth = () => {
    const newMonth = new Date(
      calendarState.currentMonth.getFullYear(),
      calendarState.currentMonth.getMonth() + 1,
      1,
    );
    if (!isMaxMonthReached(newMonth)) {
      setCalendarState((prev) => ({ ...prev, currentMonth: newMonth }));
    }
  };

  const prevMonth = () => {
    const newMonth = new Date(
      calendarState.currentMonth.getFullYear(),
      calendarState.currentMonth.getMonth() - 1,
      1,
    );
    const today = new Date();
    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );

    if (newMonth >= currentMonthStart) {
      setCalendarState((prev) => ({ ...prev, currentMonth: newMonth }));
    }
  };

  const isCurrentMonthTheFirstAvailable = (): boolean => {
    const today = new Date();
    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );
    return (
      calendarState.currentMonth.getFullYear() ===
        currentMonthStart.getFullYear() &&
      calendarState.currentMonth.getMonth() === currentMonthStart.getMonth()
    );
  };

  const isCurrentMonthTheLastAvailable = (): boolean => {
    const nextMonthDate = new Date(
      calendarState.currentMonth.getFullYear(),
      calendarState.currentMonth.getMonth() + 1,
      1,
    );
    return isMaxMonthReached(nextMonthDate);
  };

  const formatDisplayDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const toggleCalendar = (show?: boolean) => {
    setCalendarState((prev) => ({
      ...prev,
      showCalendar: show !== undefined ? show : !prev.showCalendar,
    }));
  };

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      try {
        setLoading(true);

        if (!propertySlug) return;

        let slugValue = '';
        if (typeof propertySlug === 'string') {
          slugValue = propertySlug;
        } else if (Array.isArray(propertySlug) && propertySlug.length > 0) {
          slugValue = propertySlug[0];
        } else {
          throw new Error('Invalid property slug');
        }

        // If we have date range or capacity params, use them to fetch adjusted prices
        let data;
        if (dateRange.from || dateRange.to || searchAdults) {
          const filters: any = {};

          if (dateRange.from) {
            filters.startDate = dateRange.from.toISOString();
          }

          if (dateRange.to) {
            filters.endDate = dateRange.to.toISOString();
          }

          if (searchAdults) {
            filters.capacity = searchAdults;
          }

          data = await getPropertyBySlugWithFilters(slugValue, filters);
        } else {
          // No filters yet, just fetch basic property data
          data = await getPropertyBySlug(slugValue);
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

          // Check for unavailable rooms and calculate rooms left if there are dates selected
          if (dateRange.from && dateRange.to) {
            const unavailableIds: number[] = [];
            data.rooms.forEach((room: any) => {
              const { isAvailable, rooms_left } = checkRoomAvailability(
                room,
                dateRange.from!,
                dateRange.to!,
              );

              // Add rooms_left property to each room
              room.rooms_left = rooms_left;

              if (!isAvailable) {
                unavailableIds.push(room.id);
              }
            });
            setUnavailableRoomIds(unavailableIds);
          }

          // Filter rooms based on initial capacity
          const capacityNumber = searchAdults ? parseInt(searchAdults, 10) : 0;

          let initialFilteredRooms = [...data.rooms];

          // Apply capacity filter if a value is set
          if (capacityNumber > 0) {
            initialFilteredRooms = initialFilteredRooms.filter(
              (room: any) => room.capacity >= capacityNumber,
            );
          }

          // Set filtered rooms with availability status
          const roomsWithAvailability = initialFilteredRooms.map(
            (room: any) => {
              // Default availability if no dates are selected
              let isAvailable = true;
              let rooms_left = room.total_room;

              // Check availability and rooms left if dates are selected
              if (dateRange.from && dateRange.to) {
                const result = checkRoomAvailability(
                  room,
                  dateRange.from,
                  dateRange.to,
                );
                isAvailable = result.isAvailable;
                rooms_left = result.rooms_left;
              }

              return {
                ...room,
                isAvailable,
                rooms_left,
              };
            },
          );

          // Sort rooms by availability (available rooms first)
          const sortedRooms = [...roomsWithAvailability].sort((a, b) => {
            if (a.isAvailable && !b.isAvailable) return -1;
            if (!a.isAvailable && b.isAvailable) return 1;
            return 0;
          });

          setFilteredRooms(sortedRooms);
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

  // Fix date availability logic by adjusting for the 1-day offset
  const checkRoomAvailability = (
    room: any,
    startDate: Date,
    endDate: Date,
  ): { isAvailable: boolean; rooms_left: number } => {
    // Format date to YYYY-MM-DD format, ignoring time completely
    const formatDateString = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Get the user-selected date range as strings
    const requestStartStr = formatDateString(startDate);
    const requestEndStr = formatDateString(endDate);

    // Check unavailable dates first
    if (
      room.roomHasUnavailableDates &&
      Array.isArray(room.roomHasUnavailableDates) &&
      room.roomHasUnavailableDates.length > 0
    ) {
      // Check each unavailable date range
      for (const unavailable of room.roomHasUnavailableDates) {
        if (!unavailable.roomUnavailableDate) continue;

        // Get the unavailable date range from the database as Date objects
        const unavailableStartRaw = new Date(
          unavailable.roomUnavailableDate.start_date,
        );
        const unavailableEndRaw = new Date(
          unavailable.roomUnavailableDate.end_date,
        );

        // Convert to YYYY-MM-DD format strings
        const unavailableStartStr = formatDateString(unavailableStartRaw);
        const unavailableEndStr = formatDateString(unavailableEndRaw);

        // A booking doesn't overlap with unavailable dates if:
        // 1. Booking checkout is strictly before unavailable start date, OR
        // 2. Booking checkin is strictly after unavailable end date
        const noOverlap =
          requestEndStr < unavailableStartStr ||
          requestStartStr > unavailableEndStr;

        // If there is an overlap, the room is completely unavailable
        if (!noOverlap) {
          return { isAvailable: false, rooms_left: 0 };
        }
      }
    }

    // Check bookings with status "DONE" to calculate rooms left
    let rooms_left = room.total_room;

    if (
      room.bookings &&
      Array.isArray(room.bookings) &&
      room.bookings.length > 0
    ) {
      // Create a map to store booked room count for each date
      const dateBookingMap: Record<string, number> = {};

      // Get all dates between start and end date
      const getDatesInRange = (start: Date, end: Date): string[] => {
        const dates: string[] = [];
        const currentDate = new Date(start);

        // Exclude the checkout date from the range
        const endDateExclusive = new Date(end);
        endDateExclusive.setDate(endDateExclusive.getDate() - 1);

        while (currentDate <= endDateExclusive) {
          dates.push(formatDateString(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
      };

      // Calculate all dates in request range (excluding checkout date)
      const requestDates = getDatesInRange(startDate, endDate);

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
      rooms_left = room.total_room - maxBookings;
    }

    return {
      isAvailable: rooms_left > 0,
      rooms_left: rooms_left,
    };
  };

  // Update the room availability when date range changes or when property loads
  useEffect(() => {
    if (property && property.rooms && dateRange.from && dateRange.to) {
      const unavailableIds: number[] = [];

      property.rooms.forEach((room: any) => {
        const { isAvailable } = checkRoomAvailability(
          room,
          dateRange.from!,
          dateRange.to!,
        );
        if (!isAvailable) {
          unavailableIds.push(room.id);
        }
      });

      setUnavailableRoomIds(unavailableIds);
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

  const handleAdultsChange = (value: string) => {
    // Just update the state without filtering
    setSearchAdults(value);
  };

  const handleSearch = () => {
    // Perform a new API request with filtered parameters
    const fetchFilteredProperty = async () => {
      try {
        setFiltering(true);

        let slugValue: string;
        if (typeof propertySlug == 'string') {
          slugValue = propertySlug;
        } else if (Array.isArray(propertySlug) && propertySlug.length > 0) {
          slugValue = propertySlug[0];
        } else {
          throw new Error('Invalid property slug');
        }

        // Get the current property if not already loaded
        let currentProperty = property;
        if (!currentProperty) {
          currentProperty = await getPropertyBySlug(slugValue);
          if (!currentProperty) {
            throw new Error('Failed to load property');
          }
          setProperty(currentProperty);
        }

        // Prepare filter parameters including dates
        const filters: any = {};

        // Add capacity filter if available
        const capacityNumber = searchAdults ? parseInt(searchAdults, 10) : 0;
        if (capacityNumber > 0) {
          filters.capacity = capacityNumber;
        }

        // Add date filters if available to calculate adjusted prices
        if (dateRange.from) {
          filters.startDate = dateRange.from.toISOString();
        }

        if (dateRange.to) {
          filters.endDate = dateRange.to.toISOString();
        }

        // Use getPropertyBySlugWithFilters to get the property with adjusted room prices
        if (Object.keys(filters).length > 0) {
          const filteredProperty = await getPropertyBySlugWithFilters(
            slugValue,
            filters,
          );

          if (filteredProperty) {
            // Set availability status for rooms
            const roomsWithAvailability = (filteredProperty.rooms || []).map(
              (room: any) => {
                // Make sure room images are properly mapped
                if (room.roomImages && !room.images) {
                  room.images = room.roomImages;
                }

                // Check availability and rooms left if dates are selected
                let isAvailable = true;
                let rooms_left = room.total_room;

                if (dateRange.from && dateRange.to) {
                  const result = checkRoomAvailability(
                    room,
                    dateRange.from,
                    dateRange.to,
                  );
                  isAvailable = result.isAvailable;
                  rooms_left = result.rooms_left;
                }

                return {
                  ...room,
                  isAvailable,
                  rooms_left,
                };
              },
            );

            // Sort rooms by availability (available rooms first)
            const sortedRooms = [...roomsWithAvailability].sort((a, b) => {
              if (a.isAvailable && !b.isAvailable) return -1;
              if (!a.isAvailable && b.isAvailable) return 1;
              return 0;
            });

            setFilteredRooms(sortedRooms);

            // Update room photos state
            if (roomsWithAvailability.length > 0) {
              const initialActivePhotos = roomsWithAvailability.reduce(
                (acc: Record<number, number>, room: any) => {
                  acc[room.id] = 0;
                  return acc;
                },
                {},
              );
              setActiveRoomPhoto(initialActivePhotos);
            }

            // Update the property with the filtered one
            setProperty(filteredProperty);
          }
        } else {
          // No filters applied, show all rooms from the current property
          const roomsWithAvailability = (currentProperty.rooms || []).map(
            (room: any) => {
              // Check availability and rooms left if dates are selected
              let isAvailable = true;
              let rooms_left = room.total_room;

              if (dateRange.from && dateRange.to) {
                const result = checkRoomAvailability(
                  room,
                  dateRange.from,
                  dateRange.to,
                );
                isAvailable = result.isAvailable;
                rooms_left = result.rooms_left;
              }

              return {
                ...room,
                isAvailable,
                rooms_left,
              };
            },
          );

          // Sort rooms by availability (available rooms first)
          const sortedRooms = [...roomsWithAvailability].sort((a, b) => {
            if (a.isAvailable && !b.isAvailable) return -1;
            if (!a.isAvailable && b.isAvailable) return 1;
            return 0;
          });

          setFilteredRooms(sortedRooms);
        }
      } catch (err) {
        setError('Failed to load filtered property data. Please try again.');
        setFilteredRooms([]);
      } finally {
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
    } else {
      // Remove the parameter if it doesn't exist
      params.delete('startDate');
    }

    if (dateRange.to) {
      // Set to start of day in ISO format to avoid timezone issues
      const endDate = new Date(dateRange.to);
      endDate.setHours(0, 0, 0, 0);
      params.set('endDate', endDate.toISOString());
    } else {
      // Remove the parameter if it doesn't exist
      params.delete('endDate');
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
      scroll: false,
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
  }, [showPhotoModal, showRoomPhotoModal]);

  // Room utility functions
  const getRoomImages = (room: any) => {
    // Handle different property names
    return room.roomImages || room.images || [];
  };

  const getRoomFirstImage = (room: any, index = 0) => {
    const images = getRoomImages(room);
    return images.length > index ? images[index] : null;
  };

  const isRoomAvailable = (roomId: number): boolean => {
    return !unavailableRoomIds.includes(roomId);
  };

  // Calendar rendering functions - these return rendering props that the UI can use
  const getMonthCalendarProps = (monthDate: Date) => {
    return {
      monthDate,
      selectedStartDate: calendarState.selectedStartDate,
      selectedEndDate: calendarState.selectedEndDate,
      hoverDate: calendarState.hoverDate,
      handleDateClick,
      handleHover,
      isDateEqual,
      isDateInRange,
      isDateHighlighted,
      isDateInPast,
      getDaysInMonth,
      getFirstDayOfMonth,
    };
  };

  const getCalendarProps = () => {
    return {
      currentMonth: calendarState.currentMonth,
      nextMonth: getNextMonth(calendarState.currentMonth),
      isCurrentMonthTheFirstAvailable: isCurrentMonthTheFirstAvailable(),
      isCurrentMonthTheLastAvailable: isCurrentMonthTheLastAvailable(),
      handlePrevMonth: prevMonth,
      handleNextMonth: nextMonth,
      getMonthCalendarProps,
    };
  };

  // Get the lowest price among all rooms for a specific date, formatted to show in thousands
  const getLowestRoomPriceForDate = (date: Date): string => {
    if (!property || !property.rooms || property.rooms.length === 0) {
      return '---';
    }

    // Calculate adjusted price for each room based on the date
    const roomPrices = property.rooms.map((room) => {
      let roomPrice = Number(room.base_price);

      // Check if room has peak season rates
      if (
        room.roomHasPeakSeasonRates &&
        room.roomHasPeakSeasonRates.length > 0
      ) {
        for (const peakRateRelation of room.roomHasPeakSeasonRates) {
          const peakRate = peakRateRelation.peakSeasonRate;
          const peakStartDate = new Date(peakRate.start_date);
          const peakEndDate = new Date(peakRate.end_date);

          // Reset time part for proper comparison
          const dateToCheck = new Date(date);
          dateToCheck.setHours(0, 0, 0, 0);
          
          // Reset time parts for peak dates too
          peakStartDate.setHours(0, 0, 0, 0);
          peakEndDate.setHours(0, 0, 0, 0);

          // Check if date is within peak season period
          if (dateToCheck >= peakStartDate && dateToCheck <= peakEndDate) {
            // Apply rate adjustment
            if (peakRate.value_type === 'PERCENTAGE') {
              const percentValue = Number(peakRate.value) / 100;
              if (peakRate.type === 'INCREASE') {
                roomPrice += roomPrice * percentValue;
              } else if (peakRate.type === 'DECREASE') {
                roomPrice -= roomPrice * percentValue;
              }
            } else if (peakRate.value_type === 'NOMINAL') {
              if (peakRate.type === 'INCREASE') {
                roomPrice += Number(peakRate.value);
              } else if (peakRate.type === 'DECREASE') {
                roomPrice -= Number(peakRate.value);
              }
            }
            break; // Only apply first applicable rate
          }
        }
      }

      return roomPrice;
    });

    // Find the lowest price among all adjusted room prices
    const lowestPrice = Math.min(...roomPrices);

    // Format to show price in thousands with commas
    // 200,000 -> "200"
    // 1,000,000 -> "1,000"
    // 12,000,000 -> "12,000"
    const priceInThousands = Math.floor(lowestPrice / 1000);
    return priceInThousands.toLocaleString('en-US');
  };

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
    handleAdultsChange,
    searchAdults,
    handleSearch,
    dateRange,
    handleDateRangePickerChange,
    handleKeyboardNavigation,
    calendarState,
    calendarRef,
    toggleCalendar,
    getDaysInMonth,
    getFirstDayOfMonth,
    handleDateClick,
    handleHover,
    isDateHighlighted,
    isDateEqual,
    isDateInRange,
    isDateInPast,
    nextMonth,
    prevMonth,
    isCurrentMonthTheFirstAvailable,
    isCurrentMonthTheLastAvailable,
    formatDisplayDate,
    getNextMonth,
    getCalendarProps,
    getRoomImages,
    getRoomFirstImage,
    isRoomAvailable,
    getLowestRoomPriceForDate,
  };
}
