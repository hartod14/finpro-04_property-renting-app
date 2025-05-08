import BookingInput from './BookingInput';
import BookingSelect from './BookingSelect';

interface BookingSectionProps {
  checkinDate: string;
  setCheckinDate: React.Dispatch<React.SetStateAction<string>>;
  checkoutDate: string;
  setCheckoutDate: React.Dispatch<React.SetStateAction<string>>;
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  handleBooking: () => void;
  totalPrice: number;
}

const BookingSection: React.FC<BookingSectionProps> = ({
  checkinDate,
  setCheckinDate,
  checkoutDate,
  setCheckoutDate,
  paymentMethod,
  setPaymentMethod,
  handleBooking,
  totalPrice,
}) => {
  return (
    <div className="space-y-6 bg-white text-black p-4 rounded-xl shadow-sm border">
      <h2 className="text-xl font-semibold border-b pb-2">Booking Information</h2>
      <div className="space-y-4">
        <BookingInput
          label="Check-In Date"
          id="checkin"
          value={checkinDate}
          onChange={setCheckinDate}
        />
        <BookingInput
          label="Check-Out Date"
          id="checkout"
          value={checkoutDate}
          onChange={setCheckoutDate}
        />
        <BookingSelect
          label="Payment Method"
          id="paymentMethod"
          value={paymentMethod}
          onChange={setPaymentMethod}
        />
      </div>
      <div className="text-lg font-bold text-green-700">
        <p>
          Total Price:{' '}
          {totalPrice
            ? new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(totalPrice)
            : '-'}
        </p>
      </div>
      <button
        type="button"
        onClick={handleBooking}
        className="w-full bg-[#1c2930] hover:bg-[#1c2980] text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
      >
        Booking
      </button>
    </div>
  );
};

export default BookingSection;
