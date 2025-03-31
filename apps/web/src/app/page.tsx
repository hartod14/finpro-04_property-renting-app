import Button from '@/components/common/button/button';
import Navbar from '@/components/common/navbar/navbar';
import Image from 'next/image';

export default function Home() {
  return (
    <div>
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
        <div className="relative h-full pt-40 px-48 mx-auto">
          <h1 className="mb-2 text-white text-3xl font-bold">
            <p className="tracking-wide">Find the right hotel today</p>
          </h1>
          <div className="bg-primary2 p-8 rounded-lg text-white">
            <div className="flex w-full">
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="name@flowbite.com"
                  required
                />
              </div>
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                  Guest and rooms
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
            <div className='text-end'>
              <Button
                color="primary"
                name="Search Hotel"
                textColor="white"
              ></Button>
            </div>
          </div>
        </div>
      </section>
      <div className="">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio labore
          eveniet est corporis fuga... Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Odio labore eveniet est corporis fuga... Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Odio labore eveniet est
          corporis fuga... Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Odio labore eveniet est corporis fuga... Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Odio labore eveniet est corporis
          fuga... Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
          labore eveniet est corporis fuga... Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Odio labore eveniet est corporis fuga...
          eveniet est corporis fuga... Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Odio labore eveniet est corporis fuga... Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Odio labore eveniet est
          corporis fuga... Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Odio labore eveniet est corporis fuga... eveniet est corporis
          fuga... Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
          labore eveniet est corporis fuga... Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Odio labore eveniet est corporis fuga...
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio labore
          eveniet est corporis fuga... eveniet est corporis fuga... Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Odio labore eveniet est
          corporis fuga... Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Odio labore eveniet est corporis fuga... Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Odio labore eveniet est corporis
          fuga... eveniet est corporis fuga... Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Odio labore eveniet est corporis fuga...
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio labore
          eveniet est corporis fuga... Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Odio labore eveniet est corporis fuga... eveniet est
          corporis fuga... Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Odio labore eveniet est corporis fuga... Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Odio labore eveniet est corporis
          fuga... Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
          labore eveniet est corporis fuga... eveniet est corporis fuga... Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Odio labore eveniet
          est corporis fuga... Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Odio labore eveniet est corporis fuga... Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Odio labore eveniet est
          corporis fuga... eveniet est corporis fuga... Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Odio labore eveniet est corporis
          fuga... Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
          labore eveniet est corporis fuga... Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Odio labore eveniet est corporis fuga...
          eveniet est corporis fuga... Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Odio labore eveniet est corporis fuga... Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Odio labore eveniet est
          corporis fuga... Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Odio labore eveniet est corporis fuga... eveniet est corporis
          fuga... Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
          labore eveniet est corporis fuga... Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Odio labore eveniet est corporis fuga...
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio labore
          eveniet est corporis fuga... eveniet est corporis fuga... Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Odio labore eveniet est
          corporis fuga... Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Odio labore eveniet est corporis fuga... Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Odio labore eveniet est corporis
          fuga... eveniet est corporis fuga... Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Odio labore eveniet est corporis fuga...
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio labore
          eveniet est corporis fuga... Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Odio labore eveniet est corporis fuga... eveniet est
          corporis fuga... Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Odio labore eveniet est corporis fuga... Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Odio labore eveniet est corporis
          fuga... Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
          labore eveniet est corporis fuga... eveniet est corporis fuga... Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Odio labore eveniet
          est corporis fuga... Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Odio labore eveniet est corporis fuga... Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Odio labore eveniet est
          corporis fuga... eveniet est corporis fuga... Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Odio labore eveniet est corporis
          fuga... Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
          labore eveniet est corporis fuga... Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Odio labore eveniet est corporis fuga...
          eveniet est corporis fuga... Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Odio labore eveniet est corporis fuga... Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Odio labore eveniet est
          corporis fuga... Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Odio labore eveniet est corporis fuga... eveniet est corporis
          fuga... Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
          labore eveniet est corporis fuga... Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Odio labore eveniet est corporis fuga...
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio labore
          eveniet est corporis fuga... eveniet est corporis fuga... Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Odio labore eveniet est
          corporis fuga... Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Odio labore eveniet est corporis fuga... Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Odio labore eveniet est corporis
          fuga... eveniet est corporis fuga... Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Odio labore eveniet est corporis fuga...
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio labore
          eveniet est corporis fuga... Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Odio labore eveniet est corporis fuga... eveniet est
          corporis fuga... Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Odio labore eveniet est corporis fuga... Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Odio labore eveniet est corporis
          fuga... Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
          labore eveniet est corporis fuga... eveniet est corporis fuga... Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Odio labore eveniet
          est corporis fuga... Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Odio labore eveniet est corporis fuga... Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Odio labore eveniet est
          corporis fuga... eveniet est corporis fuga... Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Odio labore eveniet est corporis
          fuga... Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
          labore eveniet est corporis fuga... Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Odio labore eveniet est corporis fuga...
          eveniet est corporis fuga... Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Odio labore eveniet est corporis fuga... Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Odio labore eveniet est
          corporis fuga... Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Odio labore eveniet est corporis fuga... Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Odio labore eveniet est corporis
          fuga... Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
          labore eveniet est corporis fuga... Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Odio labore eveniet est corporis fuga...
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio labore
          eveniet est corporis fuga... Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Odio labore eveniet est corporis fuga... Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Odio labore eveniet est
          corporis fuga... Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Odio labore eveniet est corporis fuga... Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Odio labore eveniet est corporis
          fuga... Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
          labore eveniet est corporis fuga...
        </p>
      </div>
    </div>
  );
}
