// components/BookingTable.tsx

import React from 'react';
import { format } from 'date-fns';
import { FaSearch } from 'react-icons/fa';
import { Check, CheckCheck, Eye, ReplyAll, X } from 'lucide-react';
import { getStatusColor } from '@/utils/bookings/getStatusColor';
import Swal from 'sweetalert2';

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
  const filteredBookings = (bookings || []).filter((booking) =>
  booking.user?.name?.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg mb-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100 text-center text-gray-700">
          <tr>
            <th className="px-6 py-3 text-sm font-medium">No</th>
            <th className="px-6 py-3 text-sm font-medium">Order Number</th>
            <th className="px-6 py-3 text-sm font-medium">Status</th>
            <th className="px-6 py-3 text-sm font-medium">Customer</th>
            <th className="px-6 py-3 text-sm font-medium">Hotel</th>
            <th className="px-6 py-3 text-sm font-medium">Check-in</th>
            <th className="px-6 py-3 text-sm font-medium">Check-out</th>
            <th className="px-6 py-3 text-sm font-medium">Price</th>
            <th className="px-6 py-3 text-sm font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-800">
          {filteredBookings.map((booking, index) => {
            const statusColor = getStatusColor(booking.status);
            const formattedCheckInDate = booking.checkin_date
              ? format(new Date(booking.checkin_date), 'dd MMM yyyy')
              : 'Invalid';
            const formattedCheckOutDate = booking.checkout_date
              ? format(new Date(booking.checkout_date), 'dd MMM yyyy')
              : 'Invalid';
            const hotelName = booking.room?.property?.name || 'N/A';

            return (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-center">{index + 1}</td>
                <td className="px-6 py-4 text-center">
                  {booking.order_number.slice(0, 6)}...
                  {booking.order_number.slice(-4)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`rounded-lg text-xs font-bold ${statusColor}`}>
                    {booking.status.replaceAll('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">{booking.user.name}</td>
                <td className="px-6 py-4 text-center">{hotelName}</td>
                <td className="px-6 py-4 text-center">{formattedCheckInDate}</td>
                <td className="px-6 py-4 text-center">{formattedCheckOutDate}</td>
                <td className="px-6 py-4 text-center">
                  Rp{' '}
                  {Number(booking.room.base_price).toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 flex justify-center space-x-3 text-center relative">
                  {booking.status !== 'WAITING_FOR_PAYMENT' &&
                    booking.status !== 'CANCELLED' &&
                    booking.status !== 'EXPIRED' &&
                    booking.status !== 'REJECTED' && (
                      <>
                        {booking.status !== 'DONE' && (
                          <div className="relative group">
                            <Eye
                              onClick={() => handleOpenModal(booking.payment?.proof)}
                              className="text-blue-600 hover:text-blue-800 cursor-pointer"
                            />
                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition z-50">
                              Payment Proof
                            </span>
                          </div>
                        )}

                        {booking.status !== 'DONE' && (
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
                                      'success'
                                    );
                                  }
                                })
                              }
                              className="text-green-600 hover:text-green-800 cursor-pointer"
                            />
                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition z-50">
                              Approve
                            </span>
                          </div>
                        )}

                        {booking.status !== 'DONE' && (
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
                                      'success'
                                    );
                                  }
                                })
                              }
                              className="text-red-600 hover:text-red-800 cursor-pointer"
                            />
                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition z-50">
                              Reject
                            </span>
                          </div>
                        )}

                        <div className="relative group">
                          {booking.room?.property?.reviews?.some(
                            (r: any) => r.user?.id === booking.user?.id && r.reply
                          ) ? (
                            <Check className="text-green-600" />
                          ) : (
                            <ReplyAll
                              onClick={() =>
                                handleOpenReplyModal(
                                  booking.room.property_id,
                                  booking.user.id
                                )
                              }
                              className="text-orange-600 hover:text-orange-800 cursor-pointer"
                            />
                          )}
                          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition z-50">
                            {booking.room?.property?.reviews?.some(
                              (r: any) => r.user?.id === booking.user?.id && r.reply
                            )
                              ? 'Replied'
                              : 'Reply Review'}
                          </span>
                        </div>
                      </>
                    )}
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
