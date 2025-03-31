"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

const images = [
  { image: "/homepage/bannerhomepage.jpg" },
  { image: "/homepage/bannerhomepage.jpg" },
  { image: "/homepage/bannerhomepage.jpg" },
  { image: "/homepage/bannerhomepage.jpg" },
  { image: "/homepage/bannerhomepage.jpg" },
];

export default function BestDealsCaraosel() {
  return (
    <div>
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
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
            <div className="flex justify-center">
              <Image
                width={720}
                height={720}
                src={image.image}
                alt={`Best-Deals-${index + 1}`}
                className=" rounded-lg shadow-lg object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
