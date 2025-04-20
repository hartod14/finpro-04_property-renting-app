'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import UserSidebar from '@/components/common/sidebar/userSidebar';
import UserAccountModel from '@/models/user-panel/accountModel';
import { Form } from 'formik';
import { updateProfileValidator } from '@/validators/auth.validator';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import { update } from 'cypress/types/lodash';
import { InputField } from '@/components/common/input/InputField';
import DefaultImage from '@/../public/default_avatar.jpg';
import { FaArrowUp, FaUpload } from 'react-icons/fa';
import { updateUser } from '@/handlers/auth';
import Button from '@/components/common/button/button';

export default function UserAccountPage() {
  const { data: session, update } = useSession();
  const [initialValues, setInitialValues] = useState<any>();

  const {
    isLoading,
    setIsLoading,
    router,
    refImage,
    image,
    setImage,
    upload,
    error,
  } = UserAccountModel();

  useEffect(() => {
    if (session) {
      setInitialValues({
        email: session.user.email ?? '',
        phone: session.user.phone ?? '',
        name: session.user.name ?? '',
        profile_picture: session.user.profile_picture ?? '',
      });
      setImage(session.user.profile_picture ?? '');
    }
  }, [session]);

  return (
    <div>
      {initialValues && (
        <Formik
          initialValues={initialValues}
          validationSchema={updateProfileValidator}
          onSubmit={async (values) => {
            Swal.fire({
              title: 'Submit this update Profile?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#0194f3',
              cancelButtonColor: '#ABABAB',
              confirmButtonText: 'Yes, save it!',
              cancelButtonText: 'Back',
            }).then(async (result) => {
              if (result.isConfirmed) {
                try {
                  setIsLoading(true);
                  const res: any = await updateUser(values).then(() => {
                    update();
                  });

                  if (res?.error) {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Something went wrong, please try again later!',
                    });
                  } else {
                    Swal.fire({
                      title: 'Saved!',
                      text: 'Your new profile has been updated.',
                      icon: 'success',
                      confirmButtonColor: '#0194f3',
                    }).then(() => {
                      router.push('/user/account');
                    });
                  }
                } catch (error) {
                  alert('something error');
                } finally {
                  setIsLoading(false);
                }
              }
            });
          }}
        >
          {(formik) => (
            <Form>
              <h2 className="text-xl font-semibold mb-6">Update Profile</h2>
              <div className="grid gap-6 mb-6 grid-cols-1">
                <div>
                  <div className=" mb-2">
                    <div className="flex items-center gap-3">
                      <Image
                        width={100}
                        height={100}
                        onClick={() => refImage.current?.click()}
                        className="rounded-full h-[250] w-[250] aspect-square object-cover"
                        src={isLoading ? '/spinner.gif' : image || DefaultImage}
                        alt="image"
                      />
                      <button
                        type="button"
                        onClick={() => refImage.current?.click()}
                        className={`${isLoading ? 'bg-blue-200' : 'bg-white border border-primary'}  px-3 py-2 text-sm font-medium text-center text-primary rounded-lg hover:bg-blue-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
                        disabled={isLoading}
                      >
                        <div className="flex gap-2 items-center">
                          <FaUpload width={20} height={20} />
                          {isLoading ? 'Uploading...' : 'Upload image'}
                        </div>
                      </button>
                    </div>
                    {error && (
                      <div className="text-red-500 text-sm mt-2">{error}</div>
                    )}
                    <input
                      type="file"
                      hidden
                      ref={refImage}
                      accept="image/png, image/jpg, image/jpeg, image/gif"
                      onChange={(e) => upload(e, formik.setFieldValue)}
                    />
                  </div>
                </div>

                <InputField
                  type="text"
                  id="name"
                  name="name"
                  label="Name"
                  placeholder=""
                  required
                />
                <InputField
                  type="number"
                  id="phone"
                  name="phone"
                  label="Phone"
                  placeholder=""
                />
              </div>

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
      )}
    </div>
  );
}
