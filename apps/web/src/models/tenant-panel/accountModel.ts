'use client';

import { sendChangeEmail } from '@/handlers/auth';
import { uploadImage } from '@/handlers/upload';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Swal from 'sweetalert2';

export default function TenantAccountModel() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, update } = useSession();
  const [initialValues, setInitialValues] = useState<any>();
  //   const loading = useContext(LoadingContext);
  const router = useRouter();
  const [image, setImage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const refImage = useRef<HTMLInputElement>(null);

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

  const upload = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      setFieldValue: (field: string, value: any) => void,
    ) => {
      setIsLoading(true);
      setError('');
      if (e.target.files?.length) {
        const image: File = e.target.files[0];

        // Check file size (1MB = 1048576 bytes)
        if (image.size > 1048576) {
          setError('Image size should not exceed 1MB');
          setIsLoading(false);
          return;
        }

        const acceptedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        if (!acceptedTypes.includes(image.type)) {
          setError('file must be image');
          setIsLoading(false);
          return;
        }

        const form = new FormData();
        form.append('image', image);

        const resImage = await uploadImage(form);

        setFieldValue('profile_picture', resImage.data);
        setImage(resImage.data);
      }
      setIsLoading(false);
    },
    [],
  );

  const handleChangeEmail = async (email: string) => {
      Swal.fire({
        title: 'Change Email Confirmation',
        text: 'A change email verification email will be sent to your registered email address.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0194f3',
        cancelButtonColor: '#ABABAB',
        confirmButtonText: 'Yes, send email!',
        cancelButtonText: 'Cancel',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res: any = await sendChangeEmail(email);
            if (res?.error) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: res.error,
              });
            } else {
              Swal.fire({
                title: 'Email Sent!',
                text: 'Check your email for change email verification instructions.',
                icon: 'success',
                confirmButtonColor: '#0194f3',
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
    };

  return {
    isLoading,
    setIsLoading,
    router,
    image,
    refImage,
    upload,
    error,
    session,
    initialValues,
    update,
    handleChangeEmail
  };
}
