import { PrismaClient, BookingStatus, PaymentMethod } from '@prisma/client';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const createBooking = async (
  userId: number,
  roomId: number,
  checkinDate: Date,
  checkoutDate: Date,
  paymentMethod: PaymentMethod,
) => {
  const formattedDate = format(new Date(), 'ddMMyyyy');
  const orderNumber = `ORD-${formattedDate}-${uuidv4()}`;

  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) throw new Error('Room not found');

  const diffTime = checkoutDate.getTime() - checkinDate.getTime();
  const numberOfNights = diffTime / (1000 * 3600 * 24);

  // Tentukan harga per malam (gunakan tarif musim puncak jika ada)
  const peakSeasonRate = await prisma.peakSeasonRate.findFirst({
    where: {
      property_id: room.property_id,
      start_date: { lte: checkinDate },
      end_date: { gte: checkoutDate },
    },
  });

  const basePrice = room.base_price.toNumber();
  const pricePerNight = peakSeasonRate ? peakSeasonRate.value.toNumber() : basePrice;

  // Hitung total harga berdasarkan jumlah malam
  const totalPrice = pricePerNight * numberOfNights;

  // Buat transaksi pembayaran dengan harga yang dihitung
  const payment = await prisma.payment.create({
    data: {
      method: paymentMethod,
      amount: totalPrice,
    },
  });

  // Simpan booking dengan id payment yang baru
  const booking = await prisma.booking.create({
    data: {
      user_id: userId,
      room_id: roomId,
      checkin_date: checkinDate,
      checkout_date: checkoutDate,
      status: BookingStatus.WAITING_FOR_PAYMENT,
      order_number: orderNumber,
      payment_id: payment.id, // Tautkan id payment ke booking
    },
    include: {
      user: true,
      room: {
        include: {
          property: true,
        },
      },
      payment: true,
    },
  });

  return booking;
};

export const getBookingSummaryByRoomIdService = async (roomId: number, userId: number) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      property: {
        include: {
          propertyImages: {
            where: { deleted_at: null },
            orderBy: { created_at: 'asc' },
            take: 1,
          },
        },
      },
      RoomImage: {
        where: { deleted_at: null },
        orderBy: { created_at: 'asc' },
        take: 1,
      },
    },
  });

  if (!room) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return null;

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.profile_picture,
      phone: user.phone
    },
    property: {
      name: room.property.name,
      address: room.property.address,
      image: room.property.propertyImages[0]?.path || null,
    },
    room: {
      id: room.id,
      name: room.name,
      base_price: room.base_price,
      capacity: room.capacity,
      size: room.size,
      image: room.RoomImage[0]?.path || null,
    },
  };
};

export const listBookings = async (userId: number) => {
  const bookings = await prisma.booking.findMany({
    where: {
      user_id: userId,
    },
    include: {
      user: true,
      room: {
        include: {
          property: {
            include: {
              propertyImages: true,
              peakSeasonRates: true, // Sertakan peakSeasonRates pada property
            },
          },
        },
      },
      payment: true, // Menyertakan data payment yang berisi amount
    },
  });

  const formattedBookings = bookings.map((booking) => {
    const room = booking.room;
    const checkinDate = booking.checkin_date;
    const checkoutDate = booking.checkout_date;
    const nights = Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 3600 * 24));
  
    const peakRate = room.property.peakSeasonRates.find((rate) => {
      return checkinDate >= rate.start_date && checkoutDate <= rate.end_date;
    });
  
    const basePrice = room.base_price;
    const pricePerNight = peakRate ? peakRate.value.toNumber() : basePrice.toNumber();
    
    const totalPrice = pricePerNight * nights;  // Total price calculation
  
    return {
      user: {
        name: booking.user?.name,
        email: booking.user?.email,
        phone: booking.user?.phone,
      },
      property: {
        image: room.property.propertyImages[0]?.path ?? null,
        name: room.property.name,
        address: room.property.address,
      },
      room: {
        name: room.name,
        capacity: room.capacity,
        pricePerNight,
        totalPrice,  // Add totalPrice here
      },
      booking: {
        id: booking.id,
        order_number: booking.order_number,
        checkinDate: booking.checkin_date,
        checkoutDate: booking.checkout_date,
        status: booking.status,
        paymentMethod: booking.payment?.method ?? null,
        amount: booking.payment?.amount ?? totalPrice,  // Use calculated totalPrice if payment amount is not available
      },
    };
  });  

  return formattedBookings;
};

export const cancelBooking = async (bookingId: number) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.status !== 'WAITING_FOR_PAYMENT' || booking.payment?.proof) {
    throw new Error('Booking cannot be cancelled');
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED' },
  });

  return updatedBooking;
};
