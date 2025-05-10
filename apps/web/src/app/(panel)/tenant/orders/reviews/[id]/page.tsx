'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import Table from '@/components/common/table/table';
import { ReplyAll, CheckCheck, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function ListBookingPage() {
  const params = useParams();
  const { data: session } = useSession();
  const propertyId = params?.id as string;
  const [reviews, setReviews] = useState<any[]>([]);
  const [propertyName, setPropertyName] = useState<string>('Loading...');
  const [repliedIds, setRepliedIds] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!propertyId) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/review/property/${propertyId}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.access_token}`,
            },
          },
        );
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        const reviews = data.data || [];

        // Tandai review yang sudah direply
        const replied = reviews
          .filter((review: any) => review.reply)
          .map((review: any) => review.id);

        setReviews(reviews);
        setRepliedIds(replied);
        setPropertyName(reviews?.[0]?.property?.name || 'Unknown Property');
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };
    fetchData();
  }, [propertyId, session?.user?.access_token]);

  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={`full-${index}`} className="text-yellow-500" />
        ))}
        {halfStar && <FaStarHalfAlt className="text-yellow-500" />}
        {[...Array(emptyStars)].map((_, index) => (
          <FaRegStar key={`empty-${index}`} className="text-yellow-500" />
        ))}
      </div>
    );
  };

  const handleReplyClick = (reviewId: string) => {
    Swal.fire({
      title: 'Reply to Review',
      input: 'textarea',
      inputLabel: 'Your reply',
      inputPlaceholder: 'Write your reply here...',
      inputAttributes: {
        'aria-label': 'Type your reply here',
      },
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      preConfirm: async (replyText) => {
        if (!replyText) {
          Swal.showValidationMessage('Reply cannot be empty');
          return false;
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API}/review/reply/${reviewId}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.user?.access_token}`,
              },
              body: JSON.stringify({ reply: replyText }),
            },
          );

          if (!res.ok) throw new Error('Failed to send reply');

          setRepliedIds((prev) => [...prev, reviewId]); // Tambahkan ke daftar replied
          Swal.fire('Success!', 'Your reply has been sent.', 'success');
        } catch (err) {
          Swal.fire('Error', 'Failed to submit reply', 'error');
        }
      },
    });
  };

  const tableHead = ['No', 'Customer', 'Review', 'Rating', 'Action'];

  const tableBody = reviews.map((review, index) => [
    index + 1,
    <div className="flex items-center gap-2">
      <img
        src={review.user?.profile_picture || '/default-avatar.png'}
        alt="User"
        className="w-8 h-8 rounded-full object-cover"
      />
      <span>{review.user?.name || '-'}</span>
    </div>,
    review.comment || '-',
    renderRating(review.rating || 0),
    <div className="relative flex justify-center items-center gap-3">
      <div className="relative group">
        <button
          className={`${
            repliedIds.includes(review.id) ? 'text-green-500' : 'text-blue-500'
          } p-2 rounded-md transition-transform transform hover:scale-125 cursor-pointer group`}
          onClick={() =>
            !repliedIds.includes(review.id) && handleReplyClick(review.id)
          }
        >
          {repliedIds.includes(review.id) ? (
            <CheckCheck className="w-5 h-5" />
          ) : (
            <ReplyAll className="w-5 h-5" />
          )}
        </button>
        <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out z-10 whitespace-nowrap">
          {repliedIds.includes(review.id) ? 'Replied' : 'Reply'}
        </span>
      </div>
    </div>,
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto text-black">
      <div
        className="flex items-center mb-6 cursor-pointer"
        onClick={() => router.push('/tenant/orders')}
      >
        <FaArrowLeft size={20} className="mr-2" />
        <span className="text-xl font-semibold">Reviews Property</span>
      </div>

      <h1 className="text-3xl font-bold mb-6">List Review - {propertyName}</h1>

      <div className="relative overflow-auto">
        <Table head={tableHead} body={tableBody} />
      </div>
    </div>
  );
}
