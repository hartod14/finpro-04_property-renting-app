import { ArrowRight } from 'lucide-react';
import BookingSelect from './BookingSelect';

interface BookingSectionProps {
  checkinDate: string;
  checkoutDate: string;
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  handleBooking: () => void;
  totalPrice: number;
  disableDateEdit?: boolean;
  summary?: any;
}

const BookingSection: React.FC<BookingSectionProps> = ({
  checkinDate,
  checkoutDate,
  paymentMethod,
  setPaymentMethod,
  handleBooking,
  totalPrice,
  disableDateEdit = false,
  summary,
}) => {
  return (
    <div className="space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl">
      {/* Property Info */}
      {summary && (
        <div className="grid grid-cols-[auto_1fr] gap-4 items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
          <img
            src={summary.room.image || 'https://via.placeholder.com/120'}
            alt="Room"
            className="w-28 h-28 scale-110 rounded-2xl object-cover transition-transform duration-300"
          />
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {summary.room.name}
            </h3>
            <p className="text-sm text-gray-600">
              {summary.room.capacity} guest
              {summary.room.capacity > 1 ? 's' : ''}
            </p>
            <div className="pt-2 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-800">
                {summary.property.name}
              </h4>
              <p className="text-sm text-gray-500">
                {summary.property.address}
              </p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-3 pt-2">
        📝 Booking Details
      </h2>

      <div className="flex flex-col md:flex-row md:gap-4 gap-4">
        <div className="flex-1">
          <label htmlFor="checkin" className="block text-sm text-gray-600 mb-1">
            Check-In
          </label>
          <input
            type="text"
            id="checkin"
            value={checkinDate}
            readOnly={disableDateEdit}
            className={`w-full rounded-xl border-gray-300 shadow-inner text-sm px-4 py-3 focus:outline-none ${disableDateEdit ? 'bg-primary text-white text-center font-semibold cursor-not-allowed' : 'bg-gray-50'}`}
          />
        </div>

        <div className="flex items-center justify-center mt-2 md:mt-8 text-gray-400">
          <ArrowRight size={18} />
        </div>

        <div className="flex-1">
          <label
            htmlFor="checkout"
            className="block text-sm text-gray-600 mb-1"
          >
            Check-Out
          </label>
          <input
            type="text"
            id="checkout"
            value={checkoutDate}
            readOnly={disableDateEdit}
            className={`w-full rounded-xl border-gray-300 shadow-inner text-sm px-4 py-3 focus:outline-none ${disableDateEdit ? 'bg-primary text-white text-center font-semibold cursor-not-allowed' : 'bg-gray-50'}`}
          />
        </div>
      </div>

      <div className="pt-2">
        <BookingSelect
          label="💳 Payment Method"
          id="paymentMethod"
          value={paymentMethod}
          onChange={setPaymentMethod}
        />
      </div>

      <div className="text-lg font-bold text-emerald-700 bg-emerald-50 rounded-xl px-5 py-4 text-center shadow-sm">
        Total Price:{' '}
        {totalPrice
          ? new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(totalPrice)
          : '-'}
      </div>

      <button
        type="button"
        onClick={handleBooking}
        className="w-full bg-gradient-to-br from-indigo-600 to-indigo-800 hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform transition-transform duration-200 hover:scale-105"
      >
        Book Now
      </button>
    </div>
  );
};

export default BookingSection;
