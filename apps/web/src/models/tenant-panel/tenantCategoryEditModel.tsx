import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ICreateCategory } from '@/interfaces/category.interface';
import { getCategoryById, updateCategory } from '@/handlers/tenant-category';
import Swal from 'sweetalert2';

export default function TenantCategoryEditModel(id: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<ICreateCategory>();
  const router = useRouter();

  const fetchCategory = async () => {
    let category = await getCategoryById(id);
    if (category.error == 'forbidden') {
      router.push('/forbidden');
    } else {
      if (category) {
        category = category.data;
        setInitialValues({
          name: category.name,
        });
      }
    }
  };

  const handleUpdateCategory = async (values: ICreateCategory) => {
    return Swal.fire({
      title: 'Edit this category?',
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
          const res = await updateCategory(id, values);

          if (res?.error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again later!',
            });
          } else {
            Swal.fire({
              title: 'Saved!',
              text: 'Category has been updated.',
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

  useEffect(() => {
    fetchCategory();
  }, [id]);

  return {
    isLoading,
    setIsLoading,
    router,
    initialValues,
    handleUpdateCategory,
  };
}
