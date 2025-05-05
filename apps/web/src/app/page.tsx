'use client';

import Button from '@/components/common/button/button';
import Footer from '@/components/common/footer/footer';
import Navbar from '@/components/common/navbar/navbar';
import BestDealsCaraosel from '@/components/homepage/bestDealsCaraosel';
import HotelRecommendation from '@/components/homepage/hotelRecommendation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaSearch, FaUser } from 'react-icons/fa';
import { DateRangePicker } from '@/components/ui/calendar';
import HomeModel from '@/models/homepage/homeModel';
import { useEffect } from 'react';

export default function Home() {
  const {
    searchTerm,
    dateRange,
    searchAdults,
    handleSearchTermChange,
    handleDateRangeChange,
    handleAdultsChange,
    handleSearch,
    handleDateRangePickerChange,
  } = HomeModel();

  // Setup click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle guest dropdown
      const guestDropdown = document.getElementById('homeGuestDropdown');
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
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <Navbar />
      <section className="relative h-[520px]">
        <div className="absolute w-full h-full z-auto">
          <Image
            src="/homepage/bannerhomepage.jpg"
            width={1440}
            height={638}
            className="w-full h-full object-cover brightness-50"
            alt="homepage"
          />
        </div>
        <div className="relative h-full pt-24 md:pt-32 sm:px-12 md:px-20 lg:px-30">
          <h1 className="mb-2 text-white text-center sm:text-left text-md sm:text-3xl font-bold">
            <p className="tracking-wide ps-6 sm:ps-0">
              Find the right hotel today
            </p>
          </h1>
          <div className="bg-primary2 p-4 sm:p-8 rounded-lg text-white">
            <div className="lg:flex w-full">
              <div className="mb-5 flex-auto lg:w-1/2">
                <label
                  htmlFor="search-term"
                  className="block mb-2 font-medium"
                >
                  Where do you want to stay?
                </label>
                <div id="search-container" className="flex items-center w-full  bg-gray-50 border border-gray-300 px-3 py-[14px] rounded-lg lg:rounded-r-none">
                  <div className="w-8 h-8 bg-gray-100 rounded-full mr-2 flex items-center justify-center text-primary">
                    <FaSearch size={14} />
                  </div>
                  <input
                    type="text"
                    id="search-term"
                    className="border-2 bg-gray-50 text-gray-900 text shadow-none w-full"
                    placeholder="Search location, property..."
                    value={searchTerm}
                    onChange={(e) => handleSearchTermChange(e.target.value)}
                    style={{ outline: 'none', boxShadow: 'none' }}
                  />
                </div>
              </div>
              <div className="sm:flex grow-8 lg:w-1/2">
                <div className="mb-5 flex-auto">
                  <label
                    htmlFor="check-in"
                    className="block mb-2 font-medium"
                  >
                    Check-in & check-out
                  </label>
                  <div className="bg-gray-50 border border-gray-300 text-gray-900 rounded-r-lg sm:rounded-r-none rounded-l-lg lg:rounded-none focus:outline-none focus:ring-0 focus:border-gray-300 block w-full p-2.5 cursor-pointer">
                    <DateRangePicker
                      startDate={
                        dateRange.from ? new Date(dateRange.from) : null
                      }
                      endDate={dateRange.to ? new Date(dateRange.to) : null}
                      onChange={handleDateRangePickerChange}
                      startDatePlaceholder="Check-in"
                      endDatePlaceholder="Check-out"
                      className="focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <div className="mb-5 flex-auto">
                  <label
                    htmlFor="guest-room"
                    className="block mb-2 font-medium"
                  >
                    Guest & rooms
                  </label>
                  <div className="relative bg-gray-50 border border-gray-300 text-gray-900 rounded-l-lg sm:rounded-l-none rounded-r-lg focus:outline-none focus:ring-0 focus:border-gray-300 block w-full px-3 py-[14px]">
                    <button
                      id="guestButton"
                      className="w-full flex items-center justify-between text-gray-700 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                      onClick={() => {
                        const dropdown =
                          document.getElementById('homeGuestDropdown');
                        if (dropdown) {
                          dropdown.classList.toggle('hidden');
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full mr-2 flex items-center justify-center text-primary">
                          <FaUser size={14} />
                        </div>
                        <span>
                          {searchAdults
                            ? `${searchAdults} ${Number(searchAdults) == 1 ? 'Person' : 'People'}`
                            : 'Number of people'}
                        </span>
                      </div>
                    </button>

                    {/* Dropdown menu */}
                    <div
                      id="homeGuestDropdown"
                      className="hidden absolute top-full left-0 right-0 mt-1 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-full"
                    >
                      <ul className="py-2 text-gray-700">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <li key={num}>
                            <button
                              onClick={() => {
                                handleAdultsChange(num.toString());
                                const dropdown =
                                  document.getElementById('homeGuestDropdown');
                                if (dropdown) {
                                  dropdown.classList.add('hidden');
                                }
                              }}
                              className={`block w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${searchAdults === num.toString() ? 'bg-blue-50 text-primary' : ''}`}
                            >
                              {num} {num == 1 ? 'Person' : 'People'}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end w-full">
              <button onClick={handleSearch} className="focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0">
                <Button
                  color="primary"
                  textColor="white"
                  iconPosition="after"
                  name="Search Hotel"
                  icon={<FaArrowRight />}
                />
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="px-6 md:px-24 py-12">
        <div className="flex items-center gap-2">
          <Image
            src={'/homepage/discount_icon.png'}
            width={32}
            height={32}
            alt="discount_icon"
          />
          <h1 className="font-bold text-xl">Best deals for you</h1>
        </div>
        <BestDealsCaraosel />
      </section>
      <section className="px-6 md:px-24">
        <div className="mb-2">
          <h1 className="font-bold text-xl mb-2">
            Hotels based on popular destination
          </h1>
          <h3 className="font-light text-sm">
            Your next adventure may be closer than you think. Discover hotels
            just beyond your doorstep.
          </h3>
        </div>
        <HotelRecommendation />
      </section>
      <section className="px-6 md:px-24 py-12">
        <h1 className="font-bold text-xl mb-3">Why book with Stayza?</h1>
        <div className="lg:flex gap-5 w-full">
          <div className="flex gap-2 w-full items-center bg-white shadow-lg border border-gray-200 p-4 rounded-lg mb-4">
            <Image
              alt="reasons"
              src={'/homepage/reasons/reason1.png'}
              width={48}
              height={48}
              className="w-[48px] h-[48px]"
            />
            <div>
              <h1 className="font-semibold text-lg mb-2">
                Convenience at Your Fingertips
              </h1>
              <p className="text-sm text-gray-600">
                Easily browse and book properties with our user-friendly
                platform, designed to make your rental experience seamless.
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full items-center bg-white shadow-lg border border-gray-200 p-4 rounded-lg mb-4">
            <Image
              alt="reasons"
              src={'/homepage/reasons/reason2.png'}
              width={48}
              height={48}
              className="w-[48px] h-[48px]"
            />
            <div>
              <h1 className="font-semibold text-lg mb-2">Affordable Options</h1>
              <p className="text-sm text-gray-600">
                Find properties that fit your budget, from cozy apartments to
                luxurious villas, all at competitive prices.
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full items-center bg-white shadow-lg border border-gray-200 p-4 rounded-lg mb-4">
            <Image
              alt="reasons"
              src={'/homepage/reasons/reason3.png'}
              width={48}
              height={48}
              className="w-[48px] h-[48px]"
            />
            <div>
              <h1 className="font-semibold text-lg mb-2">
                Wide Variety of Properties
              </h1>
              <p className="text-sm text-gray-600">
                Choose from a diverse range of properties, including apartments,
                houses, and vacation rentals, tailored to your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
