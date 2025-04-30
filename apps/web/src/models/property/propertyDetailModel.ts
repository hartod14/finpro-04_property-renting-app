import { useState, useEffect } from 'react';
import { IProperty, IRoom, IRoomImage } from '@/interfaces/property.interface';
import { IFacility } from '@/interfaces/facility.interface';
import { getPropertyById } from '@/handlers/property';
import { enhanceFacilitiesWithIcons } from '@/utils/facilityIcons';
import React from 'react';
import { useSearchParams } from 'next/navigation';

// Type for enhanced facility with React icon node
export interface IFacilityWithIcon extends Omit<IFacility, 'icon'> {
  icon: React.ReactNode;
  id: number;
  name: string;
  type?: 'PROPERTY' | 'ROOM';
}

export default function PropertyDetailModel(
  propertyId: string | number | string[] | undefined,
) {
  const searchParams = useSearchParams();

  const [property, setProperty] = useState<IProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeRoomPhoto, setActiveRoomPhoto] = useState<
    Record<number, number>
  >({});

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showRoomPhotoModal, setShowRoomPhotoModal] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);

  const [searchDate, setSearchDate] = useState('');
  const [searchAdults, setSearchAdults] = useState(
    searchParams.get('capacity') || '2',
  );

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

        let idValue: string | number;
        if (typeof propertyId == 'string' || typeof propertyId == 'number') {
          idValue = propertyId;
        } else if (Array.isArray(propertyId) && propertyId.length > 0) {
          idValue = propertyId[0];
        } else {
          throw new Error('Invalid property ID');
        }

        const data = await getPropertyById(Number(idValue));

        // Ensure each room has its facilities properly set
        if (data && data.rooms) {
          data.rooms = data.rooms.map((room: IRoom) => {
            // If room doesn't have facilities initialized, set it to an empty array
            if (!room.facilities) {
              room.facilities = [];
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
        }
      } catch (err) {
        setError('Failed to load property details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyDetail();
    }
  }, [propertyId]);

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
    setSearchAdults(value);
  };

  const handleSearch = () => {
    fetchProperties();
  };

  const handleDateRangePickerChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    handleDateRangeChange({
      from: start || undefined,
      to: end || undefined,
    });
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const checkInDate = searchParams.get('checkInDate')
    ? new Date(searchParams.get('checkInDate') as string)
    : today;

  const checkOutDate = searchParams.get('checkOutDate')
    ? new Date(searchParams.get('checkOutDate') as string)
    : tomorrow;

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: checkInDate,
    to: checkOutDate,
  });

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
      if (room && room.images) {
        setActivePhotoIndex((prevIndex) =>
          prevIndex === room.images.length - 1 ? 0 : prevIndex + 1,
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
      if (room && room.images) {
        setActivePhotoIndex((prevIndex) =>
          prevIndex === 0 ? room.images.length - 1 : prevIndex - 1,
        );
      }
    }
  };

  const getCurrentRoomPhotos = (): IRoomImage[] => {
    if (!property || !activeRoomId || !property.rooms) return [];
    const room = property.rooms.find((r) => r.id === activeRoomId);
    return room?.images || [];
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
    error,
    activeRoomPhoto,
    showPhotoModal,
    showRoomPhotoModal,
    activePhotoIndex,
    activeRoomId,

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
