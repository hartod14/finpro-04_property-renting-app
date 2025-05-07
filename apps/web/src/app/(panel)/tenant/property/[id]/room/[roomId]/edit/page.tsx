'use client';

import { InputField } from '@/components/common/input/InputField';
import { storeRoomInit } from '@/helpers/formiks/property.formik';
import { IRoomCreate } from '@/interfaces/property.interface';
import { Form } from 'formik';
import TenantPropertyRoomEditModel from '@/models/tenant-panel/tenantPropertyRoomEditModel';
import { Formik } from 'formik';
import { use } from 'react';
import { storeRoomValidator } from '@/validators/property.validator';
import { InputFieldTextarea } from '@/components/common/input/InputFieldTextarea';
import { FaUpload, FaTrash, FaCheck } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/common/button/button';

type Props = {
  params: Promise<{ id: string; roomId: string }>;
};

export default function TenantPropertyRoomEditPage({ params }: Props) {
  const resolvedParams = use(params);
  const {
    isLoading,
    setIsLoading,
    router,
    handleEditRoom,
    roomFacilities,
    uploadRoomImage,
    deleteRoomImage,
    roomImageRefs,
    roomImageErrors,
    roomImages,
    initialValues,
    ensureRoomImageRefs,
  } = TenantPropertyRoomEditModel(resolvedParams.id, resolvedParams.roomId);

  return (
    <div className="bg-white rounded-md p-4 border border-gray-100 shadow-md">
      <Formik<IRoomCreate>
        initialValues={initialValues}
        validationSchema={storeRoomValidator}
        enableReinitialize
        onSubmit={async (values) => {
          await handleEditRoom(values);
        }}
      >
        {(formik) => {
          ensureRoomImageRefs();
          return (
            <Form>
              <section>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <InputField
                    type="text"
                    id="name"
                    name="name"
                    label="Room Name"
                    placeholder="Enter room name"
                    required
                  />
                  <InputField
                    type="number"
                    id="base_price"
                    name="base_price"
                    label="Base Price (per night)"
                    placeholder="Enter base price"
                    required
                  />
                </div>

                <div className="grid gap-6 mb-6 md:grid-cols-3">
                  <InputField
                    type="number"
                    id="capacity"
                    name="capacity"
                    label="Capacity (people)"
                    placeholder="Number of people"
                    required
                  />
                  <InputField
                    type="number"
                    id="size"
                    name="size"
                    label="Size (m²)"
                    placeholder="Room size in m²"
                    required
                  />
                  <InputField
                    type="number"
                    id="total_room"
                    name="total_room"
                    label="Total Rooms"
                    placeholder="Number of rooms"
                    required
                  />
                </div>

                <div className="mb-6">
                  <InputFieldTextarea
                    id="description"
                    name="description"
                    label="Room Description"
                  />
                </div>

                {/* Room Images Section */}
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Room Images
                  </label>
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => roomImageRefs.current[0]?.click()}
                      className={`${
                        isLoading ? 'bg-blue-200' : 'bg-blue-600'
                      } px-3 py-2 text-sm font-medium text-center text-white rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300`}
                      disabled={isLoading}
                    >
                      <div className="flex gap-2 items-center">
                        <FaUpload width={20} height={20} />
                        {isLoading ? 'Uploading...' : 'Upload image'}
                      </div>
                    </button>
                    {(!formik.values.roomImages ||
                      formik.values.roomImages.length < 2) && (
                      <span className="text-sm text-red-500">
                        (
                        {formik.values.roomImages
                          ? formik.values.roomImages.length
                          : 0}
                        /2) images uploaded
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    hidden
                    ref={(el) => {
                      if (roomImageRefs.current) {
                        roomImageRefs.current[0] = el;
                      }
                    }}
                    accept="image/png, image/gif, image/jpeg"
                    onChange={(e) =>
                      uploadRoomImage(e, formik.setFieldValue, formik.values)
                    }
                  />

                  {/* Room Image Gallery */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {isLoading && (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center h-40 animate-pulse bg-gray-100">
                        <p className="text-gray-500">Uploading image...</p>
                      </div>
                    )}

                    {formik.values.roomImages &&
                    formik.values.roomImages.length > 0
                      ? formik.values.roomImages.map((image, imgIndex) => (
                          <div
                            key={imgIndex}
                            className="relative group border border-gray-200 rounded-md overflow-hidden"
                          >
                            <Image
                              width={160}
                              height={160}
                              className="h-40 w-full object-cover"
                              src={image}
                              alt={`room image ${imgIndex + 1}`}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                            <button
                              type="button"
                              onClick={() =>
                                deleteRoomImage(
                                  imgIndex,
                                  formik.setFieldValue,
                                  formik.values,
                                )
                              }
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              title="Delete image"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        ))
                      : !isLoading && (
                          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center h-40">
                            <p className="text-gray-500">
                              No images uploaded yet
                            </p>
                            <p className="text-sm text-gray-400">
                              Click 'Upload image' to add photos
                            </p>
                          </div>
                        )}
                  </div>

                  {/* Display room image upload errors */}
                  {roomImageErrors[0] && (
                    <div className="text-red-500 mt-2 text-sm">
                      {roomImageErrors[0]}
                    </div>
                  )}

                  {/* Room Images Validation Message */}
                  {formik.touched.roomImages && formik.errors.roomImages && (
                    <div className="text-red-500 mt-2 text-sm">
                      {formik.errors.roomImages as string}
                    </div>
                  )}
                </div>

                {/* Room Facilities Section */}
                <div className="mb-6 border-t border-gray-100 pt-4">
                  <div className="flex items-center mb-3">
                    <h4 className="text-md font-semibold text-gray-700">
                      Select Room Facilities
                    </h4>
                    {(!formik.values.facilities ||
                      formik.values.facilities.length < 1) && (
                      <span className="text-sm text-red-500 ml-2 font-normal">
                        (
                        {formik.values.facilities
                          ? formik.values.facilities.length
                          : 0}
                        /1) facility selected
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {roomFacilities.map((facility) => {
                      // Convert facilities array to numbers for proper comparison
                      const facilitiesAsNumbers = Array.isArray(formik.values.facilities) 
                        ? formik.values.facilities.map((f: any) => {
                            if (typeof f === 'object') {
                              // Handle both potential object formats
                              return f.facility_id || f.id;
                            }
                            return Number(f);
                          })
                        : [];
                      
                      const isChecked = facilitiesAsNumbers.includes(Number(facility.id));
                      
                      return (
                        <div
                          key={facility.id}
                          onClick={() => {
                            const currentFacilities = [...formik.values.facilities];
                            
                            if (isChecked) {
                              // Remove facility if already selected
                              const idx = currentFacilities.findIndex((f: any) => {
                                if (typeof f === 'object') {
                                  // Check both potential object formats
                                  return (f.facility_id || f.id) === Number(facility.id);
                                }
                                return Number(f) === Number(facility.id);
                              });
                              
                              if (idx >= 0) {
                                currentFacilities.splice(idx, 1);
                              }
                            } else {
                              // Add facility if not selected
                              currentFacilities.push(Number(facility.id));
                            }

                            formik.setFieldValue(
                              'facilities',
                              currentFacilities,
                              true,
                            );
                          }}
                          className={`
                            inline-flex items-center px-3 py-1.5 rounded-full text-sm cursor-pointer
                            ${
                              isChecked
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                            }
                            transition-colors duration-200
                          `}
                        >
                          {isChecked && (
                            <FaCheck className="mr-1.5 text-xs text-blue-500" />
                          )}
                          {facility.name}
                        </div>
                      );
                    })}
                  </div>

                  {formik.touched.facilities && formik.errors.facilities && (
                    <div className="text-red-500 mt-2 text-sm">
                      {formik.errors.facilities as string}
                    </div>
                  )}
                </div>
              </section>
              <hr className="my-8 text-gray-50/10" />
              <div className="flex justify-end mt-8">
                <div className="flex gap-2">
                  <Link
                    href={`/tenant/property/${resolvedParams.id}/room`}
                    onClick={() =>
                      router.push(`/tenant/property/${resolvedParams.id}/room`)
                    }
                  >
                    <Button color="secondary" textColor="white" name="Back" />
                  </Link>

                  <button
                    type="submit"
                    disabled={
                      !(formik.isValid && formik.dirty) ||
                      formik.isSubmitting ||
                      !formik.values.roomImages ||
                      formik.values.roomImages.length < 2 ||
                      !formik.values.facilities ||
                      formik.values.facilities.length === 0
                    }
                  >
                    <Button
                      color={`${
                        !(formik.isValid && formik.dirty) ||
                        formik.isSubmitting ||
                        !formik.values.roomImages ||
                        formik.values.roomImages.length < 2 ||
                        !formik.values.facilities ||
                        formik.values.facilities.length === 0
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
