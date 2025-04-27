'use client';

import Navbar from '@/components/common/navbar/navbar';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// Import icons from a reliable source like react-icons instead of Material Icons
import {
  FaBuilding,
  FaCity,
  FaHotel,
  FaSwimmingPool,
  FaSearch,
  FaCalendarAlt,
  FaUser,
  FaSortAlphaDown,
  FaSortAlphaDownAlt,
  FaMoneyBillWave,
  FaArrowDown,
  FaArrowUp,
} from 'react-icons/fa';

export default function PropertyPage() {
  type FilterName = 'category' | 'propertyName' | 'facility' | 'city';
  type SortDirection = 'asc' | 'desc';
  type PriceDirection = 'low-to-high' | 'high-to-low';

  const [openFilters, setOpenFilters] = useState({
    category: false,
    propertyName: false,
    facility: false,
    city: false,
  });

  const [openDropdown, setOpenDropdown] = useState({
    sort: false,
    price: false,
  });

  const [sortValue, setSortValue] = useState<SortDirection>('asc');
  const [priceValue, setPriceValue] = useState<PriceDirection>('low-to-high');

  const sortRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setOpenDropdown((prev) => ({ ...prev, sort: false }));
      }
      if (
        priceRef.current &&
        !priceRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown((prev) => ({ ...prev, price: false }));
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (dropdownName: 'sort' | 'price') => {
    setOpenDropdown((prev) => ({
      sort: dropdownName === 'sort' ? !prev.sort : false,
      price: dropdownName === 'price' ? !prev.price : false,
    }));
  };

  const toggleFilter = (filterName: FilterName) => {
    // Check if the clicked filter is already open
    const isCurrentlyOpen = openFilters[filterName];

    // Close all filters first
    const allClosed = {
      category: false,
      propertyName: false,
      facility: false,
      city: false,
    };

    // If the filter wasn't open before, open it now
    if (!isCurrentlyOpen) {
      setOpenFilters({
        ...allClosed,
        [filterName]: true,
      });
    } else {
      // If it was already open, just close everything
      setOpenFilters(allClosed);
    }
  };

  const handleSortClick = (direction: SortDirection) => {
    setSortValue(direction);
    setOpenDropdown(prev => ({...prev, sort: false}));
    // Here you would add logic to actually sort the properties
  };

  const handlePriceClick = (direction: PriceDirection) => {
    setPriceValue(direction);
    setOpenDropdown(prev => ({...prev, price: false}));
    // Here you would add logic to actually sort the properties by price
  };

  return (
    <>
      <Navbar forceScrolled={true} />
      <div className="lg:mx-24 py-6 px-4 bg-[#FDFDFE]">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row mb-8 pt-24">
          <div className="w-full md:w-1/3 p-3 md:rounded-l-lg flex items-center border-2 border-b-0 md:border-b-2 border-primary md:border-r-0  bg-white">
            <div className="w-8 h-8 bg-gray-100 rounded-full mr-2 flex items-center justify-center text-gray-500">
              <FaSearch size={14} />
            </div>
            <span className="text-gray-500">Location</span>
          </div>
          <div className="w-full md:w-1/3 p-3 flex items-center border-2 border-b-0 md:border-b-2 border-primary md:border-r-0 bg-white">
            <div className="w-8 h-8 bg-gray-100 rounded-full mr-2 flex items-center justify-center text-gray-500">
              <FaCalendarAlt size={14} />
            </div>
            <span className="text-gray-500">Date</span>
          </div>
          <div className="w-full md:w-1/4 p-3 flex items-center border-2 border-primary bg-white">
            <div className="w-8 h-8 bg-gray-100 rounded-full mr-2 flex items-center justify-center text-gray-500">
              <FaUser size={14} />
            </div>
            <span className="text-gray-500">Adult</span>
          </div>
          <button className="w-full md:w-1/6 md:rounded-r-lg bg-primary text-white p-3 hover:bg-primary/90 transition-colors">
            <div className="flex gap-2 items-center justify-center">
              <FaSearch size={18} /> <span>Search Hotel</span>
            </div>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row">
          {/* Mobile Filter Buttons */}
          <div className="md:hidden w-full mb-6">
            <div className="grid grid-cols-2 gap-2">
              {/* Category Button */}
              <button
                onClick={() => toggleFilter('category')}
                className={`flex items-center border rounded p-3 ${openFilters.category ? 'bg-blue-50 border-blue-300' : 'bg-white'} shadow-sm`}
              >
                <FaHotel
                  className={`${openFilters.category ? 'text-blue-500' : 'text-gray-500'} mr-2`}
                  size={18}
                />
                <span
                  className={`font-medium ${openFilters.category ? 'text-blue-600' : 'text-gray-700'}`}
                >
                  Category
                </span>
              </button>

              {/* Tenant Button */}
              <button
                onClick={() => toggleFilter('propertyName')}
                className={`flex items-center border rounded p-3 ${openFilters.propertyName ? 'bg-blue-50 border-blue-300' : 'bg-white'} shadow-sm`}
              >
                <FaBuilding
                  className={`${openFilters.propertyName ? 'text-blue-500' : 'text-gray-500'} mr-2`}
                  size={18}
                />
                <span
                  className={`font-medium ${openFilters.propertyName ? 'text-blue-600' : 'text-gray-700'}`}
                >
                  Tenant
                </span>
              </button>

              {/* Facility Button */}
              <button
                onClick={() => toggleFilter('facility')}
                className={`flex items-center border rounded p-3 ${openFilters.facility ? 'bg-blue-50 border-blue-300' : 'bg-white'} shadow-sm`}
              >
                <FaSwimmingPool
                  className={`${openFilters.facility ? 'text-blue-500' : 'text-gray-500'} mr-2`}
                  size={18}
                />
                <span
                  className={`font-medium ${openFilters.facility ? 'text-blue-600' : 'text-gray-700'}`}
                >
                  Facility
                </span>
              </button>

              {/* City Button */}
              <button
                onClick={() => toggleFilter('city')}
                className={`flex items-center border rounded p-3 ${openFilters.city ? 'bg-blue-50 border-blue-300' : 'bg-white'} shadow-sm`}
              >
                <FaCity
                  className={`${openFilters.city ? 'text-blue-500' : 'text-gray-500'} mr-2`}
                  size={18}
                />
                <span
                  className={`font-medium ${openFilters.city ? 'text-blue-600' : 'text-gray-700'}`}
                >
                  City
                </span>
              </button>
            </div>

            {/* Mobile Filter Sections */}
            {/* Category Section - Mobile */}
            <div
              className={`${openFilters.category ? 'block' : 'hidden'} border rounded p-4 mt-2 mb-4 bg-white shadow-sm transition-all duration-300`}
            >
              <ul className="space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <li
                    key={`m-category-${item}`}
                    className="hover:text-blue-600 cursor-pointer"
                  >
                    Category Name
                  </li>
                ))}
              </ul>
            </div>

            {/* Tenant Section - Mobile */}
            <div
              className={`${openFilters.propertyName ? 'block' : 'hidden'} border rounded p-4 mt-2 mb-4 bg-white shadow-sm transition-all duration-300`}
            >
              <ul className="space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <li
                    key={`m-property-${item}`}
                    className="hover:text-blue-600 cursor-pointer"
                  >
                    Category Name
                  </li>
                ))}
              </ul>
            </div>

            {/* Facility Section - Mobile */}
            <div
              className={`${openFilters.facility ? 'block' : 'hidden'} border rounded p-4 mt-2 mb-4 bg-white shadow-sm transition-all duration-300`}
            >
              <ul className="space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <li
                    key={`m-facility-${item}`}
                    className="hover:text-blue-600 cursor-pointer"
                  >
                    Category Name
                  </li>
                ))}
              </ul>
            </div>

            {/* City Section - Mobile */}
            <div
              className={`${openFilters.city ? 'block' : 'hidden'} border rounded p-4 mt-2 mb-4 bg-white shadow-sm transition-all duration-300`}
            >
              <ul className="space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <li
                    key={`m-city-${item}`}
                    className="hover:text-blue-600 cursor-pointer"
                  >
                    Category Name
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden md:block md:w-1/4 md:pr-4 mb-6 md:mb-0">
            {/* Category Section */}
            <div className="border rounded p-4 mb-4 bg-white shadow-sm">
              <h2 className="font-bold mb-3 flex items-center">
                <FaHotel className="text-gray-500 mr-2" size={18} />
                Category
              </h2>
              <ul className="space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <li
                    key={`category-${item}`}
                    className="hover:text-blue-600 cursor-pointer"
                  >
                    Category Name
                  </li>
                ))}
              </ul>
            </div>

            {/* Tenant Section */}
            <div className="border rounded p-4 mb-4 bg-white shadow-sm">
              <h2 className="font-bold mb-3 flex items-center">
                <FaBuilding className="text-gray-500 mr-2" size={18} />
                Tenant
              </h2>
              <ul className="space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <li
                    key={`property-${item}`}
                    className="hover:text-blue-600 cursor-pointer"
                  >
                    Category Name
                  </li>
                ))}
              </ul>
            </div>

            {/* Facility Section */}
            <div className="border rounded p-4 mb-4 bg-white shadow-sm">
              <h2 className="font-bold mb-3 flex items-center">
                <FaSwimmingPool className="text-gray-500 mr-2" size={18} />
                Facility
              </h2>
              <ul className="space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <li
                    key={`facility-${item}`}
                    className="hover:text-blue-600 cursor-pointer"
                  >
                    Category Name
                  </li>
                ))}
              </ul>
            </div>

            {/* City Section */}
            <div className="border rounded p-4 bg-white shadow-sm">
              <h2 className="font-bold mb-3 flex items-center">
                <FaCity className="text-gray-500 mr-2" size={18} />
                City
              </h2>
              <ul className="space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <li
                    key={`city-${item}`}
                    className="hover:text-blue-600 cursor-pointer"
                  >
                    Category Name
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="w-full md:w-3/4">
            {/* Filter Options */}
            <div className="flex justify-center md:justify-end mb-6">
              <div className="flex items-center gap-3">
              <div className='text-gray-500'>Sort by:</div>
                <div className="relative" ref={sortRef}>
                  <button 
                    className="flex items-center space-x-2 border rounded-full px-4 py-2 hover:bg-gray-50 transition-colors bg-white"
                    onClick={() => toggleDropdown('sort')}
                  >
                    <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                      {sortValue === 'asc' ? (
                        <FaSortAlphaDown size={10} className="text-gray-500" />
                      ) : (
                        <FaSortAlphaDownAlt size={10} className="text-gray-500" />
                      )}
                    </div>
                    <span>{sortValue === 'asc' ? 'A-Z' : 'Z-A'}</span>
                  </button>
                  {openDropdown.sort && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                      <div className="py-1">
                        <button 
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${sortValue === 'asc' ? 'bg-blue-50 text-primary' : ''}`}
                          onClick={() => handleSortClick('asc')}
                        >
                          <FaSortAlphaDown size={12} className={sortValue === 'asc' ? 'text-primary' : 'text-gray-500'} />
                          <span>Ascending (A-Z)</span>
                        </button>
                        <button 
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${sortValue === 'desc' ? 'bg-blue-50 text-primary' : ''}`}
                          onClick={() => handleSortClick('desc')}
                        >
                          <FaSortAlphaDownAlt size={12} className={sortValue === 'desc' ? 'text-primary' : 'text-gray-500'} />
                          <span>Descending (Z-A)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative" ref={priceRef}>
                  <button 
                    className="flex items-center space-x-2 border rounded-full px-4 py-2 hover:bg-gray-50 transition-colors bg-white"
                    onClick={() => toggleDropdown('price')}
                  >
                    <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                      {priceValue === 'low-to-high' ? (
                        <FaArrowDown size={10} className="text-gray-500" />
                      ) : (
                        <FaArrowUp size={10} className="text-gray-500" />
                      )}
                    </div>
                    <span>Price</span>
                  </button>
                  {openDropdown.price && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border">
                      <div className="py-1">
                        <button 
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${priceValue === 'low-to-high' ? 'bg-blue-50 text-primary' : ''}`}
                          onClick={() => handlePriceClick('low-to-high')}
                        >
                          <FaArrowDown size={12} className={priceValue === 'low-to-high' ? 'text-primary' : 'text-gray-500'} />
                          <span>Lowest to Highest</span>
                        </button>
                        <button 
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${priceValue === 'high-to-low' ? 'bg-blue-50 text-primary' : ''}`}
                          onClick={() => handlePriceClick('high-to-low')}
                        >
                          <FaArrowUp size={12} className={priceValue === 'high-to-low' ? 'text-primary' : 'text-gray-500'} />
                          <span>Highest to Lowest</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Property Listings */}
            <div className="w-full flex flex-col space-y-4">
              {/* Hotel Card 1 */}
              <div className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/4">
                    <div className="relative h-48 sm:h-full w-full">
                      <div className="bg-gray-200 h-full w-full"></div>
                      {/* Replace with Image component when you have actual images */}
                      {/* <Image
                        src="/path-to-image.jpg"
                        alt="Hotel"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg sm:rounded-l-lg sm:rounded-t-none brightness-95"
                      /> */}
                    </div>
                  </div>
                  <div className="w-full sm:w-3/4">
                    <Link href="#" className="block">
                      <div>
                        <p className="text-xs text-black bg-blue-50 py-1 px-2">
                          1 Room • 2 Guests • 45.0m²
                        </p>
                        <div className="p-3">
                          <p className="text-gray-400 text-sm">Hotel</p>
                          <p className="font-semibold">Kualanamu Hotel</p>
                          <p className="text-gray-400 text-sm">
                            Medan, North Sumatra
                          </p>
                          <div className="flex items-center gap-1 text-sm mt-2 text-gray-400">
                            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs">★</span>
                            </div>
                            <div className="pt-1">
                              <span className="font-semibold text-gray-700">
                                8.5
                              </span>
                              /10
                            </div>
                            <div className="pt-1">(86 reviews)</div>
                          </div>
                          <p className="text-blue-600 font-bold text-lg mt-4">
                            IDR 1.200.000
                          </p>
                          <p className="text-gray-400 text-xs">
                            not including tax and fees
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Hotel Card 2 */}
              <div className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/4">
                    <div className="relative h-48 sm:h-full w-full">
                      <div className="bg-gray-200 h-full w-full"></div>
                      {/* Replace with Image component when you have actual images */}
                      {/* <Image
                        src="/path-to-image.jpg"
                        alt="Hotel"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg sm:rounded-l-lg sm:rounded-t-none brightness-95"
                      /> */}
                    </div>
                  </div>
                  <div className="w-full sm:w-3/4">
                    <Link href="#" className="block">
                      <div>
                        <p className="text-xs text-black bg-blue-50 py-1 px-2">
                          1 Room • 4 Guests • 65.0m²
                        </p>
                        <div className="p-3">
                          <p className="text-gray-400 text-sm">Resort</p>
                          <p className="font-semibold">Paradiso Resort</p>
                          <p className="text-gray-400 text-sm">
                            Bali, Indonesia
                          </p>
                          <div className="flex items-center gap-1 text-sm mt-2 text-gray-400">
                            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs">★</span>
                            </div>
                            <div className="pt-1">
                              <span className="font-semibold text-gray-700">
                                9.2
                              </span>
                              /10
                            </div>
                            <div className="pt-1">(124 reviews)</div>
                          </div>
                          <p className="text-blue-600 font-bold text-lg mt-4">
                            IDR 2.800.000
                          </p>
                          <p className="text-gray-400 text-xs">
                            not including tax and fees
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Hotel Card 3 */}
              <div className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/4">
                    <div className="relative h-48 sm:h-full w-full">
                      <div className="bg-gray-200 h-full w-full"></div>
                      {/* Replace with Image component when you have actual images */}
                      {/* <Image
                        src="/path-to-image.jpg"
                        alt="Hotel"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg sm:rounded-l-lg sm:rounded-t-none brightness-95"
                      /> */}
                    </div>
                  </div>
                  <div className="w-full sm:w-3/4">
                    <Link href="#" className="block">
                      <div>
                        <p className="text-xs text-black bg-blue-50 py-1 px-2">
                          2 Rooms • 3 Guests • 85.0m²
                        </p>
                        <div className="p-3">
                          <p className="text-gray-400 text-sm">Villa</p>
                          <p className="font-semibold">Jakarta City Villa</p>
                          <p className="text-gray-400 text-sm">
                            Jakarta, Indonesia
                          </p>
                          <div className="flex items-center gap-1 text-sm mt-2 text-gray-400">
                            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs">★</span>
                            </div>
                            <div className="pt-1">
                              <span className="font-semibold text-gray-700">
                                8.7
                              </span>
                              /10
                            </div>
                            <div className="pt-1">(98 reviews)</div>
                          </div>
                          <p className="text-blue-600 font-bold text-lg mt-4">
                            IDR 3.500.000
                          </p>
                          <p className="text-gray-400 text-xs">
                            not including tax and fees
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
