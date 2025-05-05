'use client';

import TenantCategoryListModel from '@/models/tenant-panel/tenantCategoryListModel';
import { InputField } from '@/components/common/input/InputField';
import { createCategory } from '@/handlers/category';
import { storeCategoryInit } from '@/helpers/formiks/category.formil';
import { storeCategoryValidator } from '@/validators/faq.validator';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import React from 'react';
import Swal from 'sweetalert2';
import TenantCategoryCreateModel from '@/models/tenant-panel/tenantCategoryCreateModel';
import Button from '@/components/common/button/button';

export default function PanelAddFaq() {
  const { isLoading, router, setIsLoading } = TenantCategoryCreateModel();
  return (
    <div className="bg-white rounded-md p-4 border border-gray-100 shadow-md">
      <Formik
        initialValues={storeCategoryInit}
        validationSchema={storeCategoryValidator}
        onSubmit={async (values) => {
          Swal.fire({
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
                // loading?.setLoading(true);
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
                    text: 'Your new faq has been created.',
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

            <hr className="my-10 text-gray-50/10" />
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
    </div>
  );
}
