'use client';

import Button from '@/components/common/button/button';
import { InputField } from '@/components/common/input/InputField';
import {
  changePassword,
  checkPasswordSet,
  forgetPassword,
  resendVerificationEmail,
} from '@/handlers/auth';
import { changePasswordValidator } from '@/validators/auth.validator';
import { log } from 'console';
import { Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function UserPassword() {
  const initChangePassword = {
    password: '',
    new_password: '',
    confirm_new_password: '',
  };
  const router = useRouter();
  const { data: session } = useSession();
  const [checkPassword, setCheckPassword] = useState(false);

  const handleSetPassword = async (email: string) => {
    Swal.fire({
      title: 'Set Password Confirmation',
      text: 'A password verification email will be sent to your registered email address.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#ABABAB',
      confirmButtonText: 'Yes, send email!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res: any = await resendVerificationEmail(email);
          if (res?.error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: res.error,
            });
          } else {
            Swal.fire({
              title: 'Email Sent!',
              text: 'Check your email for password verification instructions.',
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
        }
      }
    });
  };

  const handleForgetPassword = async (email: string) => {
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Email is required to reset the password!',
      });
      return;
    }

    Swal.fire({
      title: 'Forget Password Confirmation',
      text: 'A password reset email will be sent to your registered email address.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#ABABAB',
      confirmButtonText: 'Yes, send email!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res: any = await forgetPassword(email);
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
              text: 'Check your email for password reset instructions.',
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
        }
      }
    });
  };

  useEffect(() => {
    async function getUser() {
      const res: any = await checkPasswordSet(String(session?.user?.email));
      if (res.error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.error,
        });
      } else {
        setCheckPassword(res.data);
      }
    }
    getUser();
  }, [session]);

  return checkPassword ? (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className="text-xl font-semibold mb-6">Change Password</h2>
      <Formik
        initialValues={initChangePassword}
        validationSchema={changePasswordValidator}
        onSubmit={async (values, { resetForm }) => {
          Swal.fire({
            title: 'Submit this change password?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#ABABAB',
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'Back',
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                const res: any = await changePassword(values);
                if (res?.error) {
                  if (res.error === 'wrong password') {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Invalid password, please try again!',
                    });
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Something went wrong, please try again later!',
                    });
                  }
                } else {
                  Swal.fire({
                    title: 'Saved!',
                    text: 'Your new password has been updated.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                  }).then(() => {
                    resetForm();
                    router.push('/user/password');
                  });
                }
              } catch (error) {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong, please try again later!',
                });
              }
            }
          });
        }}
      >
        {(formik) => (
          <Form>
            <div className="grid gap-6 mb-6 grid-cols-1">
              <InputField
                type="password"
                id="password"
                name="password"
                label="Password"
                placeholder=""
                required
              />
              <InputField
                type="password"
                id="new_password"
                name="new_password"
                label="New Password"
                placeholder=""
                required
              />
              <InputField
                type="password"
                id="confirm_new_password"
                name="confirm_new_password"
                label="Confirm New Password"
                placeholder=""
                required
              />
            </div>
            <Link
              href="#"
              className="font-bold text-primary"
              onClick={(e) => {
                e.preventDefault();
                handleForgetPassword(String(session?.user?.email));
              }}
            >
              Forget Password?
            </Link>

            <hr className="my-10 text-gray-50" />

            <div className="flex justify-end">
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={
                    !(formik.isValid && formik.dirty) || formik.isSubmitting
                  }
                >
                  <Button
                    color={`${!(formik.isValid && formik.dirty) || formik.isSubmitting ? 'lightGray' : 'primary'}`}
                    textColor="white"
                    name={formik.isSubmitting ? 'Processing...' : 'Save'}
                  />
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  ) : (
    <div>
      <div className="flex justify-between gap-6 items-center">
        <div>
          <h2 className="text-xl font-semibold mb-6">Set Password</h2>
          <p>
            You havent set password yet, click the button on the right to set
            password.
          </p>
        </div>
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleSetPassword(String(session?.user?.email));
          }}
        >
          <Button color="primary" textColor="white" name="Set Password" />
        </Link>
      </div>
    </div>
  );
}
