/** @format */
'use client';

import { Alert, Link, Snackbar } from '@mui/material';
import { useFormik } from 'formik';
import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { forgetPassword } from '@/handlers/auth';
import Swal from 'sweetalert2';
import { forgetPassFormik } from '@/helpers/formiks/forget-pass.formik';
import { FaArrowLeft } from 'react-icons/fa';
export default function Page() {
  const [errMessage, setErrMessage] = React.useState('');
  const open = useRef(false);
  const router = useRouter();

  const formik = useFormik({
    validationSchema: forgetPassFormik,
    initialValues: {
      email: '',
    },
    onSubmit: async (values) => {
      setErrMessage('');
      await forgetPassword(values.email).then((res) => {
        if (res?.error) {
          setErrMessage(res.error);
        } else {
          Swal.fire({
            title: 'Success',
            text: 'Reset password has been sent to email',
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
    <div className="flex flex-col items-center justify-center min-h-screen gap-2 bg-gray-100">
      <div className="w-full max-w-lg ps-9">
        <Link href="/" className="text-white">
          <span className="inline-flex items-center gap-2">
            <FaArrowLeft /> Return to Homapage
          </span>
        </Link>
      </div>
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <div className="w-full max-w-lg"></div>
        <div className="mb-4">
          <h4 className="text-2xl font-bold mb-2 text-center">
            Reset Your Password
          </h4>
          <p className="text-center text-gray-500 text-sm">
            We will send verification code to your email
          </p>
        </div>
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <input
            type="email"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary"
            placeholder="Email"
            name="email"
            required
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          <p className="text-sm text-red-600">{formik.errors.email}</p>

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
