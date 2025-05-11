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
import PropertySkeleton from '@/components/property/propertySkeleton';
import Footer from '@/components/common/footer/footer';
import { PaginationTable } from '@/components/common/pagination/propertyPagination';
import PropertyPageSkeleton from '@/components/property/propertyPageSkeleton';
import ErrorPage from '@/components/common/error/errorPage';

// Helper function to format dates for URL consistently
const formatDateForUrl = (date: Date): string => {
  if (!date) return '';
  
  // Normalize the date to avoid timezone issues
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  
  // Return ISO string format for consistent parsing
  return normalizedDate.toISOString();
};

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
    selectedCategoryNames,
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
    handleDateRangePickerChange,
    setOpenFilters,
    // Pagination props
    page,
    setPage,
    limit,
    setLimit,
    totalItems,
    totalPages,
  } = PropertyModel();

  if (loading) {
    return <PropertyPageSkeleton />;
  }

  if (error) {
    return (
      <ErrorPage message={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <>
      <Navbar forceScrolled={true} />
      <div className="lg:mx-24 py-6 px-4 bg-[#FDFDFE] text-black">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row mb-8 pt-24">
          <div className="w-full md:w-1/3 p-3 md:rounded-l-lg flex items-center border-2 border-b-0 md:border-b-2 border-primary md:border-r-0  bg-white">
            <div className="w-8 h-8 bg-gray-100 rounded-full mr-2 flex items-center justify-center text-primary">
              <FaSearch size={14} />
            </div>
            <input
              type="text"
              placeholder="Search location, property..."
              className="w-full outline-none text-gray-700 bg-transparent"
              value={searchTerm}
              onChange={(e) => handleSearchTermChange(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 p-3 flex items-center border-2 border-b-0 md:border-b-2 border-primary md:border-r-0 bg-white">
            <DateRangePicker
              startDate={dateRange.from ? new Date(dateRange.from) : null}
              endDate={dateRange.to ? new Date(dateRange.to) : null}
              onChange={handleDateRangePickerChange}
              startDatePlaceholder="Start Date"
              endDatePlaceholder="End Date"
            />
          </div>
          <div className="w-full md:w-1/4 p-3 flex items-center border-2 border-primary bg-white relative">
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
            className="w-full md:w-1/6 md:rounded-r-lg bg-primary text-white p-3 hover:bg-primary/90 transition-colors"
            onClick={() => {
              handleSearch();
            }}
          >
            <div className="flex gap-2 items-center justify-center">
              <FaSearch size={18} /> <span>Search Hotel</span>
            </div>
          </button>
        </div>

        {/* Add global styles for datepicker and select dropdown */}
        <style jsx global>{``}</style>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row">
          {/* Mobile Filter Buttons */}
          <div className="md:hidden w-full mb-6">
            <div className="grid grid-cols-2 gap-2">
              {/* Category Button */}
              <button
                data-filter-button="category"
                onClick={() => toggleFilter('category')}
                className={`flex items-center justify-between border rounded p-3 ${openFilters.category ? 'bg-blue-50 border-blue-300' : 'bg-white'} shadow-sm`}
              >
                <div className="flex items-center">
                  <FaHotel
                    className={`${openFilters.category ? 'text-blue-500' : 'text-gray-500'} mr-2`}
                    size={18}
                  />
                  <span
                    className={`font-medium ${openFilters.category ? 'text-blue-600' : 'text-gray-700'}`}
                  >
                    Category
                  </span>
                </div>
                {selectedCategoryNames.length > 0 && (
                  <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
                    {selectedCategoryNames.length}
                  </span>
                )}
              </button>

              {/* Tenant Button */}
              <button
                data-filter-button="propertyName"
                onClick={() => toggleFilter('propertyName')}
                className={`flex items-center justify-between border rounded p-3 ${openFilters.propertyName ? 'bg-blue-50 border-blue-300' : 'bg-white'} shadow-sm`}
              >
                <div className="flex items-center">
                  <FaBuilding
                    className={`${openFilters.propertyName ? 'text-blue-500' : 'text-gray-500'} mr-2`}
                    size={18}
                  />
                  <span
                    className={`font-medium ${openFilters.propertyName ? 'text-blue-600' : 'text-gray-700'}`}
                  >
                    Tenant
                  </span>
                </div>
                {selectedTenants.length > 0 && (
                  <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
                    {selectedTenants.length}
                  </span>
                )}
              </button>

              {/* Facility Button */}
              <button
                data-filter-button="facility"
                onClick={() => toggleFilter('facility')}
                className={`flex items-center justify-between border rounded p-3 ${openFilters.facility ? 'bg-blue-50 border-blue-300' : 'bg-white'} shadow-sm`}
              >
                <div className="flex items-center">
                  <FaSwimmingPool
                    className={`${openFilters.facility ? 'text-blue-500' : 'text-gray-500'} mr-2`}
                    size={18}
                  />
                  <span
                    className={`font-medium ${openFilters.facility ? 'text-blue-600' : 'text-gray-700'}`}
                  >
                    Facility
                  </span>
                </div>
                {selectedFacilities.length > 0 && (
                  <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
                    {selectedFacilities.length}
                  </span>
                )}
              </button>

              {/* City Button */}
              <button
                data-filter-button="city"
                onClick={() => toggleFilter('city')}
                className={`flex items-center justify-between border rounded p-3 ${openFilters.city ? 'bg-blue-50 border-blue-300' : 'bg-white'} shadow-sm`}
              >
                <div className="flex items-center">
                  <FaCity
                    className={`${openFilters.city ? 'text-blue-500' : 'text-gray-500'} mr-2`}
                    size={18}
                  />
                  <span
                    className={`font-medium ${openFilters.city ? 'text-blue-600' : 'text-gray-700'}`}
                  >
                    Popular City
                  </span>
                </div>
                {selectedCities.length > 0 && (
                  <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
                    {selectedCities.length}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Filter Sections */}
            {/* Category Section - Mobile */}
            <div
              data-filter-section="category"
              className={`${openFilters.category ? 'block' : 'hidden'} border rounded p-4 mt-2 mb-4 bg-white shadow-sm transition-all duration-300`}
            >
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li
                    key={`m-category-${category.id}`}
                    className="flex items-center hover:text-blue-600 cursor-pointer"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div
                      className={`w-5 h-5 border rounded flex items-center justify-center mr-2 ${selectedCategoryNames.includes(category.name) ? 'bg-primary border-primary' : 'border-gray-300'}`}
                    >
                      {selectedCategoryNames.includes(category.name) && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                    <span
                      className={
                        selectedCategoryNames.includes(category.name)
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
              data-filter-section="propertyName"
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
              data-filter-section="facility"
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
              data-filter-section="city"
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
                {selectedCategoryNames.length > 0 && (
                  <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
                    {selectedCategoryNames.length}
                  </span>
                )}
              </h2>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li
                    key={`category-${category.id}`}
                    className="flex items-center hover:text-blue-600 cursor-pointer"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div
                      className={`w-5 h-5 border rounded flex items-center justify-center mr-2 ${selectedCategoryNames.includes(category.name) ? 'bg-primary border-primary' : 'border-gray-300'}`}
                    >
                      {selectedCategoryNames.includes(category.name) && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                    <span
                      className={
                        selectedCategoryNames.includes(category.name)
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
                Popular City
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
                  <Link
                    key={`property-${property.id}`}
                    href={`/property/${property.slug}${
                      dateRange.from || dateRange.to || searchAdults
                        ? `?${dateRange.from ? `startDate=${formatDateForUrl(dateRange.from)}` : ''}${
                            dateRange.to ? `${dateRange.from ? '&' : ''}endDate=${formatDateForUrl(dateRange.to)}` : ''
                          }${
                            searchAdults
                              ? `${dateRange.from || dateRange.to ? '&' : ''}adults=${searchAdults}&capacity=${searchAdults}`
                              : ''
                          }`
                        : ''
                    }`}
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
                        <div className="block">
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
                              <p className="font-semibold text-lg mt-1">
                                {property.name}
                              </p>
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
                        </div>
                      </div>
                    </div>
                  </Link>
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

            {/* Pagination */}
            {properties.length > 0 && (
              <div className="mt-8">
                <PaginationTable
                  page={page}
                  setPage={setPage}
                  limit={limit}
                  setLimit={setLimit}
                  total={totalItems}
                  totalPage={totalPages}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
