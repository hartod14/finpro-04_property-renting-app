'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import Button from '../common/button/button';

export default function HotelRecommendation() {
  return (
    <div>
      <div className="mb-3">
        <ul className="flex flex-wrap gap-3 text-sm font-medium text-center text-gray-500 ">
          <li>
            <a
              href="#"
              className="inline-block px-3 py-2 text-primary border border-primary bg-blue-100 rounded-full active"
              aria-current="page"
            >
              Bali
            </a>
          </li>
          <li>
            <a
              href="#"
              className="inline-block px-3 py-2 rounded-full border border-gray-100 hover:text-gray-900 hover:bg-gray-100 "
            >
              Jakarta
            </a>
          </li>
          <li>
            <a
              href="#"
              className="inline-block px-3 py-2 rounded-full border border-gray-100 hover:text-gray-900 hover:bg-gray-100 "
            >
              Bandung
            </a>
          </li>
        </ul>
      </div>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1} // Allows partial slides to be visible
        // centeredSlides={true} // Centers the active slide
        navigation
        // pagination={{ clickable: true }}
        breakpoints={{
          420: { slidesPerView: 1.5 },
        //   640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 4.5 },
        }}
        className="hotel-carousel"
        style={{ padding: '0 0 20px 0' }}
      >
        {[1, 2, 3, 4, 5].map((key) => (
          <SwiperSlide
            key={key}
            className="bg-white border border-gray-200 shadow-lg rounded-lg w-[250px]"
          >
            <Link href={'#'} className="">
              <figure>
                <Image
                  src={'/homepage/kuta-bali.png'}
                  alt={'test1'}
                  width={480}
                  height={240}
                  className="w-full h-40 object-cover rounded-t-lg brightness-95"
                />
              </figure>
              <div className="">
                <p className="text-xs text-black bg-blue-50 py-1 px-2">
                  1 Room • 4 Guests • 275.0m²
                </p>
                <div className="p-2">
                  <p className="text-gray-400 text-sm ">Villa</p>
                  <p className="font-semibold">Pradha Villas Seminyak</p>
                  <p className="text-gray-400 text-sm">Seminyak, Badung</p>
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
                    IDR 2.300.000
                  </p>
                  <p className="text-gray-400 text-xs">
                    not including tax and fees
                  </p>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <div>
        <Link href={'#'} className="flex justify-center mt-3">
          <Button color='primary' name='Look all' textColor='white' ></Button>
        </Link>
      </div>
    </div>
  );
}
