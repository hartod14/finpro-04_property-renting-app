'use client';

import Button from '@/components/common/button/button';
import Footer from '@/components/common/footer/footer';
import Navbar from '@/components/common/navbar/navbar';
import UserSidebar from '@/components/common/sidebar/userSidebar';
import { forgetPassword, sendOnlyVerificationEmail } from '@/handlers/auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import Swal from 'sweetalert2';

type Props = {
  children: React.ReactNode;
};

export default function UserPanelTemplate({ children }: Props) {
  const { data: session } = useSession();

  const handleResendVerificationEmail = async (email: string) => {
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Email is required to reset the password!',
      });
      return;
    }

    Swal.fire({
      title: 'Verification Confirmation',
      text: 'A verification email will be sent to your registered email address.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#ABABAB',
      confirmButtonText: 'Yes, send email!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // loading?.setLoading(true);
          const res: any = await sendOnlyVerificationEmail(email);

          if (res?.error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text:
                res.error || 'Something went wrong, please try again later!',
            });
          } else {
            Swal.fire({
              title: 'Email Sent!',
              text: 'Check your email for verification instructions.',
              icon: 'success',
              confirmButtonColor: '#3085d6',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong, please try again later!',
          });
        } finally {
          // loading?.setLoading(false);
        }
      }
    });
  };

  return (
    <div className="bg-[#F4F7FE] min-h-screen">
      <Navbar forceScrolled={true} />
      <div className="pt-24">
        {/* Email Verification Alert */}

        <div className="container mx-auto px-4 pt-8 pb-24">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-1/4">
              <UserSidebar />
            </div>
            <div className="w-full md:w-3/4">
              <div
                className={`bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 ${session?.user?.is_verified && 'hidden'} `}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-amber-400 mt-1">
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-amber-800">
                      Your account haven't been verified.
                    </h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>
                        Please check your email or click button below to resend
                        verification to your email
                      </p>
                    </div>
                    <div className="mt-4">
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleResendVerificationEmail(
                            String(session?.user?.email),
                          );
                        }}
                      >
                        <button>
                          <Button
                            color="primary"
                            textColor="white"
                            name="Resend Email"
                          />
                        </button>
                      </Link>
                      <span className="text-xs text-amber-600 ml-2"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
