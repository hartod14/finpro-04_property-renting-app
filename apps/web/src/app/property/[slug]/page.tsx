'use client';

import { useParams } from 'next/navigation';
import Navbar from '@/components/common/navbar/navbar';
import Footer from '@/components/common/footer/footer';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import PropertyDetailModel from '@/models/property/propertyDetailModel';
import PropertyDetailSkeleton from '@/components/property/propertyDetailSkeleton';
import React, { useState, useEffect, useRef } from 'react';
import { getFacilityIconByName } from '@/utils/facilityIcons';
import { formatTimeOnly } from '@/utils/formatters';
import { IReview } from '@/interfaces/property.interface';
import PropertyReviews from '@/components/property/PropertyReviews';
import { toZonedTime } from 'date-fns-tz';

export default function PropertyDetailPage() {
  const { slug } = useParams();
  const {
    property,
    loading,
    error,
    activeRoomPhoto,
    showPhotoModal,
    showRoomPhotoModal,
    activePhotoIndex,
    activeRoomId,
    propertyFacilities,
    roomFacilities,
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
  } = PropertyDetailModel(slug);

  // Calendar state
  const getCurrentMonth = (): Date => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  };

  const getNextMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 1);
  };

  const [currentMonth, setCurrentMonth] = useState<Date>(getCurrentMonth());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    dateRange.from ? new Date(dateRange.from) : null,
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    dateRange.to ? new Date(dateRange.to) : null,
  );
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [reviews, setReviews] = useState<IReview[]>([]);

  

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper functions for calendar
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
    // Set today to midnight for accurate comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date: Date): void => {
    // Prevent selecting past dates
    if (isDateInPast(date)) return;

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Start a new selection
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      // Complete the selection
      if (isDateBeforeOrEqual(selectedStartDate, date)) {
        setSelectedEndDate(date);
        // Update the parent component's date range
        // Pass the dates directly to match the expected format
        handleDateRangePickerChange([selectedStartDate, date]);
        setShowCalendar(false);
      } else {
        setSelectedStartDate(date);
        setSelectedEndDate(null);
      }
    }
  };

  const handleHover = (date: Date): void => {
    setHoverDate(date);
  };

  const isDateHighlighted = (date: Date): boolean => {
    if (selectedStartDate && !selectedEndDate && hoverDate) {
      if (isDateBeforeOrEqual(selectedStartDate, hoverDate)) {
        return (
          isDateInRange(date, selectedStartDate, hoverDate) ||
          isDateEqual(date, hoverDate)
        );
      }
    }
    return false;
  };

  const nextMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1,
    );
    if (!isMaxMonthReached(newMonth)) {
      setCurrentMonth(newMonth);
    }
  };

  const prevMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1,
    );
    const today = new Date();
    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );

    // Don't allow navigating to months before the current month
    if (newMonth >= currentMonthStart) {
      setCurrentMonth(newMonth);
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
      currentMonth.getFullYear() === currentMonthStart.getFullYear() &&
      currentMonth.getMonth() === currentMonthStart.getMonth()
    );
  };

  const isCurrentMonthTheLastAvailable = (): boolean => {
    const nextMonthDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1,
    );
    return isMaxMonthReached(nextMonthDate);
  };

