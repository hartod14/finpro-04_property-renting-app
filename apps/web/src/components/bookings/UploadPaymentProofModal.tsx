'use client';

import { X } from 'lucide-react';

interface UploadPaymentProofModalProps {
  isOpen: boolean;
  previewImage: string | null;
  onClose: () => void;
  onUpload: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadPaymentProofModal: React.FC<UploadPaymentProofModalProps> = ({
  isOpen,
  previewImage,
  onClose,
  onUpload,
  onFileChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-semibold mb-4">Upload Payment Proof</h3>
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="mb-4"
        />
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="mb-4 max-h-64 object-contain border rounded"
          />
        )}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Close
          </button>
          <button
            onClick={onUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Upload Proof
          </button>
        </div>
      </div>
    </div>
  );
};
