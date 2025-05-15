"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

const images = [
  { image: "/homepage/bestdeals/banner1.png" },
  { image: "/homepage/bestdeals/banner2.png" },
  { image: "/homepage/bestdeals/banner3.png" },
  { image: "/homepage/bestdeals/banner4.png" },
  { image: "/homepage/bestdeals/banner5.png" },
];

interface BestDealsCarouselProps {
  loading?: boolean;
}

export default function BestDealsCarousel({ loading = false }: BestDealsCarouselProps) {
  if (loading) {
    return (
      <div className="relative mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div 
              key={index} 
              className="bg-gray-200 animate-pulse h-52 rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="py-6">
            <Link href={"/"} className="flex justify-center">
              <Image
                width={720}
                height={720}
                src={image.image}
                alt={`Best-Deals-${index + 1}`}
                className="rounded-lg shadow-lg object-cover"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
