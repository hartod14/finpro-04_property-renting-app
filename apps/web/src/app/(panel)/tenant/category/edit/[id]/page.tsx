'use client';

import Button from '@/components/common/button/button';
import { InputField } from '@/components/common/input/InputField';
import { getCategoryById, updateCategory } from '@/handlers/category';
import { ICreateCategory } from '@/interfaces/category.interface';
import { storeCategoryValidator } from '@/validators/faq.validator';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
type Props = {
  params: Promise<{ id: number }>;
};
export default function PanelEditFaq({ params }: Props) {
  const router = useRouter();
  // const { isLoading, loading, router, setIsLoading } = PanelCategoryEditViewModel();
  const [initialValues, setInitialValues] = useState<ICreateCategory>();
  useEffect(() => {
    async function fetchCategory() {
      try {
        const { id } = await params;
        const category: ICreateCategory = (await getCategoryById(id.toString()))
          .data;

        if (category) {
          setInitialValues((prev) => {
            return {
              name: category.name,
            };
          });
        }
      } catch (error) {
        console.error('Error fetching Category:', error);
      }
    }

    fetchCategory();
  }, [params]);

  return (
    <div className="bg-white rounded-md p-4 border border-gray-100 shadow-md">
      {initialValues && (
        <Formik
          initialValues={initialValues}
          validationSchema={storeCategoryValidator}
          onSubmit={async (values) => {
            Swal.fire({
              title: 'Edit this category?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#ABABAB',
              confirmButtonText: 'Yes, save it!',
              cancelButtonText: 'Back',
            }).then(async (result) => {
              if (result.isConfirmed) {
                const { id } = await params;
                try {
                  // loading?.setLoading(true);
                  const res = await updateCategory(id.toString(), values);

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
                  // loading?.setLoading(false);
                }
              }
            });
          }}
        >
          {(formik) => (
            <Form>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <InputField
                  type="text"
                  id="name"
                  name="name"
                  label="Name"
                  placeholder=""
                  required
                />
              </div>

              <hr className="my-10 text-gray-50" />
              <div className="flex justify-end">
                <div className="flex gap-2">
                  <Link
                    href={'/tenant/category'}
                    onClick={() => router.push('/tenant/category')}
                  >
                    <Button color="secondary" textColor="white" name="Back" />
                  </Link>

                  <button
                    type="submit"
                    disabled={
                      !(formik.isValid && formik.dirty) || formik.isSubmitting
                    }
                  >
                    <Button
                      color={`${!(formik.isValid && formik.dirty) || formik.isSubmitting ? 'lightGray' : 'primaryOrange'}`}
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
