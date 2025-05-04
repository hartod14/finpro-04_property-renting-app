import Button from '@/components/common/button/button';
import Footer from '@/components/common/footer/footer';
import Navbar from '@/components/common/navbar/navbar';
import NavbarTenant from '@/components/common/navbar/navbarTenant';
import BestDealsCaraosel from '@/components/homepage/bestDealsCaraosel';
import HotelRecommendation from '@/components/homepage/hotelRecommendation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function TenantPage() {
  return (
    <>
      <NavbarTenant />
      <section className="bg-primary2 text-white pt-40 pb-24 px-6 md:px-20">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-5xl font-bold mb-4">
              List your <span className="text-primaryOrange">Property</span>
            </h1>
            <h1 className="text-5xl font-bold mb-8">On Stayza.com</h1>
            <p className="text-lg max-w-lg">
              Reach thousands of potential tenants looking for stays just like
              yours. Whether it's a cozy studio or a luxurious villa, Stayza
              helps you connect with the right guests—fast and effortlessly.
            </p>
          </div>

          <div className="lg:w-5/12">
            <div className="bg-white text-black p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Start Earning?
              </h2>
              <p className="mb-6">
                Join our growing community of hosts and start generating income
                from your space.
              </p>

              <ul className="mb-8 space-y-2">
                <li className="flex items-start">
                  <span className="text-primaryOrange font-bold mr-2">•</span>{' '}
                  No setup fees
                </li>
                <li className="flex items-start">
                  <span className="text-primaryOrange font-bold mr-2">•</span>{' '}
                  Easy property listing
                </li>
                <li className="flex items-start">
                  <span className="text-primaryOrange font-bold mr-2">•</span>{' '}
                  Full control over pricing & availability
                </li>
                <li className="flex items-start">
                  <span className="text-primaryOrange font-bold mr-2">•</span>{' '}
                  Trusted by a growing network of renters
                </li>
              </ul>

              <div className="flex">
                <Link href={'/auth/tenant/register'}>
                  <Button
                    name="Get Started now"
                    color="primaryOrange"
                    textColor="white"
                    icon={<FaArrowRight />}
                    iconPosition="after"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-20">
        <div className="container mx-auto">
          <h2 className="text-5xl font-bold text-center mb-20">Why Stayza?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 shrink-0">
                <Image
                  src="/homepage/tenant/puzzle.png"
                  alt="Wide Selection"
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Wide Selection of Properties
                </h3>
                <p className="text-gray-700">
                  From city apartments to beachfront villas—we've got stays that
                  suit every need and budget.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-24 h-24 shrink-0">
                <Image
                  src="/homepage/tenant/review.png"
                  alt="Verified Listings"
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Verified Listings Only
                </h3>
                <p className="text-gray-700">
                  Book with peace of mind. Every property is verified to ensure
                  a safe and quality stay.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-24 h-24 shrink-0">
                <Image
                  src="/homepage/tenant/search.png"
                  alt="Flexible Booking"
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Flexible Booking Options
                </h3>
                <p className="text-gray-700">
                  Daily, weekly, or monthly stays—choose what works for you.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-24 h-24 shrink-0">
                <Image
                  src="/homepage/tenant/247.png"
                  alt="24/7 Support"
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                <p className="text-gray-700">
                  Our team is here whenever you need help, day or night.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
