'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import Button from '../common/button/button';
import { useEffect, useState } from 'react';
import { getAllCity } from '@/handlers/city';
import { ICity } from '@/interfaces/city.interface';
import PropertyRecommendationModel from '@/models/property/propertyRecommendationModel';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function HotelRecommendation() {
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const { properties, loading, error, updateParams } =
    PropertyRecommendationModel({ limit: 8 });

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const cityData = await getAllCity();
        setCities(cityData);

        // Set the first city as default selected
        if (cityData.length > 0) {
          setSelectedCityId(cityData[0].id);
          updateParams({ cityID: [cityData[0].id] });
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  const handleCityClick = (cityId: number) => {
    setSelectedCityId(cityId);
    updateParams({ cityID: [cityId] });
  };

  // City tabs skeleton
  const CityTabsSkeleton = () => (
    <div className="mb-3 flex flex-wrap gap-3">
      {[...Array(5)].map((_, index) => (
        <div 
          key={index} 
          className="h-8 w-20 bg-gray-200 animate-pulse rounded-full"
        ></div>
      ))}
    </div>
  );

  // Hotel card skeleton
  const HotelCardsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-10">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="bg-white border border-gray-100 shadow-lg rounded-lg h-[380px] animate-pulse"
        >
          <div className="w-full h-40 bg-gray-200 rounded-t-lg"></div>
          <div className="p-3">
            <div className="h-6 w-20 bg-gray-200 rounded-md mb-3"></div>
            <div className="h-5 w-full bg-gray-200 rounded-md mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded-md mb-4"></div>
            <div className="h-4 w-24 bg-gray-200 rounded-md mb-4"></div>
            <div className="mt-6 h-7 w-32 bg-gray-200 rounded-md"></div>
            <div className="mt-2 h-3 w-36 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {cities.length === 0 ? (
        <CityTabsSkeleton />
      ) : (
        <div className="mb-3">
          <ul className="flex flex-wrap gap-3 text-sm font-medium text-center text-gray-500 ">
            {cities.map((city) => (
              <li key={city.id}>
                <button
                  onClick={() => handleCityClick(city.id)}
                  className={`inline-block px-3 py-2 rounded-full border ${
                    selectedCityId === city.id
                      ? 'text-primary border-primary bg-blue-100'
                      : 'border-gray-100 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {city.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading ? (
        <HotelCardsSkeleton />
      ) : (
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          breakpoints={{
            420: { slidesPerView: 1.5 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 4.5 },
          }}
          className="hotel-carousel"
          style={{ padding: '0 0 20px 0' }}
        >
          {properties.length > 0 ? (
            properties.map((property) => (
              <SwiperSlide
                key={property.id}
                className="bg-white border border-gray-200 shadow-lg rounded-lg w-[250px] h-[380px] flex flex-col"
              >
                <Link
                  href={`/property/${property.slug}`}
                  className="flex flex-col h-[380px]"
                >
                  <figure>
                    <Image
                      src={
                        property.image && property.image.path
                          ? property.image.path
                          : '/homepage/kuta-bali.png'
                      }
                      alt={property.name}
                      width={480}
                      height={240}
                      className="w-full h-40 object-cover rounded-t-lg brightness-95"
                    />
                  </figure>
                  <div className="flex flex-col flex-grow">
                    <div className="p-3 flex flex-col h-full">
                      <div>
                        <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-xl mb-1">
                          {property.category.name}
                        </span>
                      </div>
                      <p className="font-semibold line-clamp-2">
                        {property.name}
                      </p>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <FaMapMarkerAlt className="mr-1" />
                        <span>{property.city.name}</span>
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
                          {property?.reviews && property?.reviews.length > 0 ? (
                            <>
                              <span className="font-semibold text-gray-700">
                                {(
                                  property.reviews.reduce(
                                    (acc, review) => acc + review.rating,
                                    0,
                                  ) / property.reviews.length
                                ).toFixed(1)}
                              </span>
                              /5
                            </>
                          ) : (
                            <span className="font-semibold text-gray-700">
                              No ratings yet
                            </span>
                          )}
                        </div>
                        {property?.reviews && property?.reviews.length > 0 && (
                          <div className="pt-2">
                            {`(${property.reviews.length} ${
                              property.reviews.length == 1
                                ? 'review'
                                : 'reviews'
                            })`}
                          </div>
                        )}
                      </div>
                      <div className="mt-auto">
                        {property.lowestPrice && (
                          <>
                            {property.adjusted_price &&
                            property.adjusted_price !== property.lowestPrice ? (
                              <>
                                <p className="text-primary font-bold text-lg mt-3">
                                  IDR{' '}
                                  {Number(
                                    property.adjusted_price,
                                  ).toLocaleString('id-ID')}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  not including tax and fees
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-primary font-bold text-lg mt-3">
                                  IDR{' '}
                                  {Number(property.lowestPrice).toLocaleString(
                                    'id-ID',
                                  )}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  not including tax and fees
                                </p>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide className="flex justify-center items-center bg-white border border-gray-200 p-8 rounded-lg">
              <p>No properties found for this city.</p>
            </SwiperSlide>
          )}
        </Swiper>
      )}

      <div>
        <Link href={'/property'} className="flex justify-center mt-3">
          <Button
            color="primary"
            name="View all properties"
            textColor="white"
          />
        </Link>
      </div>
    </div>
  );
}
