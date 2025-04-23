'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const UploadPaymentForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const bookingId = '2'; // manual bookingId

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/payments/${bookingId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      setSuccess(response.data.message);
      setFile(null);
      setPreview(null);
      setUploadSuccess(true);
    } catch (err) {
      setError('Failed to upload payment proof');
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow-lg my-40">
      <h2 className="text-xl font-semibold text-center mb-4 text-black">
        TESTING UPLOAD PAYMENT PROOF
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700"
          >
            Select Payment Proof
          </label>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {preview && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto rounded-md border border-gray-300"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        {uploadSuccess ? (
          <button
            type="button"
            onClick={handleRedirect}
            className="w-full py-2 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
          >
            Back to Dashboard
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            {loading ? 'Uploading...' : 'Upload Payment Proof'}
          </button>
        )}
      </form>
    </div>
  );
};

export default UploadPaymentForm;
