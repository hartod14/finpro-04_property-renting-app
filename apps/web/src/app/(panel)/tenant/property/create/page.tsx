'use client';

import TenantPropertyCreateModel from '@/models/tenant-panel/tenantPropertyCreateModel';
import { Formik, Form, Field, FieldArray } from 'formik';
import { InputField } from '@/components/common/input/InputField';
import Link from 'next/link';
import Button from '@/components/common/button/button';
import { storePropertyInit } from '@/helpers/formiks/property.formik';
import { storePropertyValidator } from '@/validators/property.validator';
import { InputFieldTextarea } from '@/components/common/input/InputFieldTextarea';
import { InputSelect } from '@/components/common/input/InputSelect';
import Image from 'next/image';
import { FaUpload, FaTrash, FaCheck } from 'react-icons/fa';
import DefaultImage from '@/../public/default_image.jpg';
import { IPropertyCreate } from '@/interfaces/property.interface';

export default function CreatePropertyPage() {
  const {
    isLoading,
    setIsLoading,
    router,
    handleCreateProperty,
    cities,
    categories,
    facilities,
    roomFacilities,
    images,
    refImage,
    upload,
    deleteImage,
    uploadRoomImage,
    deleteRoomImage,
    roomImageRefs,
    ensureRoomImageRefs,
    uploadImageError,
    roomImageErrors,
  } = TenantPropertyCreateModel();

  return (
    <div className="bg-white rounded-md p-4 border border-gray-100 shadow-md">
      <Formik<IPropertyCreate>
        initialValues={storePropertyInit}
        validationSchema={storePropertyValidator}
        onSubmit={async (values) => {
          await handleCreateProperty(values);
        }}
      >
        {(formik) => {
          ensureRoomImageRefs(formik.values.rooms.length);

          return (
            <Form>
              <section>
                <h1 className="text-2xl font-bold mb-8 text-gray-700">
                  Information
                </h1>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <InputField
                    type="text"
                    id="name"
                    name="name"
                    label="Name"
                    placeholder=""
                    required
                  />
                  <InputSelect
                    id="category_id"
                    name="category_id"
                    label="Select Category"
                    options={categories}
                    required
                  />
                </div>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <InputFieldTextarea
                    id="description"
                    name="description"
                    label="Description"
                  />
                  <InputFieldTextarea
                    id="address"
                    name="address"
                    label="Address"
                  />
                </div>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <InputField
                    type="time"
                    id="checkin_time"
                    name="checkin_time"
                    label="Checkin Time"
                    placeholder=""
                    required
                  />
                  <InputField
                    type="time"
                    id="checkout_time"
                    name="checkout_time"
                    label="Checkout Time"
                    placeholder=""
                    required
                  />
                </div>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <InputSelect
                    id="city_id"
                    name="city_id"
                    label="Select City"
                    options={cities}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Property Images
                  </label>
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => refImage.current?.click()}
                      className={`${isLoading ? 'bg-blue-200' : 'bg-blue-600'}  px-3 py-2 text-sm font-medium text-center text-white rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300`}
                      disabled={isLoading}
                    >
                      <div className="flex gap-2 items-center">
                        <FaUpload width={20} height={20} />
                        {isLoading ? 'Uploading...' : 'Upload image'}
                      </div>
                    </button>
                    {images.length < 3 && (
                      <span className="text-sm text-red-500">
                        ({images.length}/3) images uploaded
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    hidden
                    ref={refImage}
                    accept="image/png, image/gif, image/jpeg"
                    onChange={(e) => upload(e, formik.setFieldValue)}
                  />

                  {/* Image Gallery */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {isLoading && (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center h-40 animate-pulse bg-gray-100">
                        <p className="text-gray-500">Uploading image...</p>
                      </div>
                    )}

                    {images.length > 0
                      ? images.map((image, index) => (
                          <div
                            key={index}
                            className="relative group border border-gray-200 rounded-md overflow-hidden"
                          >
                            <Image
                              width={160}
                              height={160}
                              className="h-40 w-full object-cover"
                              src={image}
                              alt={`property image ${index + 1}`}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                            <button
                              type="button"
                              onClick={() =>
                                deleteImage(index, formik.setFieldValue)
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
                  {uploadImageError && (
                    <div className="text-red-500 text-sm mt-2">
                      {uploadImageError}
                    </div>
                  )}
                </div>
              </section>
              <hr className="my-8 text-gray-50/10" />
              <section>
                <h1 className="text-2xl font-bold mb-8 text-gray-700">
                  Select Property Facilities
                  {formik.values.facilities.length < 1 && (
                    <span className="text-sm text-red-500 ml-2 font-normal">
                      ({formik.values.facilities.length}/1) facility selected
                    </span>
                  )}
                </h1>
                <FieldArray
                  name="facilities"
                  render={(arrayHelpers) => (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {facilities.map((facility) => {
                        const isChecked = formik.values.facilities.includes(
                          Number(facility.id),
                        );
                        return (
                          <div key={facility.id} className="relative">
                            <div
                              className={`flex items-center cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors ${isChecked ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                              onClick={() => {
                                if (isChecked) {
                                  const idx = formik.values.facilities.indexOf(
                                    Number(facility.id),
                                  );
                                  if (idx >= 0) {
                                    const newFacilities = [
                                      ...formik.values.facilities,
                                    ];
                                    newFacilities.splice(idx, 1);
                                    formik.setFieldValue(
                                      'facilities',
                                      newFacilities,
                                      true
                                    );
                                  }
                                } else {
                                  const newFacilities = [
                                    ...formik.values.facilities,
                                    Number(facility.id),
                                  ];
                                  formik.setFieldValue(
                                    'facilities',
                                    newFacilities,
                                    true
                                  );
                                }
                              }}
                            >
                              <div
                                className={`
                                w-5 h-5 mr-3 flex items-center justify-center 
                                ${isChecked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'} 
                                border rounded transition-colors
                              `}
                              >
                                {isChecked && (
                                  <FaCheck className="text-white text-xs" />
                                )}
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">
                                  {facility.name}
                                </span>
                                {facility.icon && (
                                  <div className="mt-1 text-gray-500">
                                    <i className={facility.icon}></i>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                />
                {formik.touched.facilities && formik.errors.facilities && (
                  <div className="text-red-500 mt-2 text-sm">
                    {formik.errors.facilities as string}
                  </div>
                )}
              </section>
              <hr className="my-8 text-gray-50/10" />
              <section>
                <h1 className="text-2xl font-bold mb-8 text-gray-700">
                  Room Information
                </h1>
                <FieldArray
                  name="rooms"
                  render={(arrayHelpers) => (
                    <div>
                      {formik.values.rooms && formik.values.rooms.length > 0
                        ? formik.values.rooms.map((room, index) => (
                            <div
                              key={index}
                              className="mb-8 p-6 border-2 border-gray-300 rounded-lg"
                            >
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-700">
                                  Room {index + 1}
                                </h3>
                                {formik.values.rooms.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)}
                                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                  >
                                    <FaTrash size={14} />
                                  </button>
                                )}
                              </div>

                              <div className="grid gap-6 mb-6 md:grid-cols-2">
                                <InputField
                                  type="text"
                                  id={`rooms.${index}.name`}
                                  name={`rooms.${index}.name`}
                                  label="Room Name"
                                  placeholder="Enter room name"
                                  required
                                />
                                <InputField
                                  type="number"
                                  id={`rooms.${index}.base_price`}
                                  name={`rooms.${index}.base_price`}
                                  label="Base Price (per night)"
                                  placeholder="Enter base price"
                                  required
                                />
                              </div>

                              <div className="grid gap-6 mb-6 md:grid-cols-3">
                                <InputField
                                  type="number"
                                  id={`rooms.${index}.capacity`}
                                  name={`rooms.${index}.capacity`}
                                  label="Capacity (people)"
                                  placeholder="Number of people"
                                  required
                                />
                                <InputField
                                  type="number"
                                  id={`rooms.${index}.size`}
                                  name={`rooms.${index}.size`}
                                  label="Size (m²)"
                                  placeholder="Room size in m²"
                                  required
                                />
                                <InputField
                                  type="number"
                                  id={`rooms.${index}.total_room`}
                                  name={`rooms.${index}.total_room`}
                                  label="Total Rooms"
                                  placeholder="Number of rooms"
                                  required
                                />
                              </div>

                              <div className="mb-6">
                                <InputFieldTextarea
                                  id={`rooms.${index}.description`}
                                  name={`rooms.${index}.description`}
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
                                    onClick={() =>
                                      roomImageRefs.current[index]?.click()
                                    }
                                    className={`${isLoading ? 'bg-blue-200' : 'bg-blue-600'}  px-3 py-2 text-sm font-medium text-center text-white rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300`}
                                    disabled={isLoading}
                                  >
                                    <div className="flex gap-2 items-center">
                                      <FaUpload width={20} height={20} />
                                      {isLoading
                                        ? 'Uploading...'
                                        : 'Upload image'}
                                    </div>
                                  </button>
                                  {(!formik.values.rooms[index].images || formik.values.rooms[index].images.length < 2) && (
                                    <span className="text-sm text-red-500">
                                      ({formik.values.rooms[index].images ? formik.values.rooms[index].images.length : 0}/2) images uploaded
                                    </span>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  hidden
                                  ref={(el) => {
                                    if (roomImageRefs.current) {
                                      roomImageRefs.current[index] = el;
                                    }
                                  }}
                                  accept="image/png, image/gif, image/jpeg"
                                  onChange={(e) =>
                                    uploadRoomImage(
                                      e,
                                      formik.setFieldValue,
                                      index,
                                      formik.values,
                                    )
                                  }
                                />

                                {/* Room Image Gallery */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                                  {isLoading && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center h-40 animate-pulse bg-gray-100">
                                      <p className="text-gray-500">
                                        Uploading image...
                                      </p>
                                    </div>
                                  )}

                                  {formik.values.rooms[index].images &&
                                  formik.values.rooms[index].images.length > 0
                                    ? formik.values.rooms[index].images.map(
                                        (image, imgIndex) => (
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
                                                  index,
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
                                        ),
                                      )
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
                                {roomImageErrors[index] && (
                                  <div className="text-red-500 mt-2 text-sm">
                                    {roomImageErrors[index]}
                                  </div>
                                )}

                                {/* Room Images Validation Message */}
                                {formik.touched.rooms &&
                                  formik.errors.rooms &&
                                  typeof formik.errors.rooms !== 'string' &&
                                  formik.errors.rooms[index] &&
                                  typeof formik.errors.rooms[index] !==
                                    'string' &&
                                  formik.errors.rooms[index].images && (
                                    <div className="text-red-500 mt-2 text-sm">
                                      {formik.errors.rooms[index].images}
                                    </div>
                                  )}
                              </div>

                              {/* Room Facilities Section */}
                              <div className="mb-6 border-t border-gray-100 pt-4">
                                <div className="flex items-center mb-3">
                                  <h4 className="text-md font-semibold text-gray-700">
                                    Select Room Facilities
                                  </h4>
                                  {(!formik.values.rooms[index].facilities || formik.values.rooms[index].facilities.length < 1) && (
                                    <span className="text-sm text-red-500 ml-2 font-normal">
                                      ({formik.values.rooms[index].facilities ? formik.values.rooms[index].facilities.length : 0}/1) facility selected
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  {roomFacilities.map((facility) => {
                                    const isChecked = formik.values.rooms[
                                      index
                                    ].facilities.includes(Number(facility.id));
                                    return (
                                      <div
                                        key={facility.id}
                                        onClick={() => {
                                          const currentRooms = [
                                            ...formik.values.rooms,
                                          ];
                                          const currentFacilities = [
                                            ...(currentRooms[index]
                                              .facilities || []),
                                          ];

                                          if (isChecked) {
                                            // Remove facility if already selected
                                            const facilityIndex =
                                              currentFacilities.indexOf(
                                                Number(facility.id),
                                              );
                                            if (facilityIndex >= 0) {
                                              currentFacilities.splice(
                                                facilityIndex,
                                                1,
                                              );
                                            }
                                          } else {
                                            // Add facility if not selected
                                            currentFacilities.push(
                                              Number(facility.id),
                                            );
                                          }

                                          currentRooms[index].facilities =
                                            currentFacilities;
                                          formik.setFieldValue(
                                            'rooms',
                                            currentRooms,
                                            true
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

                                {formik.touched.rooms &&
                                  formik.errors.rooms &&
                                  typeof formik.errors.rooms !== 'string' &&
                                  formik.errors.rooms[index] &&
                                  typeof formik.errors.rooms[index] !==
                                    'string' &&
                                  formik.errors.rooms[index].facilities && (
                                    <div className="text-red-500 mt-2 text-sm">
                                      {formik.errors.rooms[index].facilities}
                                    </div>
                                  )}
                              </div>
                            </div>
                          ))
                        : null}

                      <button
                        type="button"
                        onClick={() =>
                          arrayHelpers.push({
                            name: '',
                            base_price: '',
                            description: '',
                            capacity: '',
                            size: '',
                            total_room: '',
                            images: [],
                            facilities: [],
                          })
                        }
                        className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                      >
                        <span>+</span> Add Another Room
                      </button>
                    </div>
                  )}
                />
                {formik.touched.rooms && formik.errors.rooms && (
                  <div className="text-red-500 mt-2 text-sm">
                    {typeof formik.errors.rooms === 'string'
                      ? formik.errors.rooms
                      : 'Please add at least one room with valid information.'}
                  </div>
                )}
              </section>
              <div className="flex justify-end mt-8">
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
                      !(formik.isValid && formik.dirty) ||
                      formik.isSubmitting ||
                      images.length < 3 ||
                      !formik.values.rooms?.length ||
                      formik.values.rooms.some(
                        (room) => !room.images || room.images.length < 2,
                      ) ||
                      formik.values.facilities.length === 0 ||
                      formik.values.rooms.some(
                        (room) => !room.facilities || room.facilities.length === 0,
                      )
                    }
                  >
                    <Button
                      color={`${
                        !(formik.isValid && formik.dirty) ||
                        formik.isSubmitting ||
                        images.length < 3 ||
                        !formik.values.rooms?.length ||
                        formik.values.rooms.some(
                          (room) => !room.images || room.images.length < 2,
                        ) ||
                        formik.values.facilities.length === 0 ||
                        formik.values.rooms.some(
                          (room) => !room.facilities || room.facilities.length === 0,
                        )
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
