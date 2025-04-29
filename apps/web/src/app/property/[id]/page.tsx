'use client';

import { useEffect } from 'react';
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
} from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import PropertyDetailModel from '@/models/property/propertyDetailModel';
import PropertyDetailSkeleton from '@/components/property/propertyDetailSkeleton';
import React from 'react';
import { getFacilityIconByName } from '@/utils/facilityIcons';
import { formatTimeOnly } from '@/utils/formatters';

export default function PropertyDetailPage() {
  const { id } = useParams();
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
  } = PropertyDetailModel(id);

  // Handle keyboard navigation
  useEffect(() => {
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
  }, [
    showPhotoModal,
    showRoomPhotoModal,
    closePhotoModal,
    closeRoomPhotoModal,
    goToPreviousPhoto,
    goToNextPhoto,
  ]);

  // Debug time values when property loads
  useEffect(() => {
    if (property) {
      console.log('Raw checkin time:', property.checkin_time);
      console.log('Raw checkout time:', property.checkout_time);
      console.log('Formatted checkin time:', formatTimeOnly(property.checkin_time));
      console.log('Formatted checkout time:', formatTimeOnly(property.checkout_time));
    }
  }, [property]);

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
      <div className="min-h-screen pt-28 pb-10 bg-[#FDFDFE] px-4 lg:px-24">
        {/* Back to Property Listing Navigation */}
        <div className="mb-4">
          <Link href="/property" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
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
          <h2 className="text-xl font-semibold mb-4">Property Facilities</h2>

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
                                  className="flex items-center bg-gray-100 px-3 py-2 rounded text-sm"
                                >
                                  <span className="text-primary mr-2 text-base">
                                    {facilityIcon}
                                  </span>
                                  <span className="text-gray-700">
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

                      <Link href={`/booking/${property.id}?roomId=${room.id}`}>
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
      </div>
      <Footer />
    </>
  );
}
