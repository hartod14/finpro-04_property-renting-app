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
}

const BookingSection: React.FC<BookingSectionProps> = ({
  checkinDate,
  checkoutDate,
  paymentMethod,
  setPaymentMethod,
  handleBooking,
  totalPrice,
  disableDateEdit = false,
}) => {
  return (
    <div className="space-y-6 bg-white text-black p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold border-b pb-3">Booking Information</h2>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="checkin" className="block text-sm font-medium text-gray-700">Check-In Date</label>
          <input
            type="text"
            id="checkin"
            value={checkinDate}
            readOnly={disableDateEdit}
            className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-3 ${disableDateEdit ? 'bg-primary text-white text-center font-bold cursor-not-allowed' : ''}`}
          />
        </div>

         <div className="text-black flex-shrink-0 mt-10">
          <ArrowRight size={17} />
        </div>

        <div className="flex-1">
          <label htmlFor="checkout" className="block text-sm font-medium text-gray-700">Check-Out Date</label>
          <input
            type="text"
            id="checkout"
            value={checkoutDate}
            readOnly={disableDateEdit}
            className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-3 ${disableDateEdit ? 'bg-primary text-white text-center font-bold cursor-not-allowed' : ''}`}
          />
        </div>
      </div>

      <BookingSelect
        label="Payment Method"
        id="paymentMethod"
        value={paymentMethod}
        onChange={setPaymentMethod}
      />

      {/* Total Price Section */}
      <div className="text-lg font-semibold text-green-600 mt-4">
        <p>
          Total Price: 
          {totalPrice
            ? new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(totalPrice)
            : '-'}
        </p>
      </div>

      {/* Booking Button */}
      <button
        type="button"
        onClick={handleBooking}
        className="w-full bg-[#1c2930] hover:bg-[#1c2980] text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg mt-6"
      >
        Book Now
      </button>
    </div>
  );
};

export default BookingSection;
