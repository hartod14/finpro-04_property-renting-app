import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createCategory } from '@/handlers/tenant-category';
import { ICreateCategory } from '@/interfaces/category.interface';
import Swal from 'sweetalert2';

export default function TenantCategoryCreateModel() {
  const [isLoading, setIsLoading] = useState(false);
  //   const loading = useContext(LoadingContext);
  const router = useRouter();

  const handleCreateCategory = async (values: any) => {
    return Swal.fire({
      title: 'Submit this new category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#ABABAB',
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'Back',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const res = await createCategory(values);

          if (res?.error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again later!',
            });
          } else {
            Swal.fire({
              title: 'Saved!',
              text: 'Your new category has been created.',
              icon: 'success',
              confirmButtonColor: '#3085d6',
            }).then(() => {
              router.push('/tenant/category');
            });
          }
        } catch (error) {
          alert('something error');
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  return { isLoading, setIsLoading, router, handleCreateCategory };
}
