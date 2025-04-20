/** @format */

import Button from '@/components/common/button/button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

type Props = {
  children: React.ReactNode;
};

export default function AuthTemplate({ children }: Props) {
  return (
    <div className="bg-[url('/bromo.jpg')] bg-cover h-[100vh] bg-center">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-36 h-[100vh] py-8 mx-4 lg:mx-20">
        <div className="hidden lg:block">
          <Image
            alt="bromo"
            src="/logo_white.png"
            width={480}
            height={480}
            className="w-[200px] mb-4"
          />
          <p className="font-bold text-white text-4xl tracking-wide">
            Where Your Next Stay Begins.
          </p>
        </div>
        <div className="w-full max-w-lg">
          <Link href="/" className="text-white">
            <span className="inline-flex items-center gap-2">
              <FaArrowLeft /> Return to Homapage
            </span>
          </Link>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
