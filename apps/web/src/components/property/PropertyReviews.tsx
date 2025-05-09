'use client';

import { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { IReview } from '@/interfaces/property.interface';
import { formatTimeOnly } from '@/utils/formatters';
import Image from 'next/image';
import { PanelPagination } from '@/components/common/pagination/panelPagination';

interface PropertyReviewsProps {
  propertyId: number;
}

const PropertyReviews: React.FC<PropertyReviewsProps> = ({ propertyId }) => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const limit = 5;

  const totalPage = Math.ceil(reviews.length / limit);
  const currentReviews = reviews.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/review/property/${propertyId}`,
        );
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setReviews(data.data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [propertyId]);

  if (loading)
    return <p className="text-gray-500 text-sm">Loading reviews...</p>;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Reviews</h2>

      {reviews.length > 0 ? (
        <>
          <div className="space-y-4">
            {currentReviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  {review.user?.profile_picture ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={review.user.profile_picture}
                        alt={review.user.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-500">
                      <FaUser className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800">
                      {review.user.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatTimeOnly(
                        new Date(review.created_at).toISOString(),
                      )}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm">{review.comment}</p>
                <div className="mt-2 flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={
                        index < review.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>

                {review.reply && (
                  <div className="mt-4 ml-6 border-l-4 border-green-400 pl-4 bg-gray-50 rounded-lg py-2">
                    <div className="flex items-center gap-2 mb-2">
                      {review.tenant?.profile_picture ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={review.tenant.profile_picture}
                            alt={review.tenant.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-200 text-green-800">
                          <FaUser className="w-4 h-4" />
                        </div>
                      )}
                      <p className="text-sm text-green-800 font-semibold">
                        {review.tenant?.name ?? 'Tenant'}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">{review.reply}</p>
                    {review.reply_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        Replied at{' '}
                        {formatTimeOnly(
                          new Date(review.reply_at).toISOString(),
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="mt-6">
            <PanelPagination
              page={page}
              setPage={setPage}
              setLimit={() => {}}
              limit={limit}
              total={reviews.length}
              totalPerPage={currentReviews.length}
              totalPage={totalPage}
            />
          </div>
        </>
      ) : (
        <p className="text-gray-400 text-sm">No reviews yet.</p>
      )}
    </div>
  );
};

export default PropertyReviews;
