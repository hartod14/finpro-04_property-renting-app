import Button from '@/components/common/button/button';
import Footer from '@/components/common/footer/footer';
import Navbar from '@/components/common/navbar/navbar';
import BestDealsCaraosel from '@/components/homepage/bestDealsCaraosel';
import HotelRecommendation from '@/components/homepage/hotelRecommendation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function Home() {
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
        <div className="relative h-full pt-40 sm:px-12 md:px-24 lg:px-32 mx-auto">
          <h1 className="mb-2 text-white text-3xl font-bold">
            <p className="tracking-wide ps-6 sm:ps-0">
              Find the right hotel today
            </p>
          </h1>
          <div className="bg-primary2 p-8 rounded-lg text-white">
            <div className="lg:flex w-full">
              <div className="mb-5 flex-1">
                <label
                  htmlFor="name"
                  className="block mb-2 text-xs font-medium"
                >
                  Where do you want to stay?
                </label>
                <input
                  type="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg lg:rounded-r-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="name@flowbite.com"
                  required
                />
              </div>
              <div className="flex">
                <div className="mb-5 flex-1">
                  <label
                    htmlFor="check-in"
                    className="block mb-2 text-xs font-medium"
                  >
                    Check-in
                  </label>
                  <input
                    type="check-in"
                    id="check-in"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-l-lg lg:rounded-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="name@flowbite.com"
                    required
                  />
                </div>
                <div className="mb-5 flex-1">
                  <label
                    htmlFor="check-out"
                    className="block mb-2 text-xs font-medium"
                  >
                    Check-out
                  </label>
                  <input
                    type="check-out"
                    id="check-out"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="name@flowbite.com"
                    required
                  />
                </div>
                <div className="mb-5 flex-1">
                  <label
                    htmlFor="guest-room"
                    className="block mb-2 text-xs font-medium"
                  >
                    Guest & rooms
                  </label>
                  <input
                    type="guest-room"
                    id="guest-room"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="name@flowbite.com"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end w-full">
              <Button
                color="primary"
                textColor="white"
                iconPosition="after"
                name="Search Hotel"
                icon={<FaArrowRight />}
              />
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
            Hotels in your home country
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
