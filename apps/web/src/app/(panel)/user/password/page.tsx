'use client';

import Button from '@/components/common/button/button';
import { InputField } from '@/components/common/input/InputField';
import {
  changePassword,
} from '@/handlers/auth';
import UserPasswordModel from '@/models/user-panel/passwordModel';
import { changePasswordValidator } from '@/validators/auth.validator';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import React from 'react';
import Swal from 'sweetalert2';

export default function UserPassword() {
  const {
    router,
    session,
    initChangePassword,
    handleSetPassword,
    handleForgetPassword,
    checkPassword,
  } = UserPasswordModel();

  return checkPassword ? (
    <div className="bg-white rounded-lg shadow-md p-6">
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
    <div className='bg-white p-6 rounded-lg shadow-lg border border-gray-100'>
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