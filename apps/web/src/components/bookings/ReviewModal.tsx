import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number | null;
  onSubmit: (bookingId: number, content: string, rating: number) => void;
}

export const ReviewModal = ({
  isOpen,
  onClose,
  bookingId,
  onSubmit,
}: ReviewModalProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [content, setContent] = useState<string>('');

  if (!isOpen || bookingId === null) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative text-black">
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>

        <textarea
          className="w-full p-2 border border-black rounded mb-4 bg-white text-black"
          rows={4}
          placeholder="Write your review here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <label className="block mb-2 font-medium">Rating:</label>
        <div className="flex mb-4 space-x-1 text-yellow-500 text-2xl cursor-pointer">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
            >
              {hoverRating !== null ? (star <= hoverRating ? '★' : '☆') : (star <= rating ? '★' : '☆')}
            </span>
          ))}
        </div>

        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          onClick={() => {
            onSubmit(bookingId, content, rating);
            onClose();
          }}
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};
