/** @format */
'use client';
import { useFormik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import { facebookLogin, googleLogin, login } from '@/app/action/auth';
import GoogleImage from '@/../public/google.png';
import FacebookImage from '@/../public/facebook.png';

export default function LoginPage() {
  const { push } = useRouter();
  const open = useRef(false);
  const [errMessage, setErrMessage] = React.useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      setErrMessage('');
      await login(values).then((res) => {
        if (res?.error) {
          setErrMessage(res.error);
        } else {
          open.current = true;
          setTimeout(() => {
            push('/');
          }, 1500);
        }
      });
    },
  });

  return (
    <div>
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <div className="mb-6 text-center">
          <h4 className="text-2xl font-bold mb-2">Login</h4>
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/auth/user/register"
              className="text-primary font-semibold"
            >
              Sign up here
            </Link>
          </p>
        </div>
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <input
            type="email"
            required
            className="w-full p-3 border  rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Email Address"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          <input
            type="password"
            required
            className="w-full p-3 border  rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {errMessage && <p className="text-sm text-red-600">{errMessage}</p>}
          <button
            type="submit"
            className={`w-full p-3 rounded-md text-white font-semibold transition-all duration-200 ease-in-out ${
              formik.isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/80'
            }`}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Processing...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            href={'/auth/forget-password'}
            className="text-primary font-semibold"
          >
            Forgot password?
          </Link>
        </div>
        <Snackbar
          className="!bg-primary"
          open={open.current}
          autoHideDuration={1500}
          onClose={() => {
            open.current = false;
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
            Login Success
          </Alert>
        </Snackbar>
        <center>
          <h5 className="mt-6 mb-2 text-gray-500 flex items-center justify-center gap-2">
            <hr className="w-full border-gray-300" />
            <p className="text-gray-500 w-[900px]">
              or use one of these options
            </p>
            <hr className="w-full border-gray-300" />
          </h5>

          <div className="flex items-center justify-center gap-4">
            <div>
              <div
                className="border py-4 px-5 w-full mx-[5] my-[10] rounded-md cursor-pointer"
                onClick={() => {
                  facebookLogin();
                }}
              >
                <Image
                  alt=""
                  src={FacebookImage}
                  width={16}
                  height={8}
                  className="h-4 w-2"
                />
              </div>
            </div>

            <div>
              <div
                className="border p-4 w-full mx-[5] my-[10] rounded-md cursor-pointer"
                onClick={() => {
                  googleLogin();
                }}
              >
                <Image
                  alt="Google"
                  src={GoogleImage}
                  width={15}
                  height={15}
                  className="h-[15] w-[15]"
                />
              </div>
            </div>
          </div>
        </center>
      </div>
    </div>
  );
}
