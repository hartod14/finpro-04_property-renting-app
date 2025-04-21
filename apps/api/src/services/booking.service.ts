import { PrismaClient, BookingStatus, PaymentMethod } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

export const createBooking = async (
  userId: number,
  roomId: number,
  checkinDate: Date,
  checkoutDate: Date,
  paymentMethod: PaymentMethod,
  amount: number
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
    orderNumber?: string
  ) => {
    return await prisma.booking.findMany({
      where: {
        user_id: userId,  
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
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true },
  })

  if (!booking) throw new Error('Booking not found')

  if (booking.status !== BookingStatus.WAITING_FOR_PAYMENT || booking.payment?.proof) {
    throw new Error('Booking cannot be cancelled')
  }

  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.CANCELLED },
  })
}