const formatDisplayDate = (date: Date | null) => {
  if (!date) return '';
  const utcDate = toZonedTime(date, 'UTC');
  return utcDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

  const renderMonthCalendar = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isStart = isDateEqual(date, selectedStartDate);
      const isEnd = isDateEqual(date, selectedEndDate);
      const isInRange = isDateInRange(date, selectedStartDate, selectedEndDate);
      const isHovered = isDateHighlighted(date);
      const isPast = isDateInPast(date);
      const isSunday = date.getDay() === 0;

      days.push(
        <div
          key={day}
          className={`h-12 relative cursor-pointer rounded-md ${
            isPast
              ? 'text-gray-300 cursor-not-allowed'
              : isStart || isEnd
                ? 'bg-primary/20'
                : isInRange || isHovered
                  ? 'bg-primary/20'
                  : 'hover:bg-gray-100'
          } ${isSunday && !isPast ? 'text-red-500' : ''}`}
          onClick={() => !isPast && handleDateClick(date)}
          onMouseEnter={() => !isPast && handleHover(date)}
        >
          <div className="text-center">
            <span className="text-center p-1">{day}</span>
          </div>
          <div
            className={`absolute bottom-0 w-full text-center text-xs font-semibold p-1 ${isPast ? 'text-gray-300' : 'text-primary'}`}
          >
            500
          </div>
        </div>,
      );
    }

    return (
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-center mb-4">
          {monthNames[month]} {year}
        </h2>
        <div className="grid grid-cols-7 gap-3">
          {dayNames.map((day, index) => (
            <div
              key={day}
              className={`text-center font-medium text-sm py-2 ${index === 0 ? 'text-red-500' : 'text-gray-500'}`}
            >
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={prevMonth}
            className={`p-2 rounded-full ${isCurrentMonthTheFirstAvailable() ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            disabled={isCurrentMonthTheFirstAvailable()}
          >
            <FaChevronLeft />
          </button>
          <h2 className="text-gray-600 font-semibold">Select Date</h2>
          <button
            onClick={nextMonth}
            className={`p-2 rounded-full ${isCurrentMonthTheLastAvailable() ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            disabled={isCurrentMonthTheLastAvailable()}
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
          {renderMonthCalendar(currentMonth)}
          {renderMonthCalendar(getNextMonth(currentMonth))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <PropertyDetailSkeleton />;
  }

  if (error || !property) {
    return (
      <>
        <Navbar forceScrolled={true} />
        <div className="min-h-screen pt-28 pb-10 bg-[#FDFDFE] flex items-center justify-center">
          <div className="text-red-500 text-center">
            <p className="text-xl font-semibold">
              {error || 'Property not found'}
            </p>
            <Link href="/property">
              <div className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 inline-block">
                Back to properties
              </div>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar forceScrolled={true} />
      <div className="min-h-screen pt-28 pb-10 bg-[#FDFDFE] px-4 lg:px-24 text-black">
        {/* Back to Property Listing Navigation */}
        <div className="mb-4">
          <Link
            href="/property"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <FaArrowLeft className="mr-2" size={14} />
            <span>Back to Property Listing</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
          {property.images && property.images.length > 0 ? (
            <>
              <div
                className="md:col-span-2 relative h-96 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => openPhotoModal(0)}
              >
                <Image
                  src={property.images[0].path}
                  alt={property.name}
                  fill
                  className="object-cover hover:opacity-95 transition-opacity"
                  priority
                />
                <div className="absolute bottom-0 right-0 bg-black/70 text-white px-3 py-1 m-2 rounded-full text-xs">
                  Click to view all photos
                </div>
              </div>

              {/* Desktop view - right side images */}
              <div className="hidden md:grid md:col-span-1 grid-rows-2 gap-2">
                {property.images.length > 1 && (
                  <div
                    className="relative rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => openPhotoModal(1)}
                  >
                    <Image
                      src={property.images[1].path}
                      alt={property.name}
                      fill
                      className="object-cover hover:opacity-95 transition-opacity"
                    />
                  </div>
                )}
                {property.images.length > 2 && (
                  <div
                    className="relative rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => openPhotoModal(2)}
                  >
                    <Image
                      src={property.images[2].path}
                      alt={property.name}
                      fill
                      className="object-cover hover:opacity-95 transition-opacity"
                    />
                    {property.images.length > 3 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl">
                        +{property.images.length - 3} more
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile view - bottom thumbnails */}
              <div className="flex md:hidden mt-2 gap-2 overflow-x-auto">
                {property.images
                  .slice(1)
                  .map((img, index) => (
                    <div
                      key={img.id}
                      className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden cursor-pointer"
                      onClick={() => openPhotoModal(index + 1)}
                    >
                      <Image
                        src={img.path}
                        alt={`Property photo ${index + 2}`}
                        fill
                        className="object-cover hover:opacity-95 transition-opacity"
                      />
                      {index === property.images.slice(1).length - 1 &&
                        property.images.length > 5 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-sm">
                            +{property.images.length - 5} more
                          </div>
                        )}
                    </div>
                  ))
                  .slice(0, 4)}
              </div>
            </>
          ) : (
            <div className="md:col-span-3 h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No photos available</p>
            </div>
          )}
        </div>

        {showPhotoModal && property.images && property.images.length > 0 && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closePhotoModal}
          >
            <button
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-50"
              onClick={(e) => {
                e.stopPropagation();
                closePhotoModal();
              }}
            >
              <FaTimes size={24} />
            </button>

            <div className="absolute top-4 left-4 text-white bg-black/50 px-3 py-1 rounded-full z-50">
              {activePhotoIndex + 1}/{property.images.length}
            </div>

            <button
              className="absolute left-4 md:left-8 p-3 text-white rounded-full bg-black/50 hover:bg-black/70 transition-colors z-50"
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousPhoto();
              }}
            >
              <FaArrowLeft size={24} />
            </button>

            <button
              className="absolute right-4 md:right-8 p-3 text-white rounded-full bg-black/50 hover:bg-black/70 transition-colors z-50"
              onClick={(e) => {
                e.stopPropagation();
                goToNextPhoto();
              }}
            >
              <FaArrowRight size={24} />
            </button>

            <div
              className="relative w-full max-w-5xl h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={property.images[activePhotoIndex].path}
                alt={`${property.name} - Photo ${activePhotoIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>

            <div
              className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {property.images.map((img, index) => (
                <div
                  key={index}
                  className={`relative w-16 h-16 rounded-md overflow-hidden cursor-pointer ${activePhotoIndex === index ? 'ring-2 ring-primary' : 'opacity-70'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    openPhotoModal(index);
                  }}
                >
                  <Image
                    src={img.path}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photo Modal/Carousel for room photos */}
        {showRoomPhotoModal && activeRoomId && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeRoomPhotoModal}
          >
            <button
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-50"
              onClick={(e) => {
                e.stopPropagation();
                closeRoomPhotoModal();
              }}
            >
              <FaTimes size={24} />
            </button>

            <div className="absolute top-4 left-4 text-white bg-black/50 px-3 py-1 rounded-full z-50">
              {activePhotoIndex + 1}/{getCurrentRoomPhotos().length}
            </div>

            <button
              className="absolute left-4 md:left-8 p-3 text-white rounded-full bg-black/50 hover:bg-black/70 transition-colors z-50"
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousPhoto();
              }}
            >
              <FaArrowLeft size={24} />
            </button>

            <button
              className="absolute right-4 md:right-8 p-3 text-white rounded-full bg-black/50 hover:bg-black/70 transition-colors z-50"
              onClick={(e) => {
                e.stopPropagation();
                goToNextPhoto();
              }}
            >
              <FaArrowRight size={24} />
            </button>

            <div
              className="relative w-full max-w-5xl h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={getCurrentRoomPhotos()[activePhotoIndex]?.path || ''}
                alt={`Room Photo ${activePhotoIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>

            <div
              className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {getCurrentRoomPhotos().map((img, index) => (
                <div
                  key={index}
                  className={`relative w-16 h-16 rounded-md overflow-hidden cursor-pointer ${activePhotoIndex === index ? 'ring-2 ring-primary' : 'opacity-70'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    openRoomPhotoModal(activeRoomId || 0, index);
                  }}
                >
                  <Image
                    src={img.path}
                    alt={`Room Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {property.name}
              </h1>
              <div className="flex items-center gap-1 mt-2">
                <p className="text-primary bg-primary/10 px-2 py-1 rounded-xl text-xs font-semibold">
                  {property.category.name}
                </p>
              </div>
              <div className="flex items-center mt-2 gap-1">
                <FaMapMarkerAlt className="text-gray-400" />
                <p className="text-gray-500">
                  {property.address}, {property.city.name}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm mt-2 text-gray-400">
                <div>
                  <Image
                    src={'/homepage/rating.png'}
                    width={28}
                    height={28}
                    alt="star"
                  />
                </div>
                <div className="pt-2">
                  <span className="font-semibold text-gray-700">8.9</span>/10
                </div>
                <div className="pt-2">(104 reviews)</div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex flex-col">
                <p className="text-gray-500 text-sm md:text-right">Hosted by</p>
                <div className="flex flex-row items-center gap-2 mt-1">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                    <Image
                      src={property.tenant.profile_picture}
                      alt={property.tenant.name}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="font-medium text-gray-700 text-lg">
                    {property.tenant.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-600">
              {property.description ||
                'No description available for this property.'}
            </p>
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-4 border-t pt-4">
            <div className="flex items-center">
              <FaCalendarAlt className="text-primary mr-2" />
              <div>
                <p className="text-gray-500 text-sm">Check-in time</p>
                <p className="font-medium">
                  {formatTimeOnly(property.checkin_time) || 'Not specified'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="text-primary mr-2" />
              <div>
                <p className="text-gray-500 text-sm">Check-out time</p>
                <p className="font-medium">
                  {formatTimeOnly(property.checkout_time) || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Facilities</h2>

          {propertyFacilities.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {propertyFacilities.map((facility) => {
                // Get icon directly using facility name
                const facilityIcon = getFacilityIconByName(facility.name);

                return (
                  <div key={facility.id} className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary text-lg">
                        {facilityIcon}
                      </span>
                    </div>
                    <span className="text-gray-700">{facility.name}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">
              No facilities available for this property
            </p>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-4">
          Search other date or guest
        </h2>
        <div className="flex flex-col md:flex-row mb-8 shadow-lg">
          <div className="w-full md:w-[40%] md:rounded-l-lg p-3 flex items-center border-2 border-b-0 md:border-b-2 border-gray md:border-r-0 bg-white relative">
            <div className="w-8 h-8 bg-gray-100 rounded-full mr-2 flex items-center justify-center text-primary">
              <FaCalendarAlt size={14} />
            </div>
            <button
              className="w-full flex items-center justify-between text-gray-700 text-sm"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <span>
                {selectedStartDate && selectedEndDate
                  ? `${formatDisplayDate(selectedStartDate)} - ${formatDisplayDate(selectedEndDate)}`
                  : 'Select dates'}
              </span>
            </button>

            {/* Calendar dropdown */}
            {showCalendar && (
              <div
                ref={calendarRef}
                className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 shadow-lg rounded-lg p-4 w-[640px]"
              >
                {renderCalendar()}
              </div>
            )}
          </div>
          <div className="w-full md:w-[40%] p-3 flex items-center border-2 border-gray bg-white relative">
            <div className="w-8 h-8 bg-gray-100 rounded-full mr-2 flex items-center justify-center text-primary">
              <FaUser size={14} />
            </div>
            <button
              id="guestButton"
              className="w-full flex items-center justify-between text-gray-700 text-sm"
              onClick={() => {
                const dropdown = document.getElementById('guestDropdown');
                if (dropdown) {
                  dropdown.classList.toggle('hidden');
                }
              }}
            >
              <span>
                {searchAdults
                  ? `${searchAdults} ${Number(searchAdults) === 1 ? 'Person' : 'People'}`
                  : 'Number of people'}
              </span>
            </button>

            {/* Dropdown menu */}
            <div
              id="guestDropdown"
              className="hidden absolute top-full left-0 right-0 mt-1 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-full"
            >
              <ul className="py-2 text-sm text-gray-700">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <li key={num}>
                    <button
                      onClick={() => {
                        handleAdultsChange(num.toString());
                        const dropdown =
                          document.getElementById('guestDropdown');
                        if (dropdown) {
                          dropdown.classList.add('hidden');
                        }
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${searchAdults === num.toString() ? 'bg-blue-50 text-primary' : ''}`}
                    >
                      {num} {num === 1 ? 'Person' : 'People'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button
            className="w-full md:w-[20%] md:rounded-r-lg bg-primary text-white p-3 hover:bg-primary/90 transition-colors"
            onClick={() => {
              handleSearch();
            }}
          >
            <div className="flex gap-2 items-center justify-center">
              <FaSearch size={18} /> <span>Search Hotel</span>
            </div>
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Available Rooms</h2>

          {property.rooms && property.rooms.length > 0 ? (
            <div className="space-y-6">
              {property.rooms.map((room) => (
                <div
                  key={room.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3 relative">
                      <div
                        className="relative h-60 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() =>
                          room.images &&
                          room.images.length > 0 &&
                          openRoomPhotoModal(
                            room.id,
                            activeRoomPhoto[room.id] || 0,
                          )
                        }
                      >
                        {room.images && room.images.length > 0 ? (
                          <>
                            <Image
                              src={
                                room.images[activeRoomPhoto[room.id] || 0].path
                              }
                              alt={room.name}
                              fill
                              className="object-cover hover:opacity-95 transition-opacity"
                            />
                            <div className="absolute bottom-0 right-0 bg-black/70 text-white px-3 py-1 m-2 rounded-full text-xs">
                              Click to view all photos
                            </div>
                          </>
                        ) : (
                          <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                            <p className="text-gray-500">No image</p>
                          </div>
                        )}
                      </div>

                      {room.images && room.images.length > 1 && (
                        <div className="flex mt-2 gap-2 overflow-x-auto">
                          {room.images.map((img, index) => (
                            <div
                              key={img.id}
                              className={`relative w-16 h-16 rounded-md overflow-hidden cursor-pointer ${activeRoomPhoto[room.id] === index ? 'ring-2 ring-primary' : ''}`}
                              onClick={() =>
                                handleChangeRoomPhoto(room.id, index)
                              }
                            >
                              <Image
                                src={img.path}
                                alt={`Room ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="w-full md:w-2/3">
                      <h3 className="text-xl font-semibold">{room.name}</h3>
                      <div className="flex items-center mt-2 text-gray-600">
                        <FaUser className="mr-1" />
                        <span>
                          {room.capacity}{' '}
                          {room.capacity > 1 ? 'Guests' : 'Guest'} • {room.size}
                          m²
                        </span>
                      </div>

                      {room.description && (
                        <p className="mt-3 text-gray-600">{room.description}</p>
                      )}

                      {/* Room Facilities */}
                      {room.facilities && room.facilities.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Room Facilities:
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {room.facilities.map((facility) => {
                              const facilityIcon = getFacilityIconByName(
                                facility.name,
                              );

                              return (
                                <div
                                  key={facility.id}
                                  className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm"
                                >
                                  <span className="text-primary mr-1">
                                    {facilityIcon}
                                  </span>
                                  <span className="text-gray-700 ">
                                    {facility.name}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="mt-4">
                        <p className="text-primary font-bold text-xl">
                          IDR {Number(room.base_price).toLocaleString('id-ID')}
                        </p>
                        <p className="text-gray-400 text-xs">
                          not including tax and fees
                        </p>
                      </div>

                      <Link
                        href={`/booking/${property.slug}?roomId=${room.id}&checkin=${formatDisplayDate(dateRange.from)}&checkout=${formatDisplayDate(dateRange.to)}`}
                      >
                        <div className="mt-4 bg-primary text-white px-4 py-2 inline-block rounded hover:bg-primary/90 transition-colors">
                          Book Now
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No rooms available</p>
          )}
        </div>
        <PropertyReviews propertyId={property.id} />
      </div>
      <Footer />
    </>
  );
}
