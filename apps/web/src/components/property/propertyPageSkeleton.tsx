import React from 'react';
import Navbar from '@/components/common/navbar/navbar';
import {
  FaSearch,
  FaUser,
} from 'react-icons/fa';
import PropertySkeleton from '@/components/property/propertySkeleton';

const PropertyPageSkeleton = () => {
  return (
    <>
      <Navbar forceScrolled={true} />
      <div className="lg:mx-24 py-6 px-4 bg-[#FDFDFE] pt-28 min-h-screen">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row mb-8">
          <div className="w-full md:w-1/3 p-3 md:rounded-l-lg flex items-center border-2 border-b-0 md:border-b-2 border-primary md:border-r-0 bg-white">
            <div className="w-8 h-8 bg-gray-100 rounded-full mr-2 flex items-center justify-center text-gray-500">
              <FaSearch size={14} />
            </div>
            <div className="w-full h-6 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="w-full md:w-1/3 p-3 flex items-center border-2 border-b-0 md:border-b-2 border-primary md:border-r-0 bg-white">
            <div className="w-full h-6 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="w-full md:w-1/4 p-3 flex items-center border-2 border-primary bg-white relative">
            <div className="w-8 h-8 bg-gray-100 rounded-full mr-2 flex items-center justify-center text-gray-500">
              <FaUser size={14} />
            </div>
            <div className="w-full h-6 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="w-full md:w-1/6 md:rounded-r-lg bg-primary text-white p-3">
            <div className="flex gap-2 items-center justify-center">
              <FaSearch size={18} /> <span>Search Hotel</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Filters placeholder */}
          <div className="hidden md:block md:w-1/4 md:pr-6">
            <div className="border rounded p-4 mb-4 bg-white shadow-sm">
              <div className="h-8 w-1/2 bg-gray-200 animate-pulse rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          </div>

          {/* Property Listings */}
          <div className="w-full md:w-3/4">
            {/* Filter Options */}
            <div className="flex justify-center md:justify-end mb-6">
              <div className="flex items-center gap-3">
                <div className="text-gray-500">Sort by:</div>
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
            </div>

            {/* Property Skeletons */}
            <div className="w-full flex flex-col space-y-4">
              {[1, 2, 3, 4].map((index) => (
                <PropertySkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyPageSkeleton; 