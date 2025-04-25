'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { format } from 'date-fns'; 
import { handleUploadPaymentProof as uploadPaymentProof } from '@/utils/bookings/handleUploadPaymentProof';
import 'react-datepicker/dist/react-datepicker.css';
import { generateReceipt } from '@/utils/bookings/generateReceipt';
import { BookingCard } from '@/components/bookings/BookingCard';
import { UploadPaymentProofModal } from '@/components/bookings/UploadPaymentProofModal';
import { handleCancelBooking } from '@/utils/bookings/handleCancelBooking';
import { getStatusColor } from '@/utils/bookings/getStatusColor';
import { SearchAndFilter } from '@/components/bookings/SearchAndFilter';
import { Pagination } from '@/components/bookings/Pagination';
import { filterBookings } from '@/utils/bookings/filterBookings';
import { getTotalPages } from '@/utils/bookings/getTotalPages';
import { getPaginatedBookings } from '@/utils/bookings/getPaginatedBookings';

export default function PurchaseListPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchDate, setSearchDate] = useState<Date | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const filteredBookings = filterBookings(bookings, searchQuery, searchDate);
  const totalPages = getTotalPages(filteredBookings, itemsPerPage);
  const paginatedBookings = getPaginatedBookings(filteredBookings, currentPage, itemsPerPage);

  useEffect(() => {
    const fetchBookings = async () => {
      if (session?.user?.id) {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API}/bookings`,
            {
              params: { userId: session.user.id },
              headers: {
                Authorization: `Bearer ${session?.user?.access_token}`,
              },
            },
          );

          const sortedBookings = res.data.sort(
            (a: any, b: any) => b.booking.id - a.booking.id,
          );
          setBookings(sortedBookings);
        } catch (error) {
          console.error('Failed to fetch bookings:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookings();
  }, [session]);

  const handleCancel = (bookingId: number) => {
    handleCancelBooking(bookingId, session?.user?.access_token!, setBookings);
  };

  if (loading) return <p className="text-black">Loading...</p>;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setPaymentProof(file);
    }
  };

  const handlePayNowClick = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBookingId(null);
    setPaymentProof(null);
  };

  const handleUploadPaymentProof = () => {
    uploadPaymentProof(
      selectedBookingId,
      paymentProof,
      session?.user?.access_token!,
      setIsModalOpen,
      setBookings,
    );
  };

  const handleGenerateReceipt = (booking: any) => {
    generateReceipt(booking);
  };

  // Format tanggal menggunakan date-fns pada booking check-in date
  const formatBookingDate = (date: Date) => {
    return format(new Date(date), 'dd MMM yyyy'); // Format tanggal sesuai kebutuhan
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Purchase List</h1>
        <div className="flex items-center space-x-4">
          <SearchAndFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchDate={searchDate}
            setSearchDate={setSearchDate}
          />
        </div>
      </div>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-6">
          {paginatedBookings.map((booking, index) => (
            <BookingCard
              key={index}
              booking={booking}
              onCancel={handleCancel}
              onPayNowClick={handlePayNowClick}
              onGenerateReceipt={handleGenerateReceipt}
              getStatusColor={getStatusColor}
              formattedCheckInDate={format(
                new Date(booking.booking.checkinDate),
                'dd MMM yyyy'
              )}
              formattedCheckOutDate={format(
                new Date(booking.booking.checkoutDate),
                'dd MMM yyyy'
              )}
            />
          ))}
        </div>
      )}

      <UploadPaymentProofModal
        isOpen={isModalOpen}
        previewImage={previewImage}
        onClose={handleCloseModal}
        onUpload={handleUploadPaymentProof}
        onFileChange={handleFileChange}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
