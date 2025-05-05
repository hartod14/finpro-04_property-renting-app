'use client';

import Button from '@/components/common/button/button';
import { InputField } from '@/components/common/input/InputField';
import { storeCategoryValidator } from '@/validators/category.validator';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import React, { use, useEffect, useState } from 'react';
import TenantCategoryEditModel from '@/models/tenant-panel/tenantCategoryEditModel';

type Props = {
  params: Promise<{ id: string }>;
};

export default function TenantCategoryEditPage({ params }: Props) {
  const resolvedParams = use(params);
  const { isLoading, router, initialValues, handleUpdateCategory } = TenantCategoryEditModel(resolvedParams.id);

  return (
    <div className="bg-white rounded-md p-4 border border-gray-100 shadow-md">
      {initialValues && (
        <Formik
          initialValues={initialValues}
          validationSchema={storeCategoryValidator}
          onSubmit={async (values) => {
            await handleUpdateCategory(values);
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
