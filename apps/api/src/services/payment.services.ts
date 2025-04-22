import { PrismaClient, BookingStatus } from '@prisma/client'
import { validateImage } from '../utils/validation'
import cron from 'node-cron';

const prisma = new PrismaClient();

export const uploadPaymentProof = async (
  bookingId: number,
  file: Express.Multer.File,
) => {
  validateImage(file);

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true },
  });

  if (!booking || !booking.payment) throw new Error('Invalid booking/payment');

  await prisma.payment.update({
    where: { id: booking.payment.id },
    data: {
      proof: file.buffer, // Simpan file sebagai buffer (Bytes di database)
      payment_date: new Date(),
    },
  });

  return await prisma.booking.update({
    where: { id: booking.id },
    data: { status: BookingStatus.WAITING_FOR_CONFIRMATION },
  });
};

export const expireUnpaidBookings = async () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

  const expired = await prisma.booking.updateMany({
    where: {
      status: BookingStatus.WAITING_FOR_PAYMENT,
      payment: {
        proof: null,
        created_at: { lte: oneHourAgo },
      },
    },
    data: { status: BookingStatus.EXPIRED },
  })

  return expired
}

cron.schedule('*0 * * * * *', async () => {
  console.log('Running scheduled job: expireUnpaidBookings');

  try {
    const result = await expireUnpaidBookings();
    if (result.count > 0) {
      console.log(`${result.count} unpaid booking(s) have been marked as EXPIRED.`);
    }
  } catch (error) {
    console.error('Error in scheduled expireUnpaidBookings:', error);
  }
});

export const createMidtransPayment = async (bookingId: number) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      payment: true,
      user: true,
      room: {
        include: { property: true },
      },
    },
  });

  if (!booking) throw new Error('Booking not found.');
  if (!booking.payment) throw new Error('No payment data associated.');

  await prisma.payment.update({
    where: { id: booking.payment.id },
    data: { method: 'MIDTRANS' },
  });

  const simulatedRedirectUrl = `https://simulator.sandbox.midtrans.com/payment/${booking.order_number}`;

  return {
    message: 'Midtrans payment created.',
    redirect_url: simulatedRedirectUrl,
    bookingId: booking.id,
    orderNumber: booking.order_number,
  };
};
