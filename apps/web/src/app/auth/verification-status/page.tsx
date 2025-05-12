/** @format */
'use client';

import { Alert, Snackbar } from '@mui/material';
import { useFormik } from 'formik';
import Link from 'next/link';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as Yup from 'yup';
import {
  checkVerificationToken,
  updateStatusVerification,
  verificationAndSetPassword,
} from '@/handlers/auth';
import Swal from 'sweetalert2';
import { verificationFormik } from '@/helpers/formiks/verification.formik';

function VerificationStatusContent() {
  const [errMessage, setErrMessage] = React.useState('');
  const open = useRef(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    async function fetchInvalidToken() {
      try {
        const checkValidToken = await checkVerificationToken(String(token));
        if (checkValidToken == 'token invalid') {
          Swal.fire({
            title: 'Oops...',
            text: 'Token invalid , please request new verification token',
            icon: 'error',
            confirmButtonColor: '#0194f3',
          }).then(() => {
            router.push('/');
          });
        } else {
          Swal.fire({
            title: 'Success',
            text: 'Account verified successfully',
            icon: 'success',
            confirmButtonColor: '#0194f3',
          }).then(async () => {
            try {
              await updateStatusVerification(String(token));
            } catch (error) {
              alert(error);
            }
            router.push('/');
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Oops...',
          text: 'Token invalid , please request new verification token',
          icon: 'error',
          confirmButtonColor: '#0194f3',
        }).then(() => {
          router.push('/');
        });
      }
    }
    fetchInvalidToken();
  }, []);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg text-center">
        <div className="mb-4">
          <h4 className="text-2xl font-bold mb-2">Verifying your account...</h4>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg text-center">
        <div className="mb-4">
          <h4 className="text-2xl font-bold mb-2">Loading...</h4>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <VerificationStatusContent />
    </Suspense>
  );
}
