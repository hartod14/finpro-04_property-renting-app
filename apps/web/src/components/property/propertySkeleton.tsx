import React from 'react';

const PropertySkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-2/5">
          <div className="relative h-72 sm:h-full w-full">
            <div className="bg-gray-200 animate-pulse h-full w-full"></div>
          </div>
        </div>
        <div className="w-full sm:w-3/5">
          <div className="p-3">
            {/* Room details skeleton */}
            <div className="h-5 w-2/3 bg-gray-200 animate-pulse rounded"></div>
            
            {/* Category skeleton */}
            <div className="mt-3 h-6 w-1/4 bg-gray-200 animate-pulse rounded-xl"></div>
            
            {/* Property name skeleton */}
            <div className="mt-3 h-7 w-3/4 bg-gray-200 animate-pulse rounded"></div>
            
            {/* Location skeleton */}
            <div className="mt-3 h-5 w-1/3 bg-gray-200 animate-pulse rounded"></div>
            
            {/* Rating skeleton */}
            <div className="mt-4 flex">
              <div className="h-6 w-28 bg-gray-200 animate-pulse rounded"></div>
            </div>
            
            {/* Price skeleton */}
            <div className="mt-7 h-8 w-2/5 bg-gray-200 animate-pulse rounded"></div>
            <div className="mt-2 h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertySkeleton;
