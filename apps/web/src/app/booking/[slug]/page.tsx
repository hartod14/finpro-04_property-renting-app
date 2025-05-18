'use client';
import Swal from 'sweetalert2';
import Footer from '@/components/common/footer/footer';
import Navbar from '@/components/common/navbar/navbar';
import { useSearchParams, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import BookingSection from '@/components/bookings/BookingSection';
import { format } from 'date-fns';
import BookingSummary from '@/components/bookings/BookingSummary';

interface BookingSummary {
  property: {
    name: string;
    address: string;
    image: string;
  };
  room: {
    id: number;
    name: string;
    base_price: number;
    adjusted_price?: number;
    capacity: number;
    image: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
    image: string;
    phone: string;
  };
}

const formatDisplayDate = (date: Date | null | undefined) => {
  if (!date) return '';
  return format(date, 'dd MMMM yyyy');
};

export default function BookingPage() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const params = useParams();
  const slug = params.slug;

  const roomId = searchParams.get('roomId');
  const checkinParam = searchParams.get('startDate');
  const checkoutParam = searchParams.get('endDate');
  const adults = searchParams.get('adults');

  const [summary, setSummary] = useState<BookingSummary | null>(null);
  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && status === 'unauthenticated') {
      window.location.href = '/auth/user/login';
    }
  }, [isClient, status]);

  useEffect(() => {
    if (checkinParam) {
      const parsedCheckin = new Date(checkinParam);
      if (!isNaN(parsedCheckin.getTime())) {
        setCheckinDate(parsedCheckin);
      }
    }
    if (checkoutParam) {
      const parsedCheckout = new Date(checkoutParam);
      if (!isNaN(parsedCheckout.getTime())) {
        setCheckoutDate(parsedCheckout);
      }
    }
  }, [checkinParam, checkoutParam]);

  useEffect(() => {
    const fetchData = async () => {
      if (!roomId || !checkinParam || !checkoutParam) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/bookings/room/${roomId}?startDate=${checkinParam}&endDate=${checkoutParam}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.access_token}`,
            },
          },
        );

        if (!res.ok) throw new Error('Failed to fetch booking summary');

        const data = await res.json();
        setSummary(data);
      } catch (error) {
        console.error('Error fetching booking summary:', error);
      }
    };

    fetchData();
  }, [roomId, session?.user?.access_token, checkinParam, checkoutParam]);

  const handleBooking = async () => {
    if (!checkinDate || !checkoutDate || !paymentMethod) {
      Swal.fire('Error', 'Please fill in all booking details.', 'error');
      return;
    }

    if (checkoutDate <= checkinDate) {
      Swal.fire(
        'Invalid Dates',
        'Checkout date must be after checkin date.',
        'error',
      );
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/bookings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.user?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          roomId: Number(roomId),
          checkinDate: checkinDate.toISOString().split('T')[0],
          checkoutDate: checkoutDate.toISOString().split('T')[0],
          paymentMethod,
          amount: summary?.room.adjusted_price || summary?.room.base_price,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Booking failed: ${errorData.message || 'Unknown error'}`,
        );
      }

      Swal.fire(
        'Success',
        'Booking confirmed! Check your order on profile',
        'success',
      ).then(() => {
        window.location.replace('/user/booking');
      });
    } catch (error: any) {
      console.error('Error creating booking:', error);
      Swal.fire(
        'Error',
        error.message || 'Booking failed. Please try again.',
        'error',
      );
    }
  };

  const calculateTotalPrice = () => {
    return summary?.room.adjusted_price || summary?.room.base_price || 0;
  };

  const totalPrice = calculateTotalPrice();

  if (!isClient) return null;

  return (
    <>
      <Navbar forceScrolled={true} />
      <main className="min-h-screen pt-28 bg-gray-50 px-6 md:px-16 lg:px-32 text-gray-900">
        <h1 className="text-4xl font-extrabold text-center mb-10 tracking-tight">
          Booking Summary
        </h1>

       <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 -mt-32">
  <div className="max-w-7xl w-full grid gap-10 grid-cols-1 md:grid-cols-3">
    <div className="md:col-span-1">
      <BookingSummary summary={summary} />
    </div>

    <div className="md:col-span-2">
      <BookingSection
        checkinDate={checkinDate ? formatDisplayDate(checkinDate) : ''}
        checkoutDate={checkoutDate ? formatDisplayDate(checkoutDate) : ''}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        handleBooking={handleBooking}
        totalPrice={totalPrice}
        disableDateEdit={true}
        summary={summary}
      />
    </div>
  </div>
</div>

      </main>
      <Footer />
    </>
  );
}
