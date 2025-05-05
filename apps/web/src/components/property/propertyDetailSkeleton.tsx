import React from 'react';
import Navbar from '@/components/common/navbar/navbar';
import Footer from '@/components/common/footer/footer';

export default function PropertyDetailSkeleton() {
  return (
    <>
      <Navbar forceScrolled={true} />
      <div className="min-h-screen pt-28 pb-10 bg-[#FDFDFE] px-4 lg:px-24">
        <div className="animate-pulse">
          {/* Photos section skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
            <div className="md:col-span-2 h-96 bg-gray-200 rounded-lg"></div>
            <div className="md:col-span-1 grid grid-rows-2 gap-2">
              <div className="h-full bg-gray-200 rounded-lg"></div>
              <div className="h-full bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          
          {/* Information section skeleton */}
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
            <div className="h-8 w-2/3 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded mb-6"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-6"></div>
            <div className="flex justify-between">
              <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
              <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          {/* Facilities section skeleton */}
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-8 w-8 bg-gray-200 rounded-full mr-2"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Rooms section skeleton */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 mb-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3 h-48 bg-gray-200 rounded-lg"></div>
                  <div className="w-full md:w-2/3">
                    <div className="h-6 w-1/3 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 w-1/4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 