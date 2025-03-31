import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#1c2930] py-10 text-white">
      <div className="container mx-auto px-4 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Image
                alt="stayza"
                src={'/logo_white.png'}
                width={120}
                height={120}
              ></Image>
            </div>
            <div className='w-fit'>
              <h3 className="font-bold mb-5">Payment Partners</h3>
              <div className="grid grid-cols-3 gap-3 ">
                <Image
                  src="/footer/footer1.png"
                  alt="Partner 1"
                  width={80}
                  height={40}
                />
                <Image
                  src="/footer/footer2.png"
                  alt="Partner 1"
                  width={80}
                  height={40}
                />
                <Image
                  src="/footer/footer3.png"
                  alt="Partner 1"
                  width={80}
                  height={40}
                />
                <Image
                  src="/footer/footer4.png"
                  alt="Partner 1"
                  width={80}
                  height={40}
                />
                <Image
                  src="/footer/footer5.png"
                  alt="Partner 1"
                  width={80}
                  height={40}
                />
                <Image
                  src="/footer/footer6.png"
                  alt="Partner 1"
                  width={80}
                  height={40}
                />
                <Image
                  src="/footer/footer7.png"
                  alt="Partner 1"
                  width={80}
                  height={40}
                />
                <Image
                  src="/footer/footer8.png"
                  alt="Partner 1"
                  width={80}
                  height={40}
                />
                <Image
                  src="/footer/footer9.png"
                  alt="Partner 1"
                  width={80}
                  height={40}
                />
                <Image
                  src="/footer/footer10.png"
                  alt="Partner 1"
                  width={80}
                  height={40}
                />
              </div>
            </div>
          </div>
          <div className='mb-5'>
            <h3 className="font-bold mb-5">About Stayza</h3>
            <ul className="flex flex-col gap-6 text-sm text-gray-300">
              <li>How to Rent</li>
              <li>Contact Us</li>
              <li>Careers</li>
              <li>Press Room</li>
              <li>Stayza Blog</li>
              <li>Security</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>
          <div className='mb-5'>
            <h3 className="font-bold mb-5">Services</h3>
            <ul className="flex flex-col gap-6 text-sm text-gray-300">
              <li>Property Listings</li>
              <li>Short-Term Rentals</li>
              <li>Long-Term Rentals</li>
              <li>Property Management</li>
              <li>Tenant Screening</li>
              <li>Rental Insurance</li>
            </ul>
          </div>
          <div className='mb-5'>
            <h3 className="font-bold mb-5">Resources</h3>
            <ul className="flex flex-col gap-6 text-sm text-gray-300">
              <li>Stayza Affiliate</li>
              <li>Stayza Points</li>
              <li>List Your Property</li>
              <li>Advertise with Stayza</li>
              <li>Gift Cards</li>
            </ul>
          </div>
          <div className='mb-5'>
            <h3 className="font-bold mb-5">Follow Us On</h3>
            <div className="flex space-x-4 text-xl">
              <FaFacebook className="cursor-pointer" />
              <FaTwitter className="cursor-pointer" />
              <FaInstagram className="cursor-pointer" />
              <FaYoutube className="cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 text-center text-sm border-t border-gray-700 pt-6">
        &copy; {new Date().getFullYear()} Stayza. All rights reserved.
      </div>
    </footer>
  );
}
