'use client';

import { Alert, Snackbar } from '@mui/material';
import { useFormik } from 'formik';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as Yup from 'yup';
import {
  checkVerificationToken,
  updateStatusVerification,
  verificationAndSetPassword,
} from '@/handlers/auth';
import Swal from 'sweetalert2';
import { verificationFormik } from '@/helpers/formiks/verification.formik';

export default function VerificationStatusPage() {
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
}
