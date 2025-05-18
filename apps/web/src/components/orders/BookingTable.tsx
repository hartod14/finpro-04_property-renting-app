import React from 'react';
import Swal from 'sweetalert2';
import { Check, CheckCheck, Eye, ReplyAll, X } from 'lucide-react';

import { formatStatus } from '@/utils/bookings/formatStatus';
import { formatDate } from '@/utils/bookings/formatDate';
import { formatCurrency } from '@/utils/bookings/formatCurrency';

export type BookingStatus =
  | 'WAITING_FOR_PAYMENT'
  | 'WAITING_FOR_CONFIRMATION'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'DONE'
  | string;

export const getStatusColor = (status: BookingStatus): string => {
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

interface BookingTableProps {
  bookings: any[];
  search: string;
  handleOpenModal: (proofUrl: string) => void;
  handleApprove: (bookingId: string) => void;
  handleReject: (bookingId: string) => void;
  handleOpenReplyModal: (propertyId: number, userId: number) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  search,
  handleOpenModal,
  handleApprove,
  handleReject,
  handleOpenReplyModal,
}) => {
  const filteredBookings = bookings.filter((booking) =>
    booking.user?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg mb-4">
      <table className="min-w-full divide-y divide-gray-200 rounded-xl shadow-sm overflow-hidden text-sm">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3 text-center">No</th>
            <th className="px-4 py-3 text-center">Customer</th>
            <th className="px-4 py-3 text-center">Hotel</th>
            <th className="px-4 py-3 text-center">Check-in</th>
            <th className="px-4 py-3 text-center">Check-out</th>
            <th className="px-4 py-3 text-center">Price</th>
            <th className="px-4 py-3 text-center">Payment</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-100 text-gray-800">
          {filteredBookings.map((booking, index) => {
            const statusColor = getStatusColor(booking.status);
            const paymentMethod = booking.payment?.method || 'N/A';

            return (
              <tr
                key={booking.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-3 text-center">{index + 1}</td>
                <td className="px-4 py-3">{booking.user.name}</td>
                <td className="px-4 py-3">
                  {booking.room?.property?.name || 'N/A'}
                </td>
                <td className="px-4 py-3 text-center">
                  {formatDate(booking.checkin_date)}
                </td>
                <td className="px-4 py-3 text-center">
                  {formatDate(booking.checkout_date)}
                </td>
                <td className="px-4 py-3 text-center">
                  {formatCurrency(booking.payment.amount)}
                </td>
                <td className="px-4 py-3 text-center">{paymentMethod}</td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-semibold ${statusColor}`}
                  >
                    {formatStatus(booking.status)}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center justify-center space-x-2 text-[10px] relative">
                    {[
                      'WAITING_FOR_PAYMENT',
                      'CANCELLED',
                      'EXPIRED',
                      'REJECTED',
                    ].includes(booking.status) ? null : (
                      <>
                        {booking.status !== 'DONE' && (
                          <>
                            {/* Eye hanya untuk selain MIDTRANS */}
                            {booking.payment?.method !== 'MIDTRANS' && (
                              <div className="relative group">
                                <Eye
                                  onClick={() =>
                                    handleOpenModal(booking.payment?.proof)
                                  }
                                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                />
                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition">
                                  Payment Proof
                                </span>
                              </div>
                            )}

                            {/* ✅ Approve selalu muncul, MIDTRANS maupun bukan */}
                            <div className="relative group">
                              <CheckCheck
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
                                className="text-green-600 hover:text-green-800 cursor-pointer"
                              />
                              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition">
                                Approve
                              </span>
                            </div>

                            <div className="relative group">
                              <X
                                onClick={() =>
                                  Swal.fire({
                                    title: 'Are you sure?',
                                    text: 'This booking will be rejected.',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#ef4444',
                                    cancelButtonColor: '#22c55e',
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
                                className="text-red-600 hover:text-red-800 cursor-pointer"
                              />
                              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition">
                                Reject
                              </span>
                            </div>
                          </>
                        )}

                        {booking.status === 'DONE' && (
                          <div className="relative group">
                            {booking.room?.property?.reviews?.some(
                              (r: any) =>
                                r.user?.id === booking.user?.id && r.reply,
                            ) ? (
                              <Check className="text-green-600" />
                            ) : (
                              <ReplyAll
                                onClick={() =>
                                  handleOpenReplyModal(
                                    booking.room.property_id,
                                    booking.user.id,
                                  )
                                }
                                className="text-orange-600 hover:text-orange-800 cursor-pointer"
                              />
                            )}
                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition">
                              {booking.room?.property?.reviews?.some(
                                (r: any) =>
                                  r.user?.id === booking.user?.id && r.reply,
                              )
                                ? 'Replied'
                                : 'Reply Review'}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
