'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ReplyReviewModalProps {
  showModal: boolean;
  selectedReview: any;
  replyText: string;
  setReplyText: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitReply: () => void;
  handleCloseModal: () => void;
  loading: boolean;
}

const ReplyReviewModal: React.FC<ReplyReviewModalProps> = ({
  showModal,
  selectedReview,
  replyText,
  setReplyText,
  handleSubmitReply,
  handleCloseModal,
  loading,
}) => {
  if (!showModal || !selectedReview) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full relative">
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X />
        </button>
        <h2 className="text-xl font-bold mb-4">
          Reply to {selectedReview.user.name}'s Review
        </h2>
        <p className="mb-2 font-medium">Review:</p>
        <p className="bg-gray-100 p-3 rounded mb-4">
          {selectedReview.comment}
        </p>
        <textarea
          rows={4}
          className="w-full border border-gray-300 rounded p-2 mb-4 bg-white text-black"
          placeholder="Write your reply here..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <button
          onClick={handleSubmitReply}
          disabled={!replyText || loading}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Reply'}
        </button>
      </div>
    </div>
  );
};

export default ReplyReviewModal;
