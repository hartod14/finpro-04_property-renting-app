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
import { getAllProperty } from '@/handlers/property';
import { getAllCity } from '@/handlers/city';
import { ICity } from '@/interfaces/city.interface';
import { IProperty } from '@/interfaces/property.interface';


export default function HotelRecommendation() {
  const [cities, setCities] = useState<ICity[]>([]);
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const cityData = await getAllCity();
        setCities(cityData);
        
        // Set the first city as default selected
        if (cityData.length > 0) {
          setSelectedCityId(cityData[0].id);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  // Fetch properties when selected city changes
  useEffect(() => {
    const fetchProperties = async () => {
      if (!selectedCityId) return;
      
      setLoading(true);
      try {
        const filters = {
          cityID: [selectedCityId],
          limit: 8
        };
        
        const data = await getAllProperty(filters);
        setProperties(data.properties);
        console.log('Fetched properties:', data.properties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [selectedCityId]);

  const handleCityClick = (cityId: number) => {
    setSelectedCityId(cityId);
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
        <div className="flex justify-center py-10">
          <p>Loading properties...</p>
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
                <Link href={`/property/${property.id}`} className="">
                  <figure>
                    <Image
                      src={property.images && property.images.length > 0 && property.images[0].path
                        ? property.images[0].path 
                        : '/homepage/kuta-bali.png'}
                      alt={property.name}
                      width={480}
                      height={240}
                      className="w-full h-40 object-cover rounded-t-lg brightness-95"
                    />
                  </figure>
                  <div className="">
                    <p className="text-xs text-black bg-blue-50 py-1 px-2">
                      {property.lowestPriceRoom 
                        ? `${property.lowestPriceRoom.total_room} Room • ${property.lowestPriceRoom.capacity} Guests • ${property.lowestPriceRoom.size}m²` 
                        : '1 Room • 2 Guests'}
                    </p>
                    <div className="p-2">
                      <p className="text-gray-400 text-sm ">{property.category.name}</p>
                      <p className="font-semibold">{property.name}</p>
                      <p className="text-gray-400 text-sm">{property.city.name}</p>
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
                      <p className="text-primary font-bold text-lg mt-5">
                        {property.lowestPriceRoom 
                          ? `IDR ${Number(property.lowestPriceRoom.base_price).toLocaleString('id-ID')}` 
                          : 'Price unavailable'}
                      </p>
                      <p className="text-gray-400 text-xs">
                        not including tax and fees
                      </p>
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
