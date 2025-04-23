import { PrismaClient, BookingStatus, PaymentMethod } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const createBooking = async (
  userId: number,
  roomId: number,
  checkinDate: Date,
  checkoutDate: Date,
  paymentMethod: PaymentMethod,
  amount: number,
) => {
  const orderNumber = `ORD-${uuidv4()}`;

  // Create payment record
  const payment = await prisma.payment.create({
    data: {
      method: paymentMethod,
      amount,
    },
  });

  // Create booking record
  const booking = await prisma.booking.create({
    data: {
      user_id: userId,
      room_id: roomId,
      checkin_date: checkinDate,
      checkout_date: checkoutDate,
      status: BookingStatus.WAITING_FOR_PAYMENT,
      order_number: orderNumber,
      payment_id: payment.id,
    },
  });

  return booking;
};

export const listBookings = async (
  userId: number,
  status?: BookingStatus,
  date?: Date,
  orderNumber?: string,
) => {
  return await prisma.booking.findMany({
    where: {
      user_id: userId, // Hanya menampilkan booking milik user yang sedang login
      ...(status && { status }),
      ...(date && {
        checkin_date: {
          lte: date,
        },
        checkout_date: {
          gte: date,
        },
      }),
      ...(orderNumber && { order_number: orderNumber }),
    },
    include: {
      room: true,
      payment: true,
    },
  });
};

export const cancelBooking = async (bookingId: number) => {
  console.log("Cancel booking service - Booking ID:", bookingId); // Log ID booking yang diterima

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true },
  });

  if (!booking) {
    console.log("Booking not found for ID:", bookingId);  // Log jika booking tidak ditemukan
    throw new Error('Booking not found');
  }

  // Cek apakah status booking valid untuk dibatalkan
  if (booking.status !== 'WAITING_FOR_PAYMENT' || booking.payment?.proof) {
    console.log("Booking cannot be cancelled - Status:", booking.status, "Payment proof:", booking.payment?.proof);
    throw new Error('Booking cannot be cancelled');
  }

  // Jika valid, lanjutkan untuk mengupdate status booking
  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED' },
  });

  console.log("Booking cancelled successfully:", updatedBooking);  // Log setelah pembatalan berhasil
  return updatedBooking;
};
