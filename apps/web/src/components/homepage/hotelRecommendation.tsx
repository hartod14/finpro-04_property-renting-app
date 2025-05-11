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
  const { properties, loading, error, updateParams } = PropertyRecommendationModel({ limit: 8 });

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

  return (
    <div>
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
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-10">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-gray-100 animate-pulse h-64 rounded-lg"></div>
          ))}
        </div>
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
                className="bg-white border border-gray-200 shadow-lg rounded-lg w-[250px]"
              >
                <Link href={`/property/${property.slug}`} className="">
                  <figure>
                    <Image
                      src={property.image && property.image.path
                        ? property.image.path 
                        : '/homepage/kuta-bali.png'}
                      alt={property.name}
                      width={480}
                      height={240}
                      className="w-full h-40 object-cover rounded-t-lg brightness-95"
                    />
                  </figure>
                  <div className="">
                    <div className="p-2">
                      <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-xl mb-1">
                        {property.category.name}
                      </span>
                      <p className="font-semibold">{property.name}</p>
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
                          <span className="font-semibold text-gray-700">8.9</span>
                          /10
                        </div>
                        <div className="pt-2">(104 reviews)</div>
                      </div>
                      {property.lowestPrice && (
                        <>
                          {property.adjusted_price && property.adjusted_price !== property.lowestPrice ? (
                            <>
                              <p className="text-primary font-bold text-lg mt-5">
                                IDR {Number(property.adjusted_price).toLocaleString('id-ID')}
                              </p>
                              <p className="text-gray-400 text-xs">
                                not including tax and fees
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-primary font-bold text-lg mt-5">
                                IDR {Number(property.lowestPrice).toLocaleString('id-ID')}
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
          <Button color='primary' name='View all properties' textColor='white' />
        </Link>
      </div>
    </div>
  );
}
