
import { PrismaClient, BookingStatus } from '@prisma/client';
import { validateImage } from '../utils/validation';
import cron from 'node-cron';
import { cloudinaryUpload } from '@/helpers/cloudinary';
import { sendConfirmationEmail } from '@/utils/email';
const midtransClient = require('midtrans-client');

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

  if (!booking || !booking.payment) {
    throw new Error('Invalid booking/payment');
  }

  const { secure_url } = await cloudinaryUpload(file);

  await prisma.payment.update({
    where: { id: booking.payment.id },
    data: {
      proof: secure_url, 
      payment_date: new Date(),
    },
  });

  return await prisma.booking.update({
    where: { id: booking.id },
    data: { status: BookingStatus.WAITING_FOR_CONFIRMATION },
  });
};

export const expireUnpaidBookings = async () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const expired = await prisma.booking.updateMany({
    where: {
      status: BookingStatus.WAITING_FOR_PAYMENT,
      payment: {
        proof: null,
        created_at: { lte: oneHourAgo },
      },
    },
    data: { status: BookingStatus.EXPIRED },
  });

  return expired;
};

cron.schedule('0 * * * *', async () => {
  console.log('Running scheduled job: expireUnpaidBookings');

  try {
    const result = await expireUnpaidBookings();
    if (result.count > 0) {
      console.log(
        `${result.count} unpaid booking(s) have been marked as EXPIRED.`,
      );
    }
  } catch (error) {
    console.error('Error in scheduled expireUnpaidBookings:', error);
  }
});

export const createMidtransPayment = async (bookingId: number) => {
  try {
    // Start database transaction
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        payment: true,
        user: true,
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (!booking.payment) {
      throw new Error('No payment data associated with the booking');
    }

    // Update booking payment method to MIDTRANS
    await prisma.payment.update({
      where: { id: booking.payment.id },
      data: { method: 'MIDTRANS' },
    });

    // Prepare parameters for Midtrans API
    const parameter = {
      transaction_details: {
        order_id: booking.order_number, // Pastikan order_number unik dan valid
        gross_amount: parseFloat(booking.payment.amount.toString()), // Pastikan amount sesuai dengan nilai yang benar
      },
      customer_details: {
        first_name: booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone,
      },
    };

    // Initialize Midtrans client and create the transaction
    const snap = new midtransClient.Snap({
      isProduction: false, // Jika menggunakan sandbox, set false
      serverKey: process.env.MIDTRANS_SERVER_KEY, // Gantilah dengan server key yang sesuai
    });

    const { token, redirect_url } = await snap.createTransaction(parameter);

    if (!token || !redirect_url) {
      throw new Error('Failed to generate Snap token or redirect URL');
    }

    // Return the response
    return {
      message: 'Midtrans payment created successfully.',
      snapToken: token,
      redirectUrl: redirect_url,
      bookingId: booking.id,
      orderNumber: booking.order_number,
    };
  } catch (error: unknown) {
    // Memastikan error adalah instance dari Error
    if (error instanceof Error) {
      console.error('Error creating Midtrans payment:', error.message);
      throw new Error(`Failed to create Midtrans payment: ${error.message}`);
    } else {
      console.error('An unknown error occurred:', error);
      throw new Error('An unknown error occurred during payment creation');
    }
  }
};

export const updatePaymentStatus = async (midtransPayload: any) => {
  const { order_id, transaction_status, payment_type, settlement_time } = midtransPayload;

  const booking = await prisma.booking.findFirst({
    where: { order_number: order_id },
    include: {
      payment: true,
      user: true,
      room: {
        include: {
          property: true,
        },
      },
    },
  });

  if (!booking || !booking.payment) throw new Error('Booking not found');

  let newStatus: BookingStatus;

  switch (transaction_status) {
    case 'settlement':
      newStatus = BookingStatus.DONE;
      break;
    case 'expire':
    case 'cancel':
      newStatus = BookingStatus.CANCELLED;
      break;
    default:
      newStatus = booking.status;
  }

  await prisma.payment.update({
    where: { id: booking.payment.id },
    data: {
      payment_date: settlement_time ? new Date(settlement_time) : undefined,
      method: payment_type.toUpperCase(),
    },
  });

  const updatedBooking = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: newStatus,
    },
    include: {
      user: true,
      room: {
        include: {
          property: true,
        },
      },
    },
  });

  // ✅ Kirim email konfirmasi jika sukses bayar
  if (transaction_status === 'DONE') {
    await sendConfirmationEmail(updatedBooking.user.email, updatedBooking);
  }

  return { message: 'Payment status updated successfully.' };
};


export const updatePaymentStatusByOrderId = async (orderId: string) => {
  const booking = await prisma.booking.findFirst({
  where: { order_number: orderId },
  include: { payment: true },
});

  if (!booking || !booking.payment) {
    throw new Error('Invalid order number');
  }

  await prisma.payment.update({
    where: { id: booking.payment.id },
    data: {
      payment_date: new Date(),
    },
  });

  const updatedBooking = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: BookingStatus.DONE,
    },
  });

  return {
    message: 'Payment status updated successfully',
    bookingId: updatedBooking.id,
    status: updatedBooking.status,
  };
};

