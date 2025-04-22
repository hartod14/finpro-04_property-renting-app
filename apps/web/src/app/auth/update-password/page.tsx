/** @format */
'use client';

import { Alert, Snackbar } from '@mui/material';
import { useFormik } from 'formik';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { registerValidator } from '@/validators/auth.validator';
import { registerInit } from '@/helpers/formiks/formik.init';
import { useRouter, useSearchParams } from 'next/navigation';
import * as Yup from 'yup';
import {
  checkVerificationToken,
  updatePassword,
  verificationAndSetPassword,
} from '@/handlers/auth';
import Swal from 'sweetalert2';
import { verificationFormik } from '@/helpers/formiks/verification.formik';

export default function Page() {
  const [errMessage, setErrMessage] = React.useState('');
  const [userId, setUserId] = useState<number>();
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
            router.push('/auth/user/login');
          });
        } else {
          const userID = checkValidToken.data.id;
          setUserId(userID);
        }
      } catch (error) {
        Swal.fire({
          title: 'Oops...',
          text: 'Token invalid , please request new verification token',
          icon: 'error',
          confirmButtonColor: '#0194f3',
        }).then(() => {
          router.push('/auth/user/login');
        });
      }
    }
    fetchInvalidToken();
  }, []);

  const formik = useFormik({
    validationSchema: verificationFormik,
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      setErrMessage('');
      await updatePassword(String(token), values).then((res) => {
        if (res?.error) {
          setErrMessage(res.error);
        } else {
          Swal.fire({
            title: 'Success',
            text: 'Password set successfully',
            icon: 'success',
            confirmButtonColor: '#0194f3',
          }).then(() => {
            router.push('/auth/user/login');
          });
        }
      });
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <div className="mb-4">
          <h4 className="text-2xl font-bold mb-2 text-center">
            Set Your Password
          </h4>
        </div>
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <input
            type="password"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary"
            placeholder="Password"
            name="password"
            required
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          <p className="text-sm text-red-600">{formik.errors?.password}</p>
          <input
            type="password"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary"
            placeholder="Confirm Password"
            name="confirmPassword"
            required
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
          />
          <p className="text-sm text-red-600">
            {formik.errors.confirmPassword}
          </p>

          <p className="text-sm text-red-600">{errMessage}</p>
          <button
            className={`${
              !(formik.isValid && formik.dirty) || formik.isSubmitting
                ? 'bg-gray-300 text-gray-400'
                : 'bg-primary text-white'
            } font-semibold p-4 w-full rounded-full transition duration-300 hover:bg-primary-dark disabled:bg-gray-300`}
            disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Processing...' : 'Submit'}
          </button>
          <p className="text-center text-gray-500 text-sm">
            Your data will be protected and will not be shared
          </p>
        </form>
        <Snackbar
          open={open.current}
          autoHideDuration={1500}
          onClose={() => {
            open.current = false;
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
            Set Password Success
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
