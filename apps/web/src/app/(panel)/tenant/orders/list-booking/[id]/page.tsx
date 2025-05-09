'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { getStatusColor } from '@/utils/bookings/getStatusColor';
import { format } from 'date-fns';
import { FaEye, FaArrowLeft } from 'react-icons/fa';
import { CheckCheck, X } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ListBookingPage() {
  const params = useParams();
  const { data: session } = useSession();
  const propertyId = params?.id as string;
  const [bookings, setBookings] = useState<any[]>([]);
  const [propertyName, setPropertyName] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [proofImage, setProofImage] = useState<string>(''); // To store the image URL for modal
  const router = useRouter(); // Inisialisasi useRouter

  useEffect(() => {
    const fetchBookings = async () => {
      if (!session?.user || !propertyId) return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/tenant/${session.user.id}/orders`,
          {
            headers: {
              Authorization: `Bearer ${session.user.access_token}`,
            },
          },
        );

        const filtered = res.data.filter(
          (booking: any) => booking.room.property.id.toString() === propertyId,
        );
        setBookings(filtered);

        // Ambil nama properti dari booking pertama yang ada
        if (filtered.length > 0) {
          setPropertyName(filtered[0].room.property.name);
        }
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      }
    };

    fetchBookings();
  }, [propertyId, session]);

  const handleOpenModal = (proofUrl: string) => {
    setProofImage(proofUrl); // Set the proof image URL to state
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setProofImage(''); // Clear the proof image URL
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
        },
      );
      // Refresh data
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'DONE' } : b)),
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
        },
      );
      // Refresh data
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: 'REJECTED' } : b,
        ),
      );
    } catch (err) {
      console.error('Failed to reject booking:', err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-black">
      <div
        className="flex items-center mb-6 cursor-pointer"
        onClick={() => router.push('/tenant/orders')}
      >
        <FaArrowLeft size={20} className="mr-2" />
        <span className="text-xl font-semibold">My Properties</span>
      </div>

      <h1 className="text-3xl font-bold mb-6">
        List Booking - {propertyName || 'Loading...'}
      </h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking: any) => {
            console.log(booking);
            const statusColor = getStatusColor(booking.status);
            const formattedCheckInDate = booking.checkin_date
              ? format(new Date(booking.checkin_date), 'dd MMM yyyy')
              : 'Tanggal tidak valid';

            const formattedCheckOutDate = booking.checkout_date
              ? format(new Date(booking.checkout_date), 'dd MMM yyyy')
              : 'Tanggal tidak valid';

            return (
              <div
                key={booking.id}
                className="border rounded-lg shadow-lg p-5 flex flex-col md:flex-row gap-6 transition-transform duration-300 hover:scale-[1.01] hover:shadow-xl relative"
              >
                {/* Property Info and Status */}
                <div className="relative flex-1 flex flex-col">
                  {/* Status in the top-left corner */}
                  <div
                    className={`absolute top-3 left-3 px-3 py-1 text-sm font-medium ${statusColor} rounded`}
                  >
                    {booking.status.replaceAll('_', ' ')}
                  </div>
                  <img
                    src={
                      booking.room.property.propertyImages[0]?.path ||
                      '/default-property.jpg'
                    }
                    alt="Property"
                    className="w-full h-56 object-cover rounded-lg shadow-md"
                  />
                  <p className="text-lg font-semibold text-blue-600 mt-2">
                    <span className="text-gray-500">Room Type: </span>
                    {booking.room.name}
                  </p>

                  <p className="text-lg font-semibold text-blue-600 my-1">
                    <span className="text-gray-500">Capacity: </span>
                    {booking.room.capacity} persons
                  </p>
                </div>

                {/* User & Info Section (Customer, Booking, and Payment Info) */}
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Customer Info */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-semibold text-lg text-blue-700 mb-2">
                        Customer Information
                      </h3>
                      <p className="text-gray-700">{booking.user.name}</p>
                      <p className="text-gray-700 my-1">{booking.user.email}</p>
                      <p className="text-gray-700">0{booking.user.phone}</p>
                    </div>

                    {/* Booking Info */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-semibold text-lg text-blue-700 mb-2">
                        Booking Information
                      </h3>
                      <p className="text-gray-700">
                        <strong>Check-in:</strong> {formattedCheckInDate}
                      </p>
                      <p className="text-gray-700 my-1">
                        <strong>Check-out:</strong> {formattedCheckOutDate}
                      </p>
                      <p className="text-gray-700">
                        <strong>Price:</strong>{' '}
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-lg font-semibold rounded-lg">
                          Rp{' '}
                          {Number(booking.room.base_price).toLocaleString(
                            'id-ID',
                          )}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="flex flex-col mt-4">
                    <h3 className="font-semibold text-lg text-blue-700 mb-2">
                      Payment Information
                    </h3>
                    <p className="text-gray-700">
                      <strong>Payment Method:</strong>{' '}
                      {booking.payment?.method || 'Unpaid'}
                    </p>
                    {booking.payment?.status && (
                      <p className="text-gray-700">
                        <strong>Payment Status:</strong>{' '}
                        {booking.payment.status}
                      </p>
                    )}
                    {booking.payment?.transaction_id && (
                      <p className="text-gray-700">
                        <strong>Transaction ID:</strong>{' '}
                        {booking.payment.transaction_id}
                      </p>
                    )}
                    {/* Payment Proof */}
                    <div className="group flex items-center relative">
                      <strong className="mr-2">Payment Proof:</strong>
                      {booking.payment?.proof ? (
                        <button
                          onClick={() => handleOpenModal(booking.payment.proof)} // Pass proof URL to open modal
                          className="text-blue-600 hover:text-blue-800 focus:outline-none relative"
                        >
                          <FaEye size={20} />
                          {/* Tooltip "View" muncul di sebelah kanan ikon */}
                          <span className="absolute left-full ml-2 bottom-0 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-200 px-2 py-1 rounded-md shadow-md">
                            View
                          </span>
                        </button>
                      ) : (
                        <span className="text-gray-500">
                          No payment proof available
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Approve & Reject Buttons */}
                  <div className="absolute bottom-3 right-4 flex gap-4">
                    {booking.status !== 'REJECTED' &&
                    booking.status !== 'DONE' &&
                    booking.payment?.proof ? (
                      <>
                        <button
                          onClick={() =>
                            Swal.fire({
                              title: 'Are you sure?',
                              text: 'This booking will be approved.',
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor: '#22c55e',
                              cancelButtonColor: '#ef4444',
                              confirmButtonText: 'Yes, approve it!',
                            }).then((result) => {
                              if (result.isConfirmed) {
                                handleApprove(booking.id);
                                Swal.fire(
                                  'Approved!',
                                  'Booking has been approved.',
                                  'success',
                                );
                              }
                            })
                          }
                          className="w-40 font-bold bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
                        >
                          <CheckCheck className="inline mr-2" /> Approve
                        </button>
                        <button
                          onClick={() =>
                            Swal.fire({
                              title: 'Are you sure?',
                              text: 'This booking will be rejected.',
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor: '#ef4444',
                              cancelButtonColor: '#6b7280',
                              confirmButtonText: 'Yes, reject it!',
                            }).then((result) => {
                              if (result.isConfirmed) {
                                handleReject(booking.id);
                                Swal.fire(
                                  'Rejected!',
                                  'Booking has been rejected.',
                                  'success',
                                );
                              }
                            })
                          }
                          className="w-40 font-bold bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
                        >
                          <X className="inline mr-2" /> Reject
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal to display payment proof */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-2 rounded-lg shadow-lg max-w-3xl w-full relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-600 focus:outline-none mr-1 mt-1"
            >
              X
            </button>
            <img
              src={proofImage}
              alt="Payment Proof"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
