import { Clock, Receipt, X, CreditCard } from 'lucide-react';
import { useState } from 'react';

interface BookingCardProps {
  booking: any;
  onCancel: (bookingId: number) => void;
  onPayNowClick: (bookingId: number) => void;
  onGenerateReceipt: (booking: any) => void;
  getStatusColor: (status: string) => string;
  formattedCheckInDate: string;
  formattedCheckOutDate: string;
}

export const BookingCard = ({
  booking,
  onCancel,
  onPayNowClick,
  onGenerateReceipt,
  getStatusColor,
  formattedCheckInDate,
  formattedCheckOutDate,
}: BookingCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const statusColorClass = getStatusColor(booking.booking.status);

  return (
    <div
      className="border rounded-lg shadow-lg p-5 flex flex-col md:flex-row gap-6 transition-transform duration-300 hover:scale-[1.01] hover:shadow-xl relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status */}
      <div
        className={`absolute top-3 right-3 px-3 py-1 text-sm font-medium ${statusColorClass} rounded`}
      >
        {booking.booking.status.replaceAll('_', ' ')}
      </div>

      {/* Property Info */}
      <div className="flex-1 flex flex-col">
        <img
          src={booking.property.image}
          alt="Property"
          className="w-full h-56 object-cover rounded-lg shadow-md"
        />
        <h3 className="text-3xl font-semibold text-blue-700 mt-4">
          {booking.property.name}
        </h3>
        <p className="text-black text-md mt-2">{booking.property.address}</p>
      </div>

      {/* Customer & Booking Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-6">
          {/* Customer Info */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-semibold text-lg text-blue-700">
              Customer Information
            </h3>
            <p className="text-gray-700">{booking.user.name}</p>
            <p className="text-gray-700 my-1">{booking.user.email}</p>
            <p className="text-gray-700">0{booking.user.phone}</p>
          </div>

          {/* Booking Info */}
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
            <p className="text-gray-700">
              <strong>Check-in:</strong> {formattedCheckInDate}
            </p>
            <p className="text-gray-700 my-1">
              <strong>Check-out:</strong> {formattedCheckOutDate}
            </p>
            <p className="text-gray-700">
              <strong>Price:</strong>{' '}
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-lg font-semibold rounded-lg">
                Rp {parseInt(booking.room.price).toLocaleString('id-ID')}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-end gap-4 flex-wrap">
          {booking.booking.status === 'DONE' && (
            <button
              onClick={() => onGenerateReceipt(booking)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              <Receipt className="w-5 h-5" />
              Generate Receipt
            </button>
          )}

          {booking.booking.status === 'WAITING_FOR_PAYMENT' && (
            <button
              onClick={() => onPayNowClick(booking.booking.id)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 flex gap-2"
            >
              <CreditCard className="w-5" />
              Payment
            </button>
          )}

          {(booking.booking.status === 'WAITING_FOR_PAYMENT' ||
            booking.booking.status === 'WAITING_FOR_CONFIRMATION') &&
            booking.booking.status !== 'WAITING_FOR_CONFIRMATION' && (
              <button
                onClick={() => onCancel(booking.booking.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 flex gap-2"
              >
                <X className="w-5" />
                Cancel Booking
              </button>
            )}

          {booking.booking.status === 'WAITING_FOR_CONFIRMATION' && (
            <button
              disabled
              className="px-4 py-2 bg-orange-500 text-white rounded-md cursor-not-allowed flex gap-2"
            >
              <Clock className="w-5" />
              Under Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
