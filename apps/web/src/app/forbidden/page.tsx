'use client';

import React from 'react';
import Navbar from '@/components/common/navbar/navbar';
import Footer from '@/components/common/footer/footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import Button from '@/components/common/button/button';

export default function ForbiddenPage() {
  return (
    <>
      <Navbar forceScrolled={true} />
      <div className="min-h-screen pt-28 pb-10 bg-[#FDFDFE] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
          <p className="text-xl font-semibold text-red-500 mb-6">
            Access Forbidden
          </p>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this resource. This might be
            because you don't own this property or lack the necessary
            permissions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tenant">
              <Button
                color="primary"
                textColor="white"
                name="Back"
                icon={<FaArrowLeft />}
                iconPosition="before"
              />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
