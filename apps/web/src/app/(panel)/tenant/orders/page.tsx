'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { FaSearch } from 'react-icons/fa';
import BookingTable from '@/components/orders/BookingTable';
import PaymentProofModal from '@/components/orders/PaymentProofModal';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';
import ReplyReviewModal from '@/components/orders/ReviewReplyModal';
import { PanelPagination } from '@/components/common/pagination/panelPagination';

export default function TenantPropertyListOrderPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [proofImage, setProofImage] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  // Pagination state management
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  // Fetch orders with calculations
  const fetchAllOrders = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/tenant/${session.user.id}/orders`,
        {
          params: {
            search,
            page,
            limit,
          },
          headers: {
            Authorization: `Bearer ${session.user.access_token}`,
          },
        }
      );
      const bookingsWithCalculatedPrices = res.data.bookings.map((booking: any) => {
        // Example calculation based on base price
        const totalPrice = booking.room.base_price * booking.room.nights;
        return { ...booking, total_price: totalPrice };
      });
      setBookings(bookingsWithCalculatedPrices);
      setTotal(res.data.total);
      setTotalPage(Math.ceil(res.data.total / limit));
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [session, search, page, limit]);

  const handleOpenModal = (proofUrl: string) => {
    setProofImage(proofUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProofImage('');
  };

  const handleApprove = async (bookingId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/tenant/${session?.user.id}/booking/${bookingId}/confirm`,
        { accept: true },
        {
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
          },
        }
      );
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'DONE' } : b))
      );
    } catch (err) {
      console.error('Failed to approve booking:', err);
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/tenant/${session?.user.id}/booking/${bookingId}/confirm`,
        { accept: false },
        {
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
          },
        }
      );
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: 'REJECTED' } : b
        )
      );
    } catch (err) {
      console.error('Failed to reject booking:', err);
    }
  };

  const handleOpenReplyModal = async (propertyId: number, userId: number) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/review/property/${propertyId}`
      );
      const review = res.data.data.find((r: any) => r.user.id === userId);

      if (review) {
        setSelectedReview(review);
        setReplyText('');
        setShowReplyModal(true);
      } else {
        Swal.fire('Not Found', 'No review found for this customer.', 'info');
      }
    } catch (error) {
      console.error('Error fetching review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText || !selectedReview) return;
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/review/reply/${selectedReview.id}`,
        { reply: replyText },
        {
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
          },
        }
      );
      Swal.fire('Success', 'Reply submitted successfully!', 'success');
      setShowReplyModal(false);
    } catch (error: any) {
      Swal.fire(
        'Error',
        error?.response?.data?.message || 'Failed to submit reply.',
        'error'
      );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-6">All Booking Orders</h1>

      {/* Search */}
      <div className="flex mb-6 bg-white border border-gray-300 rounded-md w-full md:w-1/3 px-3 py-2">
        <FaSearch className="text-gray-500 mr-3 my-auto" />
        <input
          type="text"
          placeholder="Search by customer name"
          className="w-full focus:outline-none bg-white text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <BookingTable
        bookings={bookings}
        search={search}
        handleOpenModal={handleOpenModal}
        handleApprove={handleApprove}
        handleReject={handleReject}
        handleOpenReplyModal={handleOpenReplyModal}
      />

      {/* Modal: Payment Proof */}
      <PaymentProofModal
        showModal={showModal}
        proofImage={proofImage}
        onClose={handleCloseModal}
      />

      {/* Modal: Reply Review */}
      <ReplyReviewModal
        showModal={showReplyModal}
        selectedReview={selectedReview}
        replyText={replyText}
        setReplyText={setReplyText}
        handleSubmitReply={handleSubmitReply}
        handleCloseModal={() => setShowReplyModal(false)}
        loading={loading}
      />

      {/* Pagination */}
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
