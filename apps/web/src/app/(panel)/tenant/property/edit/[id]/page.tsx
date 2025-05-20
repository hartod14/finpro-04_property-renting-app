'use client';

import Link from 'next/link';
import { Formik } from 'formik';
import { Form } from 'formik';
import TenantPropertyEditModel from '@/models/tenant-panel/tenantPropertyEditModel';
import { FaUpload } from 'react-icons/fa';
import { use, useEffect } from 'react';
import { FaCheck, FaTrash, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { FieldArray } from 'formik';
import Image from 'next/image';
import { InputSelect } from '@/components/common/input/InputSelect';
import { InputField } from '@/components/common/input/InputField';
import { InputFieldTextarea } from '@/components/common/input/InputFieldTextarea';
import {
  IPropertyDetail,
  IPropertyUpdate,
} from '@/interfaces/property.interface';
import Button from '@/components/common/button/button';
import { updatePropertyInit } from '@/helpers/formiks/property.formik';
import { updatePropertyValidator } from '@/validators/property.validator';
import { GoogleMap, Marker } from '@react-google-maps/api';

type Props = {
  params: Promise<{ id: string }>;
};

export default function TenantPropertyEditPage({ params }: Props) {
  const resolvedParams = use(params);
  const {
    isLoading,
    setIsLoading,
    router,
    handleEditProperty,
    cities,
    categories,
    facilities,
    images,
    refImage,
    upload,
    deleteImage,
    uploadImageError,
    initialValues,
    // Map related props
    mapsLoaded,
    mapContainerStyle,
    mapCenter,
    onMapLoad,
    onMapClick,
    searchLocation,
    getAddressByCoordinates,
    initializeMarker,
    map,
  } = TenantPropertyEditModel(resolvedParams.id);

  useEffect(() => {
    // We don't need to do anything here since the marker will be created
    // when the map loads in the TenantPropertyEditModel's useEffect
  }, []);

  return (
    <div className="bg-white rounded-md p-4 border border-gray-100 shadow-md">
      <Formik
        initialValues={initialValues}
        validationSchema={updatePropertyValidator}
        enableReinitialize
        onSubmit={async (values) => {
          await handleEditProperty(values);
        }}
      >
        {(formik) => {
          // Effect to initialize marker when coordinates change
          useEffect(() => {
            if (formik.values.latitude && formik.values.longitude && map) {
              initializeMarker(
                formik.values.latitude,
                formik.values.longitude,
                formik.setFieldValue
              );
            }
          }, [formik.values.latitude, formik.values.longitude, map, initializeMarker]);

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
                  <div>
                    <InputFieldTextarea
                      id="address"
                      name="address"
                      label="Address"
                      required
                    />
                    <div className="mt-2 flex">
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        onClick={() => {
                          if (formik.values.address) {
                            searchLocation(formik.values.address, formik.setFieldValue);
                          }
                        }}
                      >
                        <FaSearch className="mr-1" /> Search address on map
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Hidden longitude/latitude fields */}
                <div className="hidden">
                  <InputField
                    type="text"
                    id="latitude"
                    name="latitude"
                    label="Latitude"
                    placeholder=""
                  />
                  <InputField
                    type="text"
                    id="longitude"
                    name="longitude"
                    label="Longitude"
                    placeholder=""
                  />
                </div>

                {/* Google Maps */}
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Property Location <span className="text-xs text-gray-500">(Pin on map)</span>
                  </label>
                  {mapsLoaded ? (
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={
                          formik.values.latitude && formik.values.longitude
                            ? {
                                lat: parseFloat(formik.values.latitude),
                                lng: parseFloat(formik.values.longitude),
                              }
                            : mapCenter
                        }
                        zoom={15}
                        onLoad={(map) => onMapLoad(map)}
                        onClick={(e) => onMapClick(e, formik.setFieldValue)}
                        options={{
                          fullscreenControl: false,
                          mapTypeControl: false,
                          streetViewControl: false,
                          zoomControl: true,
                        }}
                      >
                        {/* Only render marker if coordinates are available */}
                        {formik.values.latitude && formik.values.longitude && (
                          <Marker 
                            key={`${formik.values.latitude}-${formik.values.longitude}`}
                            position={{
                              lat: parseFloat(formik.values.latitude),
                              lng: parseFloat(formik.values.longitude)
                            }}
                            draggable={true}
                            onDragEnd={(e) => {
                              const lat = e.latLng?.lat();
                              const lng = e.latLng?.lng();
                              if (lat && lng) {
                                formik.setFieldValue('latitude', lat.toString());
                                formik.setFieldValue('longitude', lng.toString());
                                getAddressByCoordinates(lat, lng, formik.setFieldValue);
                              }
                            }}
                          />
                        )}
                      </GoogleMap>
                    </div>
                  ) : (
                    <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Loading map...</p>
                    </div>
                  )}
                  {(formik.touched.latitude && formik.errors.latitude) || (formik.touched.longitude && formik.errors.longitude) ? (
                    <div className="text-red-500 text-sm mt-1">
                      Please select a location on the map
                    </div>
                  ) : null}
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
                        // Convert facilities array to numbers for comparison
                        const facilitiesAsNumbers = Array.isArray(formik.values.facilities) 
                          ? formik.values.facilities.map(f => typeof f === 'object' ? f.id : f)
                          : [];
                        
                        const isChecked = facilitiesAsNumbers.includes(Number(facility.id));
                        return (
                          <div key={facility.id} className="relative">
                            <div
                              className={`flex items-center cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors ${isChecked ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                              onClick={() => {
                                if (isChecked) {
                                  // Remove facility
                                  const idx = facilitiesAsNumbers.indexOf(Number(facility.id));
                                  if (idx >= 0) {
                                    const newFacilities = [...formik.values.facilities];
                                    newFacilities.splice(idx, 1);
                                    formik.setFieldValue(
                                      'facilities',
                                      newFacilities,
                                      true
                                    );
                                  }
                                } else {
                                  // Add facility
                                  formik.setFieldValue(
                                    'facilities',
                                    [...formik.values.facilities, Number(facility.id)],
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
              <div className="flex justify-end mt-8">
                <div className="flex gap-2">
                  <Link
                    href={'/tenant/property'}
                    onClick={() => router.push('/tenant/property')}
                  >
                    <Button color="secondary" textColor="white" name="Back" />
                  </Link>

                  <button
                    type="submit"
                    disabled={
                      !(formik.isValid && formik.dirty) ||
                      formik.isSubmitting ||
                      images.length < 3 ||
                      formik.values.facilities.length === 0 ||
                      !formik.values.latitude ||
                      !formik.values.longitude
                    }
                  >
                    <Button
                      color={`${
                        !(formik.isValid && formik.dirty) ||
                        formik.isSubmitting ||
                        images.length < 3 ||
                        formik.values.facilities.length === 0 ||
                        !formik.values.latitude ||
                        !formik.values.longitude
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
