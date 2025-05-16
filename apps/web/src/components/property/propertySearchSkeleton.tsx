import React from 'react';
import { FaBuilding, FaCity, FaHotel, FaSwimmingPool } from 'react-icons/fa';

export default function PropertySearchSkeleton() {
  // Create array of placeholder items
  const filterItems = Array(6).fill(null);
  const propertyItems = Array(5).fill(null);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Mobile Filter Buttons (Skeleton) */}
      <div className="md:hidden w-full mb-6">
        <div className="grid grid-cols-2 gap-2">
          {/* Category Button */}
          <div className="flex items-center justify-between border rounded p-3 bg-white shadow-sm">
            <div className="flex items-center">
              <FaHotel className="text-gray-300 mr-2" size={18} />
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>

          {/* Tenant Button */}
          <div className="flex items-center justify-between border rounded p-3 bg-white shadow-sm">
            <div className="flex items-center">
              <FaBuilding className="text-gray-300 mr-2" size={18} />
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>

          {/* Facility Button */}
          <div className="flex items-center justify-between border rounded p-3 bg-white shadow-sm">
            <div className="flex items-center">
              <FaSwimmingPool className="text-gray-300 mr-2" size={18} />
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>

          {/* City Button */}
          <div className="flex items-center justify-between border rounded p-3 bg-white shadow-sm">
            <div className="flex items-center">
              <FaCity className="text-gray-300 mr-2" size={18} />
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Filters - Desktop Only (Skeleton) */}
      <div className="hidden md:block md:w-1/4 md:pr-4 mb-6 md:mb-0">
        {/* Category Section */}
        <div className="border rounded p-4 mb-4 bg-white shadow-sm">
          <h2 className="font-bold mb-3 flex items-center">
            <FaHotel className="text-gray-300 mr-2" size={18} />
            <span className="text-gray-400">Category</span>
          </h2>
          <ul className="space-y-2">
            {filterItems.map((_, index) => (
              <li key={`category-${index}`} className="flex items-center">
                <div className="w-5 h-5 border border-gray-200 rounded mr-2"></div>
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
              </li>
            ))}
          </ul>
        </div>

        {/* Tenant Section */}
        <div className="border rounded p-4 mb-4 bg-white shadow-sm">
          <h2 className="font-bold mb-3 flex items-center">
            <FaBuilding className="text-gray-300 mr-2" size={18} />
            <span className="text-gray-400">Tenant</span>
          </h2>
          <ul className="space-y-2">
            {filterItems.map((_, index) => (
              <li key={`tenant-${index}`} className="flex items-center">
                <div className="w-5 h-5 border border-gray-200 rounded mr-2"></div>
                <div className="h-4 w-28 bg-gray-200 animate-pulse rounded"></div>
              </li>
            ))}
          </ul>
        </div>

        {/* Facility Section */}
        <div className="border rounded p-4 mb-4 bg-white shadow-sm">
          <h2 className="font-bold mb-3 flex items-center">
            <FaSwimmingPool className="text-gray-300 mr-2" size={18} />
            <span className="text-gray-400">Facility</span>
          </h2>
          <ul className="space-y-2">
            {filterItems.map((_, index) => (
              <li key={`facility-${index}`} className="flex items-center">
                <div className="w-5 h-5 border border-gray-200 rounded mr-2"></div>
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
              </li>
            ))}
          </ul>
        </div>

        {/* City Section */}
        <div className="border rounded p-4 bg-white shadow-sm">
          <h2 className="font-bold mb-3 flex items-center">
            <FaCity className="text-gray-300 mr-2" size={18} />
            <span className="text-gray-400">Popular City</span>
          </h2>
          <ul className="space-y-2">
            {filterItems.map((_, index) => (
              <li key={`city-${index}`} className="flex items-center">
                <div className="w-5 h-5 border border-gray-200 rounded mr-2"></div>
                <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Property Listings (Skeleton) */}
      <div className="w-full md:w-3/4">
        {/* Filter Options Skeleton */}
        <div className="flex justify-center md:justify-end mb-6">
          <div className="flex items-center gap-3">
            <div className="text-gray-300">Sort by:</div>
            <div className="border rounded-full px-4 py-2 bg-white">
              <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="border rounded-full px-4 py-2 bg-white">
              <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>

        {/* Property Cards Skeleton */}
        <div className="w-full flex flex-col space-y-4">
          {propertyItems.map((_, index) => (
            <div 
              key={`property-skeleton-${index}`}
              className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image Skeleton */}
                <div className="w-full sm:w-2/5">
                  <div className="h-72 sm:h-56 w-full bg-gray-200 animate-pulse"></div>
                </div>
                {/* Content Skeleton */}
                <div className="w-full sm:w-3/5">
                  <div className="p-3">
                    {/* Room type */}
                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
                    
                    {/* Category badge */}
                    <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-xl mb-2"></div>
                    
                    {/* Property name */}
                    <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>
                    
                    {/* Location */}
                    <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded mb-3"></div>
                    
                    {/* Rating */}
                    <div className="h-4 w-40 bg-gray-200 animate-pulse rounded mb-4"></div>
                    
                    {/* Price */}
                    <div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-1"></div>
                    <div className="h-3 w-32 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
