'use client';
import Swal from 'sweetalert2';
import Footer from '@/components/common/footer/footer';
import Navbar from '@/components/common/navbar/navbar';
import { useSearchParams, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import BookingSummary from '@/components/bookings/BookingSummary';
import BookingSection from '@/components/bookings/BookingSection';

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

export default function BookingPage() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const params = useParams();
  const slug = params.slug;
  const roomId = searchParams.get('roomId');
  const [summary, setSummary] = useState<BookingSummary | null>(null);
  const [checkinDate, setCheckinDate] = useState('');
  const [checkoutDate, setCheckoutDate] = useState('');
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
    const fetchData = async () => {
      if (!roomId) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/bookings/room/${roomId}`,
          {
            headers: { Authorization: `Bearer ${session?.user?.access_token}` },
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
  }, [roomId, session?.user?.access_token]);

  const handleBooking = async () => {
    if (!checkinDate || !checkoutDate || !paymentMethod) {
      Swal.fire('Error', 'Please fill in all booking details.', 'error');
      return;
    }

    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);

    if (checkout <= checkin) {
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
          checkinDate,
          checkoutDate,
          paymentMethod,
          amount: summary?.room.base_price,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Booking failed: ${errorData.message || 'Unknown error'}`,
        );
      }

      const bookingData = await res.json();
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
    if (!checkinDate || !checkoutDate || !summary?.room.base_price) return 0;

    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const timeDiff = checkout.getTime() - checkin.getTime();
    const days = timeDiff / (1000 * 3600 * 24);

    return days > 0 ? summary.room.base_price * days : 0;
  };

  const totalPrice = calculateTotalPrice();

  if (!isClient) return null;

  return (
    <>
      <Navbar forceScrolled={true} />
      <div className="min-h-screen pt-28 pb-10 bg-[#F9FAFB] px-4 lg:px-24 text-black mb-[-50px]">
        <div className="max-w-6xl mx-auto mb-6">
          <h2 className="text-3xl font-bold text-gray-800 flex justify-center items-center">Booking Summary</h2>
        </div>
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-2xl p-8 border border-gray-100 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BookingSummary summary={summary} />
          <BookingSection
            checkinDate={checkinDate}
            setCheckinDate={setCheckinDate}
            checkoutDate={checkoutDate}
            setCheckoutDate={setCheckoutDate}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            handleBooking={handleBooking}
            totalPrice={totalPrice}
          />
        </div>
      </div>
      <Footer />
    </>
  );
  
}
