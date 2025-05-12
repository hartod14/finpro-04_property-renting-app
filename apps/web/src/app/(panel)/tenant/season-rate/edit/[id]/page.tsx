'use client';

import Button from '@/components/common/button/button';
import { InputField } from '@/components/common/input/InputField';
import { InputFieldDateRange } from '@/components/common/input/InputFieldDateRange';
import { InputFieldTextarea } from '@/components/common/input/InputFieldTextarea';
import { seasonRateInit } from '@/helpers/formiks/season-rate';
import { IProperty, IRoom } from '@/interfaces/property.interface';
import { ISeasonRateCreate } from '@/interfaces/season-rate.interface';
import TenantSeasonRateEditModel from '@/models/tenant-panel/tenantSeasonRateEditModel';
import { storeSeasonRateValidator } from '@/validators/season-rate.validator';
import { Form, Formik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

export default function TenantSeasonRateEditPage({ params }: Props) {
  const resolvedParams = use(params);
  const {
    isLoading,
    setIsLoading,
    router,
    tenantProperty,
    handleUpdateSeasonRate,
    initialValues,
  } = TenantSeasonRateEditModel(Number(resolvedParams.id));

  return (
    <div className="bg-white rounded-md p-4 border border-gray-100 shadow-md">
      <Formik<ISeasonRateCreate>
        initialValues={initialValues}
        validationSchema={storeSeasonRateValidator}
        enableReinitialize
        onSubmit={async (values) => {
          await handleUpdateSeasonRate(values);
        }}
      >
        {(formik) => {
          return (
            <Form>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="mb-6">
                  <InputFieldDateRange
                    startDateName="start_date"
                    endDateName="end_date"
                    label="Select season period dates"
                    required={true}
                    startDatePlaceholder="Start Date"
                    endDatePlaceholder="End Date"
                  />
                </div>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="mb-6">
                  <InputField
                    id="value"
                    name="value"
                    label="Rate Value"
                    type="number"
                    placeholder="Enter rate value"
                    required={true}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block mb-2 font-medium">
                        Value Type
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="value_type"
                            value="PERCENTAGE"
                            className="mr-2"
                            checked={formik.values.value_type === 'PERCENTAGE'}
                            onChange={() =>
                              formik.setFieldValue('value_type', 'PERCENTAGE')
                            }
                          />
                          Percentage (%)
                        </label>

                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="value_type"
                            value="NOMINAL"
                            className="mr-2"
                            checked={formik.values.value_type === 'NOMINAL'}
                            onChange={() =>
                              formik.setFieldValue('value_type', 'NOMINAL')
                            }
                          />
                          Nominal (IDR)
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">
                        Rate Type
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="type"
                            value="INCREASE"
                            className="mr-2"
                            checked={formik.values.type === 'INCREASE'}
                            onChange={() =>
                              formik.setFieldValue('type', 'INCREASE')
                            }
                          />
                          Price Increase
                        </label>

                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="type"
                            value="DECREASE"
                            className="mr-2"
                            checked={formik.values.type === 'DECREASE'}
                            onChange={() =>
                              formik.setFieldValue('type', 'DECREASE')
                            }
                          />
                          Price Discount
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-medium">Select Room</label>
                <div className="mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mr-2"
                      id="select-all"
                      onChange={(e) => {
                        // Logic to handle select all rooms
                        const allRooms = tenantProperty.flatMap(
                          (property: IProperty) =>
                            property.rooms?.map((room: IRoom) => room.id) || [],
                        );

                        if (e.target.checked) {
                          formik.setFieldValue('rooms', allRooms);
                        } else {
                          formik.setFieldValue('rooms', []);
                        }
                      }}
                      checked={
                        Array.isArray(formik.values.rooms) &&
                        formik.values.rooms.length > 0 &&
                        tenantProperty.flatMap(
                          (property: IProperty) =>
                            property.rooms?.map((room: IRoom) => room.id) || [],
                        ).length === formik.values.rooms.length
                      }
                    />
                    Select All room
                  </label>
                </div>

                {tenantProperty.map((property: IProperty, idx: number) => {
                  return (
                    <div
                      key={property.id}
                      className="mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                    >
                      <div className="bg-gray-50 p-4 border-b">
                        <div className="flex items-center gap-2">
                          <h6 className="font-semibold text-lg text-primary">
                            {property.name}
                          </h6>
                          <h6 className="font-semibold text-lg text-primary">
                            - {property.city?.name}
                          </h6>
                          <div className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                            {property.category.name}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-white">
                        <div className="text-sm mb-2">Select Rooms:</div>
                        <div className="grid lg:grid-cols-2 gap-3">
                          {property.rooms?.map((room: IRoom) => {
                            return (
                              <div
                                key={room.id}
                                className="border border-gray-200 rounded p-3 hover:bg-gray-50"
                              >
                                <label className="flex items-start cursor-pointer">
                                  <input
                                    type="checkbox"
                                    name="rooms"
                                    value={room.id}
                                    className="w-4 h-4 mr-2 mt-1"
                                    onChange={(e) => {
                                      const roomId = room.id;
                                      const isChecked = e.target.checked;
                                      const currentRooms = Array.isArray(
                                        formik.values.rooms,
                                      )
                                        ? [...formik.values.rooms]
                                        : [];

                                      if (isChecked) {
                                        // Add room ID if not already included
                                        if (!currentRooms.includes(roomId)) {
                                          currentRooms.push(roomId);
                                        }
                                      } else {
                                        // Remove room ID if currently included
                                        const index =
                                          currentRooms.indexOf(roomId);
                                        if (index !== -1) {
                                          currentRooms.splice(index, 1);
                                        }
                                      }

                                      formik.setFieldValue(
                                        'rooms',
                                        currentRooms,
                                      );
                                    }}
                                    checked={
                                      Array.isArray(formik.values.rooms) &&
                                      formik.values.rooms.includes(room.id)
                                    }
                                  />
                                  <div className="flex items-center gap-2">
                                    <div>
                                      <Image
                                        src={room.roomImages[0].path}
                                        alt={room.name}
                                        width={100}
                                        height={100}
                                        className="rounded-md"
                                      />
                                    </div>
                                    <div>
                                      <p className="font-medium">{room.name}</p>
                                      <div className="text-sm text-gray-600 mt-1">
                                        <p>
                                          <span className="font-medium">
                                            Size:
                                          </span>{' '}
                                          {room.size || 'N/A'} m²
                                        </p>
                                        <p>
                                          <span className="font-medium">
                                            Capacity:
                                          </span>{' '}
                                          {room.capacity || 'N/A'} people
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {formik.touched.rooms && formik.errors.rooms && (
                  <div className="text-red-500">{formik.errors.rooms}</div>
                )}
              </div>

              <div className="mb-6">
                <InputFieldTextarea
                  id="description"
                  name="description"
                  label="Description"
                />
              </div>

              <div className="flex justify-end mt-8">
                <div className="flex gap-2">
                  <Link href="/tenant/season-rate">
                    <Button color="secondary" textColor="white" name="Back" />
                  </Link>

                  <button
                    type="submit"
                    disabled={
                      !(formik.isValid && formik.dirty) ||
                      formik.isSubmitting ||
                      !formik.values.rooms ||
                      formik.values.rooms.length === 0
                    }
                  >
                    <Button
                      color={`${
                        !(formik.isValid && formik.dirty) ||
                        formik.isSubmitting ||
                        !formik.values.rooms ||
                        formik.values.rooms.length === 0
                          ? 'lightGray'
                          : 'primaryOrange'
                      }`}
                      textColor="white"
                      name={formik.isSubmitting ? 'Processing...' : 'Save'}
                    />
                  </button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
