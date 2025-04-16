/** @format */
'use client';
import { Alert, Snackbar } from '@mui/material';
import { useFormik } from 'formik';
import Link from 'next/link';
import React, { useRef } from 'react';
import { registerValidator } from '@/validators/auth.validator';
import { register } from '@/handlers/auth';
import { useRouter } from 'next/navigation';
import { registerInit } from '@/helpers/formiks/formik.init';
import Google from 'next-auth/providers/google';
import Image from 'next/image';
import FacebookImage from '@/../public/facebook.png';
import GoogleImage from '@/../public/google.png';
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const [errMessage, setErrMessage] = React.useState('');
  const open = useRef(false);
  const router = useRouter();

  const formik = useFormik({
    validationSchema: registerValidator,
    initialValues: { ...registerInit, role: 'USER' },
    onSubmit: async (values) => {
      setErrMessage('');
      await register(values).then((res) => {
        if (res?.error) setErrMessage(res.error);
        else {
          Swal.fire({
            title: 'Registration Success',
            text: 'Please check your email for verification',
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
    <div className="flex items-center justify-center">
      <div className=" p-8 bg-white shadow-lg rounded-lg overflow-y-auto">
        <div className="mb-4">
          <h4 className="text-2xl font-bold mb-2">Register</h4>
          <h5 className="mb-4">
            {'Already have an account? '}
            <Link href={'/auth/user/login'} className="text-primary font-semibold">
              Sign in here
            </Link>
          </h5>
        </div>
        <form className="space-y-3" onSubmit={formik.handleSubmit}>
          <input
            type="hidden"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
          />
          <input
            type="email"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
            placeholder="Email Address"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          {/* <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
            placeholder="Your Phone (optional)"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
          /> */}
          {/* <div>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
              placeholder="Your Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            <p className="text-sm text-red-600 my-0">{formik.errors.name}</p>
          </div> */}
          {/* <div>
            <input
              type="password"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary"
              placeholder="Password"
              name="password"
              required
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            <p className="text-sm text-red-600">{formik.errors.password}</p>
          </div> */}
          {/* <div>
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
          </div> */}
          <p className="text-sm text-red-600">{errMessage}</p>
          <p className="text-xs text-gray-600">
            {"By registering, I agree to Eventic's "}
            <span className="text-primary">Terms and Conditions</span>
            {' and '}
            <span className="text-primary">Privacy Policy</span>
          </p>
          <button
            className={`${
              !(formik.isValid && formik.dirty) || formik.isSubmitting
                ? 'bg-gray-300 text-gray-400'
                : 'bg-primary text-white'
            } font-semibold p-4 w-full rounded-full transition duration-300 hover:bg-green-700 disabled:bg-gray-300`}
            disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Processing...' : 'Register'}
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
            Register Success
          </Alert>
        </Snackbar>
        <center>
          <h5 className="mt-6 mb-2">Login instantly using your social media</h5>

          <div className="flex items-center justify-center gap-4">
            {/* <div>
              <div className="border p-6 w-full mx-[5] my-[10] rounded-md cursor-pointer">
                <Image
                  alt=""
                  src={FacebookImage}
                  width={16}
                  height={8}
                  className="h-4 w-2"
                />
              </div>
            </div> */}

            {/* <div> */}
            <div
              className="border p-6 w-full mx-[5] my-[10] rounded-md cursor-pointer"
              onClick={() => {}}
            >
              <Image
                alt=""
                src={GoogleImage}
                width={15}
                height={15}
                className="h-[15] w-[15]"
              />
            </div>
          </div>
          {/* </div> */}
        </center>
      </div>
    </div>
  );
}
