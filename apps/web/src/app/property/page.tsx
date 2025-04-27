'use client';

import Navbar from '@/components/common/navbar/navbar';
import Link from 'next/link';
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
  FaCheck,
  FaLocationArrow,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import PropertyModel from '@/models/property/propertyModel';
import Image from 'next/image';
import { DateRangePicker } from '@/components/ui/calendar';
import { useEffect } from 'react';

export default function PropertyPage() {
  const {
    openFilters,
    openDropdown,
    categories,
    tenants,
    facilities,
    cities,
    loading,
    error,
    selectedCategories,
    selectedTenants,
    selectedFacilities,
    selectedCities,
    sortValue,
    priceValue,
    sortRef,
    priceRef,
    toggleDropdown,
    toggleFilter,
    handlePriceClick,
    handleSortClick,
    handleCategoryClick,
    handleTenantClick,
    handleFacilityClick,
    handleCityClick,
    properties,
    searchTerm,
    searchDate,
    searchAdults,
    handleSearchTermChange,
    handleDateChange,
    handleAdultsChange,
    handleSearch,
    dateRange,
    handleDateRangeChange,
  } = PropertyModel();

  const handleDateRangePickerChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    handleDateRangeChange({
      from: start || undefined,
      to: end || undefined,
    });
  };

  // Setup click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle guest dropdown
      const guestDropdown = document.getElementById('guestDropdown');
      const guestButton = document.getElementById('guestButton');
      
      if (
        guestDropdown && 
        !guestDropdown.classList.contains('hidden') &&
        event.target instanceof Node &&
        !guestDropdown.contains(event.target) &&
        guestButton && 
        !guestButton.contains(event.target)
      ) {
        guestDropdown.classList.add('hidden');
      }
      
      // Handle sortRef dropdown
      const sortElement = sortRef.current;
      if (sortElement && openDropdown.sort && event.target instanceof Node && !sortElement.contains(event.target)) {
        toggleDropdown('sort');
      }
      
      // Handle priceRef dropdown
      const priceElement = priceRef.current;
      if (priceElement && openDropdown.price && event.target instanceof Node && !priceElement.contains(event.target)) {
        toggleDropdown('price');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown, toggleDropdown]);

  if (loading) {
    return (
      <>
        <Navbar forceScrolled={true} />
        <div className="lg:mx-24 py-6 px-4 bg-[#FDFDFE] pt-28 min-h-screen">
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar forceScrolled={true} />
        <div className="lg:mx-24 py-6 px-4 bg-[#FDFDFE] pt-28 min-h-screen">
          <div className="flex justify-center items-center h-60">
            <div className="text-red-500 text-center">
              <p className="text-xl font-semibold">{error}</p>
              <button
                className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

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
            <input 
              type="text" 
              placeholder="Search location, property..." 
              className="w-full outline-none text-gray-700"
              value={searchTerm}
              onChange={(e) => handleSearchTermChange(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 p-3 flex items-center border-2 border-b-0 md:border-b-2 border-primary md:border-r-0 bg-white">
            <DateRangePicker
              startDate={dateRange.from ? new Date(dateRange.from) : null}
              endDate={dateRange.to ? new Date(dateRange.to) : null}
              onChange={handleDateRangePickerChange}
              startDatePlaceholder="Check-in"
              endDatePlaceholder="Check-out"
            />
          </div>
          <div className="w-full md:w-1/4 p-3 flex items-center border-2 border-primary bg-white relative">
            <div className="w-8 h-8 bg-gray-100 rounded-full mr-2 flex items-center justify-center text-gray-500">
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
              <span>{searchAdults ? `${searchAdults} ${Number(searchAdults) === 1 ? 'Person' : 'People'}` : 'Number of people'}</span>
              <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
              </svg>
            </button>
            
            {/* Dropdown menu */}
            <div id="guestDropdown" className="hidden absolute top-full left-0 right-0 mt-1 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-full">
              <ul className="py-2 text-sm text-gray-700">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <li key={num}>
                    <button
                      onClick={() => {
                        handleAdultsChange(num.toString());
                        const dropdown = document.getElementById('guestDropdown');
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
            className="w-full md:w-1/6 md:rounded-r-lg bg-primary text-white p-3 hover:bg-primary/90 transition-colors"
            onClick={() => {
              console.log(`Searching with ${searchAdults} people`);
              handleSearch();
            }}
          >
            <div className="flex gap-2 items-center justify-center">
              <FaSearch size={18} /> <span>Search Hotel</span>
            </div>
          </button>
        </div>

        {/* Add global styles for datepicker and select dropdown */}
        <style jsx global>{`
          .react-datepicker-wrapper {
            width: 100%;
          }
          .react-datepicker-popper {
            z-index: 9999 !important;
          }
          .react-datepicker {
            font-family: inherit;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
          .react-datepicker__triangle {
            display: none;
          }
          /* Make months display horizontally */
          .react-datepicker__month-container {
            display: inline-block;
            margin-right: 10px;
          }
          .react-datepicker__month {
            margin: 0.4rem;
          }
          /* Improve navigation arrows */
          .react-datepicker__navigation {
            top: 12px;
            border: none;
            background: rgba(59, 130, 246, 0.1);
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.2s;
          }
          .react-datepicker__navigation:hover {
            background: rgba(59, 130, 246, 0.2);
          }
          .react-datepicker__navigation--previous {
            left: 12px;
          }
          .react-datepicker__navigation--next {
            right: 12px;
          }
          .react-datepicker__navigation-icon::before {
            border-width: 2px 2px 0 0;
            border-color: #3b82f6;
            width: 8px;
            height: 8px;
            top: 9px;
          }
          .react-datepicker__navigation-icon--previous::before {
            right: -3px;
          }
          .react-datepicker__navigation-icon--next::before {
            left: -3px;
          }
          
          /* Custom select dropdown styling */
          select {
            background-image: none;
          }
          
          select:focus {
            outline: none;
          }
          
          /* Style for the dropdown when open */
          select option {
            padding: 10px;
            background-color: white;
            color: #4b5563;
          }
          
          select option:hover,
          select option:focus,
          select option:active {
            background-color: #e0f2fe;
            color: #1e3a8a;
          }
          
          /* Make Firefox dropdowns look similar to Chrome */
          @-moz-document url-prefix() {
            select {
              color: #4b5563;
              text-indent: 0.01px;
              text-overflow: '';
              padding-right: 1rem;
            }
          }
        `}</style>

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
                {categories.map((category) => (
                  <li
                    key={`m-category-${category.id}`}
                    className="flex items-center hover:text-blue-600 cursor-pointer"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <div
                      className={`w-5 h-5 border rounded flex items-center justify-center mr-2 ${selectedCategories.includes(category.id) ? 'bg-primary border-primary' : 'border-gray-300'}`}
                    >
                      {selectedCategories.includes(category.id) && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                    <span
                      className={
                        selectedCategories.includes(category.id)
                          ? 'font-medium'
                          : ''
                      }
                    >
                      {category.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tenant Section - Mobile */}
            <div
              className={`${openFilters.propertyName ? 'block' : 'hidden'} border rounded p-4 mt-2 mb-4 bg-white shadow-sm transition-all duration-300`}
            >
              <ul className="space-y-2">
                {tenants.map((tenant) => (
                  <li
                    key={`m-tenant-${tenant.id}`}
                    className="flex items-center hover:text-blue-600 cursor-pointer"
                    onClick={() => handleTenantClick(tenant.id)}
                  >
                    <div
                      className={`w-5 h-5 border rounded flex items-center justify-center mr-2 ${selectedTenants.includes(tenant.id) ? 'bg-primary border-primary' : 'border-gray-300'}`}
                    >
                      {selectedTenants.includes(tenant.id) && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                    <span
                      className={
                        selectedTenants.includes(tenant.id) ? 'font-medium' : ''
                      }
                    >
                      {tenant.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Facility Section - Mobile */}
            <div
              className={`${openFilters.facility ? 'block' : 'hidden'} border rounded p-4 mt-2 mb-4 bg-white shadow-sm transition-all duration-300`}
            >
              <ul className="space-y-2">
                {facilities.map((facility) => (
                  <li
                    key={`m-facility-${facility.id}`}
                    className="flex items-center hover:text-blue-600 cursor-pointer"
                    onClick={() => handleFacilityClick(facility.id)}
                  >
                    <div
                      className={`w-5 h-5 border rounded flex items-center justify-center mr-2 ${selectedFacilities.includes(facility.id) ? 'bg-primary border-primary' : 'border-gray-300'}`}
                    >
                      {selectedFacilities.includes(facility.id) && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                    <span
                      className={
                        selectedFacilities.includes(facility.id)
                          ? 'font-medium'
                          : ''
                      }
                    >
                      {facility.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* City Section - Mobile */}
            <div
              className={`${openFilters.city ? 'block' : 'hidden'} border rounded p-4 mt-2 mb-4 bg-white shadow-sm transition-all duration-300`}
            >
              <ul className="space-y-2">
                {cities.map((city) => (
                  <li
                    key={`m-city-${city.id}`}
                    className="flex items-center hover:text-blue-600 cursor-pointer"
                    onClick={() => handleCityClick(city.id)}
                  >
                    <div
                      className={`w-5 h-5 border rounded flex items-center justify-center mr-2 ${selectedCities.includes(city.id) ? 'bg-primary border-primary' : 'border-gray-300'}`}
                    >
                      {selectedCities.includes(city.id) && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                    <span
                      className={
                        selectedCities.includes(city.id) ? 'font-medium' : ''
                      }
                    >
                      {city.name}
                    </span>
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
                {selectedCategories.length > 0 && (
                  <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
                    {selectedCategories.length}
                  </span>
                )}
              </h2>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li
                    key={`category-${category.id}`}
                    className="flex items-center hover:text-blue-600 cursor-pointer"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <div
                      className={`w-5 h-5 border rounded flex items-center justify-center mr-2 ${selectedCategories.includes(category.id) ? 'bg-primary border-primary' : 'border-gray-300'}`}
                    >
                      {selectedCategories.includes(category.id) && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                    <span
                      className={
                        selectedCategories.includes(category.id)
                          ? 'font-medium'
                          : ''
                      }
                    >
                      {category.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tenant Section */}
            <div className="border rounded p-4 mb-4 bg-white shadow-sm">
              <h2 className="font-bold mb-3 flex items-center">
                <FaBuilding className="text-gray-500 mr-2" size={18} />
                Tenant
                {selectedTenants.length > 0 && (
                  <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
                    {selectedTenants.length}
                  </span>
                )}
              </h2>
              <ul className="space-y-2">
                {tenants.map((tenant) => (
                  <li
                    key={`tenant-${tenant.id}`}
                    className="flex items-center hover:text-blue-600 cursor-pointer"
                    onClick={() => handleTenantClick(tenant.id)}
                  >
                    <div
                      className={`w-5 h-5 border rounded flex items-center justify-center mr-2 ${selectedTenants.includes(tenant.id) ? 'bg-primary border-primary' : 'border-gray-300'}`}
                    >
                      {selectedTenants.includes(tenant.id) && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                    <span
                      className={
                        selectedTenants.includes(tenant.id) ? 'font-medium' : ''
                      }
                    >
                      {tenant.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Facility Section */}
            <div className="border rounded p-4 mb-4 bg-white shadow-sm">
              <h2 className="font-bold mb-3 flex items-center">
                <FaSwimmingPool className="text-gray-500 mr-2" size={18} />
                Facility
                {selectedFacilities.length > 0 && (
                  <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
                    {selectedFacilities.length}
                  </span>
                )}
              </h2>
              <ul className="space-y-2">
                {facilities.map((facility) => (
                  <li
                    key={`facility-${facility.id}`}
                    className="flex items-center hover:text-blue-600 cursor-pointer"
                    onClick={() => handleFacilityClick(facility.id)}
                  >
                    <div
                      className={`w-5 h-5 border rounded flex items-center justify-center mr-2 ${selectedFacilities.includes(facility.id) ? 'bg-primary border-primary' : 'border-gray-300'}`}
                    >
                      {selectedFacilities.includes(facility.id) && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                    <span
                      className={
                        selectedFacilities.includes(facility.id)
                          ? 'font-medium'
                          : ''
                      }
                    >
                      {facility.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* City Section */}
            <div className="border rounded p-4 bg-white shadow-sm">
              <h2 className="font-bold mb-3 flex items-center">
                <FaCity className="text-gray-500 mr-2" size={18} />
                City
                {selectedCities.length > 0 && (
                  <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
                    {selectedCities.length}
                  </span>
                )}
              </h2>
              <ul className="space-y-2">
                {cities.map((city) => (
                  <li
                    key={`city-${city.id}`}
                    className="flex items-center hover:text-blue-600 cursor-pointer"
                    onClick={() => handleCityClick(city.id)}
                  >
                    <div
                      className={`w-5 h-5 border rounded flex items-center justify-center mr-2 ${selectedCities.includes(city.id) ? 'bg-primary border-primary' : 'border-gray-300'}`}
                    >
                      {selectedCities.includes(city.id) && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                    <span
                      className={
                        selectedCities.includes(city.id) ? 'font-medium' : ''
                      }
                    >
                      {city.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="w-full md:w-3/4">
            {/* Filter Options */}
            <div className="flex justify-center md:justify-end mb-6">
              <div className="flex items-center gap-3">
                <div className="text-gray-500">Sort by:</div>
                <div className="relative" ref={sortRef}>
                  <button
                    className="flex items-center space-x-2 border rounded-full px-4 py-2 hover:bg-gray-50 transition-colors bg-white"
                    onClick={() => toggleDropdown('sort')}
                  >
                    <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                      {sortValue === 'asc' ? (
                        <FaSortAlphaDown size={10} className="text-gray-500" />
                      ) : (
                        <FaSortAlphaDownAlt
                          size={10}
                          className="text-gray-500"
                        />
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
                          <FaSortAlphaDown
                            size={12}
                            className={
                              sortValue === 'asc'
                                ? 'text-primary'
                                : 'text-gray-500'
                            }
                          />
                          <span>Ascending (A-Z)</span>
                        </button>
                        <button
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${sortValue === 'desc' ? 'bg-blue-50 text-primary' : ''}`}
                          onClick={() => handleSortClick('desc')}
                        >
                          <FaSortAlphaDownAlt
                            size={12}
                            className={
                              sortValue === 'desc'
                                ? 'text-primary'
                                : 'text-gray-500'
                            }
                          />
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
                          <FaArrowDown
                            size={12}
                            className={
                              priceValue === 'low-to-high'
                                ? 'text-primary'
                                : 'text-gray-500'
                            }
                          />
                          <span>Lowest to Highest</span>
                        </button>
                        <button
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${priceValue === 'high-to-low' ? 'bg-blue-50 text-primary' : ''}`}
                          onClick={() => handlePriceClick('high-to-low')}
                        >
                          <FaArrowUp
                            size={12}
                            className={
                              priceValue === 'high-to-low'
                                ? 'text-primary'
                                : 'text-gray-500'
                            }
                          />
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
              {properties.length > 0 ? (
                properties.map((property) => (
                  <div
                    key={`property-${property.id}`}
                    className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-2/5">
                        <div className="relative h-72 sm:h-full w-full">
                          {property.images && property.images.length > 0 ? (
                            <Image
                              src={property.images[0].path}
                              alt={property.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 40vw"
                              priority={property.id <= 2}
                            />
                          ) : (
                            <div className="bg-gray-200 h-full w-full"></div>
                          )}
                        </div>
                      </div>
                      <div className="w-full sm:w-3/5">
                        <Link
                          href={`/property/${property.id}`}
                          className="block"
                        >
                          <div>
                            {property.lowestPriceRoom && (
                              <p className="text-xs font-semibold text-primary2 bg-blue-50 py-1 px-2">
                                {property.lowestPriceRoom.name} •{' '}
                                {property.lowestPriceRoom.capacity} Guests •{' '}
                                {property.lowestPriceRoom.size}m²
                              </p>
                            )}
                            <div className="p-3">
                              <span className="flex items-center gap-1">
                                <p className="text-primary bg-primary/10 px-2 py-1 rounded-xl text-xs font-semibold">
                                  {property.category.name}
                                </p>
                              </span>
                              <p className="font-semibold text-lg mt-1">{property.name}</p>
                              <div className="flex items-center mt-1 gap-1">
                                <FaMapMarkerAlt className="text-gray-400 text-sm" />
                                <p className="text-gray-400 text-sm">
                                  {property.city.name}
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
                                  <span className="font-semibold text-gray-700">
                                    8.9
                                  </span>
                                  /10
                                </div>
                                <div className="pt-2">(104 reviews)</div>
                              </div>
                              {property.lowestPriceRoom && (
                                <>
                                  <p className="text-primary font-bold text-lg mt-6">
                                    IDR{' '}
                                    {Number(
                                      property.lowestPriceRoom.base_price,
                                    ).toLocaleString('id-ID')}
                                  </p>
                                  <p className="text-gray-400 text-xs">
                                    not including tax and fees
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-60">
                  <div className="text-gray-500 text-center">
                    <p className="text-xl font-semibold">
                      No properties found.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
