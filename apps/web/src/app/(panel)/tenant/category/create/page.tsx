'use client';

import Button from '@/components/common/button/button';
import { InputField } from '@/components/common/input/InputField';
import { storeCategoryInit } from '@/helpers/formiks/category.formik';
import { storeCategoryValidator } from '@/validators/category.validator';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import React from 'react';
import TenantCategoryCreateModel from '@/models/tenant-panel/tenantCategoryCreateModel';

export default function TenantCategoryCreatePage() {
  const { isLoading, router, handleCreateCategory } = TenantCategoryCreateModel();
  
  return (
    <div className="bg-white rounded-md p-4 border border-gray-100 shadow-md">
      <Formik
        initialValues={storeCategoryInit}
        validationSchema={storeCategoryValidator}
        onSubmit={async (values) => {
          await handleCreateCategory(values);
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
