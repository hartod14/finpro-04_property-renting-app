'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BookingFormProps {
  userId?: number;
  roomId?: number;
}

const BookingForm: React.FC<BookingFormProps> = ({
  userId = 1,
  roomId = 1,
}) => {
  const [checkinDate, setCheckinDate] = useState('');
  const [checkoutDate, setCheckoutDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('MANUAL');
  const [amount, setAmount] = useState(0);
  const [isBookingCreated, setIsBookingCreated] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!checkinDate || !checkoutDate || amount <= 0 || !userId || !roomId) {
      alert('Please fill in all required fields');
      return;
    }

    const checkinDateISO = new Date(checkinDate).toISOString();
    const checkoutDateISO = new Date(checkoutDate).toISOString();

    if (
      isNaN(new Date(checkinDate).getTime()) ||
      isNaN(new Date(checkoutDate).getTime())
    ) {
      alert('Invalid date format');
      return;
    }

    const bookingData = {
      userId,
      roomId,
      checkinDate: checkinDateISO,
      checkoutDate: checkoutDateISO,
      paymentMethod,
      amount,
    };

    try {
      const response = await fetch('http://localhost:8000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setIsBookingCreated(true);
      } else {
        const errorMessage = await response.text();
        alert(`Error creating booking: ${errorMessage}`);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert(`An error occurred while creating booking: ${errorMessage}`);
    }
  };

  const handleRedirect = () => {
    router.push('/payment');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg my-40">
      <h2 className="text-2xl font-bold text-center mb-4 text-black">
        TESTING BOOKING TRANSACTION
      </h2>

      {isBookingCreated && (
        <div className="mb-4 px-4 py-2 bg-green-100 text-green-800 border border-green-400 rounded-md text-sm text-center">
          Booking berhasil! Silakan lanjut ke pembayaran.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label
              htmlFor="checkinDate"
              className="block text-sm font-semibold text-gray-700"
            >
              Tanggal Check-in
            </label>
            <input
              type="date"
              id="checkinDate"
              value={checkinDate}
              onChange={(e) => setCheckinDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-sm"
              required
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="checkoutDate"
              className="block text-sm font-semibold text-gray-700"
            >
              Tanggal Check-out
            </label>
            <input
              type="date"
              id="checkoutDate"
              value={checkoutDate}
              onChange={(e) => setCheckoutDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="paymentMethod"
            className="block text-sm font-semibold text-gray-700"
          >
            Metode Pembayaran
          </label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-sm"
            required
          >
            <option value="MANUAL">Manual</option>
            <option value="MIDTRANS">Midtrans</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-semibold text-gray-700"
          >
            Jumlah
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-md text-sm"
            required
          />
        </div>

        <div className="text-center">
          {isBookingCreated ? (
            <button
              type="button"
              onClick={handleRedirect}
              className="px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              Continue Payment
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Booking
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
