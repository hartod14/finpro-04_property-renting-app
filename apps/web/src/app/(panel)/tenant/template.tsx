'use client';

import Button from '@/components/common/button/button';
import Footer from '@/components/common/footer/footer';
import Navbar from '@/components/common/navbar/navbar';
import TenantSidebar from '@/components/common/sidebar/tenantSidebar';
import { forgetPassword, sendOnlyVerificationEmail } from '@/handlers/auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import Swal from 'sweetalert2';

type Props = {
  children: React.ReactNode;
};

export default function TenantPanelTemplate({ children }: Props) {
  return (
    <div className="bg-[#F4F7FE] px-4 md:px-8 pt-24 md:pt-28 pb-6 md:pb-10">
      <TenantSidebar>{children}</TenantSidebar>
    </div>
  );
}
