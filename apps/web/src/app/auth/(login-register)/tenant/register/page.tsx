/** @format */
'use client';
import { Alert, Snackbar } from '@mui/material';
import { useFormik } from 'formik';
import Link from 'next/link';
import React, { useRef } from 'react';
import { registerValidator } from '@/validators/auth.validator';
import { register, resendVerificationEmail } from '@/handlers/auth';
import { useRouter } from 'next/navigation';
import { registerInit } from '@/helpers/formiks/formik.init';
import Google from 'next-auth/providers/google';
import Image from 'next/image';
import FacebookImage from '@/../public/facebook.png';
import GoogleImage from '@/../public/google.png';
import Swal from 'sweetalert2';
import { googleLogin } from '@/app/action/auth';

export default function RegisterPage() {
  const [errMessage, setErrMessage] = React.useState('');
  const open = useRef(false);
  const router = useRouter();

  const formik = useFormik({
    validationSchema: registerValidator,
    initialValues: { ...registerInit, role: 'TENANT' },
    onSubmit: async (values) => {
      setErrMessage('');
      await register(values).then((res) => {
        if (res?.error) {
          if (res.error == 'email already used') {
            setErrMessage(res.error);
          } else if (
            res.error == 'email already registered, but not verified'
          ) {
            Swal.fire({
              title: 'Registration Failed',
              text: 'It seems you have already registered, but not verified your email, please check your email for verification or click Resend below to resend verification email',
              icon: 'warning',
              confirmButtonColor: '#0194f3',
              confirmButtonText: 'Resend Verification',
              showCancelButton: true,
            }).then(async (result) => {
              if (result.isConfirmed) {
                try {
                  await resendVerificationEmail(values.email);
                  Swal.fire({
                    title: 'Verification Email Sent',
                    text: 'Please check your email for verification',
                    confirmButtonColor: '#0194f3',
                  });
                } catch (error) {
                  Swal.fire({
                    title: 'Verification Email Failed',
                    text: 'Please try again',
                    icon: 'error',
                    confirmButtonColor: '#0194f3',
                  });
                }
              }
            });
          }
        } else {
          Swal.fire({
            title: 'Registration Success',
            text: 'Please check your email for verification',
            icon: 'success',
            confirmButtonColor: '#0194f3',
          }).then(() => {
            router.push('/auth/tenant/login');
          });
        }
      });
    },
  });

  return (
    <div>
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg border-2 border-gray-200">
        <div className="mb-6 text-center">
          <h4 className="text-2xl font-bold mb-2">Register</h4>
          <p className="text-gray-600">
            {'Already have an account? '}
            <Link
              href={'/auth/tenant/login'}
              className="text-primaryOrange font-semibold"
            >
              Sign in here
            </Link>
          </p>
        </div>
        <form className="space-y-3" onSubmit={formik.handleSubmit}>
          <input
            type="email"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primaryOrange"
            placeholder="Email Address"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          <p className="text-sm text-red-600">{errMessage}</p>
          <p className="text-xs text-gray-600">
            {"By registering, I agree to Eventic's "}
            <span className="text-primaryOrange">Terms and Conditions</span>
            {' and '}
            <span className="text-primaryOrange">Privacy Policy</span>
          </p>
          <button
            className={`${
              !(formik.isValid && formik.dirty) || formik.isSubmitting
                ? 'bg-gray-300 text-gray-400'
                : 'bg-primaryOrange text-white'
            } font-semibold p-4 w-full rounded-md transition duration-300 hover:bg-primaryOrange/80 disabled:bg-gray-300`}
            disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Processing...' : 'Register'}
          </button>
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
            Register Success
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
