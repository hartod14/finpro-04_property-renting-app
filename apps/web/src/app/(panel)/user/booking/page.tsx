'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Swal from 'sweetalert2';

import { BookingCard } from '@/components/bookings/BookingCard';
import { UploadPaymentProofModal } from '@/components/bookings/UploadPaymentProofModal';
import { ReviewModal } from '@/components/bookings/ReviewModal';
import { PanelPagination } from '@/components/common/pagination/panelPagination';
import { FaSearch } from 'react-icons/fa';

import { handleUploadPaymentProof } from '@/utils/bookings/handleUploadPaymentProof';
import { handleCancelBooking } from '@/utils/bookings/handleCancelBooking';
import { generateReceipt } from '@/utils/bookings/generateReceipt';
import { getStatusColor } from '@/utils/bookings/getStatusColor';

const LoadSnapScript = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute(
      'data-client-key',
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
    );
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null;
};

const formatDisplayDate = (date: Date | null | undefined) => {
  if (!date) return '';
  return format(date, 'dd MMMM yyyy'); // Using `date-fns` format for consistent formatting
};

export default function PurchaseListPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null,
  );
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReviewBookingId, setSelectedReviewBookingId] = useState<
    number | null
  >(null);

  const fetchBookings = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/bookings`, {
        params: { userId: session.user.id, search, page, limit },
        headers: { Authorization: `Bearer ${session.user.access_token}` },
      });

      setBookings(res.data.bookings || []);
      setTotal(res.data.total || 0);
      setTotalPage(Math.ceil((res.data.total || 0) / limit));
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [session, search, page, limit]);

  const handleCancel = (bookingId: number) => {
    handleCancelBooking(bookingId, session?.user?.access_token!, () => {
      setPage(1);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setPaymentProof(file);
    }
  };

  const handlePayNowClick = (
    bookingId: number,
    paymentMethod: 'MANUAL' | 'MIDTRANS',
  ) => {
    if (paymentMethod === 'MANUAL') {
      setSelectedBookingId(bookingId);
      setIsModalOpen(true);
    } else if (paymentMethod === 'MIDTRANS') {
      handlePayment(bookingId); // This will trigger the Snap payment
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBookingId(null);
    setPaymentProof(null);
  };

  const handleUploadPayment = () => {
    handleUploadPaymentProof(
      selectedBookingId,
      paymentProof,
      session?.user?.access_token!,
      setIsModalOpen,
      () => setPage(1),
    );
  };

  const handleGenerateReceipt = (booking: any) => {
    generateReceipt(booking);
  };

  const handleOpenReviewModal = (bookingId: number) => {
    setSelectedReviewBookingId(bookingId);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (
    bookingId: number,
    content: string,
    rating: number,
  ) => {
    if (!content || rating === 0) {
      return Swal.fire('Error', 'Please provide content and rating.', 'error');
    }

    const result = await Swal.fire({
      title: 'Submit Review?',
      text: 'Are you sure you want to submit this review?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API}/review/create`,
          { bookingId, rating, comment: content },
          {
            headers: { Authorization: `Bearer ${session?.user?.access_token}` },
          },
        );
        Swal.fire('Success!', 'Your review has been submitted.', 'success');
        setIsReviewModalOpen(false);
      } catch (err) {
        console.error('Failed to submit review:', err);
        Swal.fire('Error', 'Failed to submit review.', 'error');
      }
    }
  };

  const handlePayment = async (bookingId: number) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API}/payments/midtrans/${bookingId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${session?.user?.access_token}`,
        },
      }
    );

    const { snapToken } = response.data;

    if (!snapToken || typeof window.snap?.pay !== 'function') {
      return Swal.fire('Error', 'Midtrans Snap is not available.', 'error');
    }

    window.snap.pay(snapToken, {
      onSuccess: async function (res: any) {
        Swal.fire('Success!', 'Payment successful.', 'success');
        try {
          await axios.patch(
            `${process.env.NEXT_PUBLIC_API}/payments/midtrans/${res.order_id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${session?.user?.access_token}`,
              },
            }
          );
          fetchBookings();
        } catch (err) {
          console.error('Status update failed:', err);
        }
      },
      onPending: () =>
        Swal.fire('Pending', 'Waiting for your payment...', 'info'),
      onError: () => Swal.fire('Failed', 'Payment failed.', 'error'),
      onClose: () =>
        Swal.fire('Cancelled', 'You closed the payment popup.', 'info'),
    } as any);
  } catch (err) {
    console.error('Midtrans error:', err);
    Swal.fire('Error', 'Failed to initiate payment.', 'error');
  }
};


  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-black">
      <LoadSnapScript /> {/* Memuat Snap.js */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Purchase List</h1>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 w-full md:w-64">
            <FaSearch className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Search bookings..."
              className="w-full focus:outline-none bg-white text-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (bookings?.length || 0) === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-6 mb-6">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.booking.id}
              booking={booking}
              paymentMethod={booking.booking.paymentMethod}
              onCancel={handleCancel}
              onPayNowClick={handlePayNowClick}
              onGenerateReceipt={handleGenerateReceipt}
              getStatusColor={getStatusColor}
              formattedCheckInDate={formatDisplayDate(
                booking.booking.checkinDate,
              )}
              formattedCheckOutDate={formatDisplayDate(
                booking.booking.checkoutDate,
              )}
              onOpenReviewModal={handleOpenReviewModal}
            />
          ))}
        </div>
      )}
      <UploadPaymentProofModal
        isOpen={isModalOpen}
        previewImage={previewImage}
        onClose={handleCloseModal}
        onUpload={handleUploadPayment}
        onFileChange={handleFileChange}
      />
      <ReviewModal
        isOpen={isReviewModalOpen}
        bookingId={selectedReviewBookingId}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleSubmitReview}
      />
      <PanelPagination
        limit={limit}
        page={page}
        setPage={setPage}
        setLimit={setLimit}
        total={total}
        totalPage={totalPage}
 />
</div>
 );
}
