'use client';

import { uploadImage } from '@/handlers/upload';
import { useRouter } from 'next/navigation';
import React, { useCallback, useContext, useRef, useState } from 'react';

export default function UserAccountModel() {
  const [isLoading, setIsLoading] = useState(false);
//   const loading = useContext(LoadingContext);
  const router = useRouter();
  const [image, setImage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const refImage = useRef<HTMLInputElement>(null);
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
  return {
    isLoading,
    setIsLoading,
    router,
    refImage,
    image,
    setImage,
    upload,
    error,
  };
}
