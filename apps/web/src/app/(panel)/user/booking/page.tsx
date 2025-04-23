'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import {
  X,
  Banknote,
  Clock,
  CheckCheck,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function PurchaseListPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null,
  );
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  const handleCancel = async (bookingId: number) => {
    if (!bookingId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Booking ID is missing!',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
      customClass: {
        confirmButton: 'bg-red-500 text-white hover:bg-red-600',
        cancelButton: 'bg-gray-300 text-black hover:bg-gray-400',
      },
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/bookings/${bookingId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      Swal.fire({
        icon: 'success',
        title: 'Cancelled!',
        text: 'Your booking has been cancelled.',
      });

      setBookings((prev) =>
        prev.map((item) =>
          item.booking.id === bookingId
            ? {
                ...item,
                booking: {
                  ...item.booking,
                  status: 'CANCELLED',
                },
              }
            : item,
        ),
      );
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: `Failed to cancel booking: ${error.message}`,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WAITING_FOR_PAYMENT':
        return 'bg-yellow-100 text-yellow-800';
      case 'WAITING_FOR_CONFIRMATION':
        return 'bg-orange-100 text-orange-800';
      case 'EXPIRED':
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'DONE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const paginatedBookings = bookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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

  const handleUploadPaymentProof = async () => {
    if (selectedBookingId && paymentProof) {
      const formData = new FormData();
      formData.append('file', paymentProof);

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API}/payments/${selectedBookingId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${session?.user?.access_token}`,
            },
          },
        );

        Swal.fire({
          icon: 'success',
          title: 'Payment Proof Uploaded!',
          text: 'Your payment proof has been uploaded successfully.',
        });

        setIsModalOpen(false);

        setBookings((prev) =>
          prev.map((item) =>
            item.booking.id === selectedBookingId
              ? {
                  ...item,
                  booking: {
                    ...item.booking,
                    status: 'WAITING_FOR_CONFIRMATION',
                  },
                }
              : item,
          ),
        );
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed!',
          text: `Failed to upload payment proof: ${error.message}`,
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-black">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Purchase History
      </h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-6">
          {paginatedBookings.map((booking, index) => (
            <div
              key={index}
              className="border rounded-lg shadow-lg p-5 flex flex-col md:flex-row gap-6 transition-transform duration-300 hover:scale-[1.01] hover:shadow-xl relative"
            >
              {/* Status */}
              <div
                className={`absolute top-3 right-3 px-3 py-1 text-sm font-medium ${getStatusColor(booking.booking.status)} rounded`}
              >
                {booking.booking.status.replaceAll('_', ' ')}
              </div>

              {/* Property Information (Kiri Gambar dan Detail Properti) */}
              <div className="flex-1 flex flex-col">
                <img
                  src={booking.property.image}
                  alt="Property"
                  className="w-full h-56 object-cover rounded-lg shadow-md"
                />
                <h3 className="text-3xl font-semibold text-blue-700 mt-4">
                  {booking.property.name}
                </h3>
                <p className="text-black text-md mt-2">
                  {booking.property.address}
                </p>
              </div>

              {/* Customer Information & Booking Information (Kanan, Posisi Atas-Bawah) */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex flex-col gap-6">
                  {/* Customer Information */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-semibold text-lg text-blue-700">
                      Customer Information
                    </h3>
                    <p className="text-gray-700">{booking.user.name}</p>
                    <p className="text-gray-700 my-1">{booking.user.email}</p>
                    <p className="text-gray-700">0{booking.user.phone}</p>
                  </div>

                  {/* Booking Information */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-semibold text-lg text-blue-700">
                      Booking Information
                    </h3>
                    <p>
                      <strong>Room Type:</strong> {booking.room.name}
                    </p>
                    <p className="my-1">
                      <strong>Capacity:</strong> {booking.room.capacity} persons
                    </p>
                    <div className="text-gray-700">
                      <strong>Check-in:</strong> {booking.booking.checkinDate}
                    </div>
                    <div className="text-gray-700 my-1">
                      <strong>Check-out:</strong> {booking.booking.checkoutDate}
                    </div>
                    <div className="text-gray-700">
                      <strong>Price:</strong>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-lg font-semibold rounded-lg">
                        Rp{' '}
                        {parseInt(booking.room.price).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-end gap-4">
                  {booking.booking.status === 'DONE' ? (
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
                      <CheckCheck className="w-5 h-5" />
                      Completed
                    </button>
                  ) : booking.booking.status === 'WAITING_FOR_CONFIRMATION' ? (
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md cursor-not-allowed">
                      <Clock className="w-5 h-5" />
                      Under Review
                    </button>
                  ) : (
                    !['EXPIRED', 'CANCELLED'].includes(
                      booking.booking.status,
                    ) && (
                      <button
                        onClick={() => handlePayNowClick(booking.booking.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                      >
                        <Banknote className="w-5 h-5" />
                        Pay Now
                      </button>
                    )
                  )}

                  {![
                    'EXPIRED',
                    'CANCELLED',
                    'DONE',
                    'WAITING_FOR_CONFIRMATION',
                  ].includes(booking.booking.status) && (
                    <button
                      onClick={() => handleCancel(booking.booking.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Proof Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Upload Payment Proof</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mb-4 max-h-64 object-contain border rounded"
              />
            )}
            <div className="flex justify-between">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
              <button
                onClick={handleUploadPaymentProof}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Upload Proof
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6 items-center space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-2 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Display Page Numbers */}
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-3 py-2 text-sm rounded-md ${
                  pageNumber === currentPage
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-blue-500 hover:bg-blue-100'
                } transition-colors`}
              >
                {pageNumber}
              </button>
            ),
          )}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-2 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
