'use client';

import {
  checkPasswordSet,
  forgetPassword,
  resendVerificationEmail,
} from '@/handlers/auth';
import { uploadImage } from '@/handlers/upload';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function UserPasswordModel() {
  //   const loading = useContext(LoadingContext);
  const router = useRouter();
  const { data: session } = useSession();
  const [checkPassword, setCheckPassword] = useState(false);
  const initChangePassword = {
    password: '',
    new_password: '',
    confirm_new_password: '',
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

  return {
    router,
    session,
    initChangePassword,
    handleSetPassword,
    handleForgetPassword,
    checkPassword,
  };
  1;
}
