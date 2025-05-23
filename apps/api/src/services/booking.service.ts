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
    include: {
      roomHasPeakSeasonRates: {
        include: {
          peakSeasonRate: true,
        },
      },
    },
  });

  if (!room) throw new Error('Room not found');

  const peakSeasonRates = room.roomHasPeakSeasonRates || [];
  let totalPrice = 0;

  for (
    let d = new Date(checkinDate);
    d < checkoutDate;
    d.setDate(d.getDate() + 1)
  ) {
    let nightlyPrice = Number(room.base_price);

    for (const peakRateRelation of peakSeasonRates) {
      const peakRate = peakRateRelation.peakSeasonRate;
      const peakStartDate = new Date(peakRate.start_date);
      const peakEndDate = new Date(peakRate.end_date);

      if (d >= peakStartDate && d <= peakEndDate) {
        if (peakRate.value_type === 'PERCENTAGE') {
          const percentValue = Number(peakRate.value) / 100;
          if (peakRate.type === 'INCREASE') {
            nightlyPrice += nightlyPrice * percentValue;
          } else if (peakRate.type === 'DECREASE') {
            nightlyPrice -= nightlyPrice * percentValue;
          }
        } else if (peakRate.value_type === 'NOMINAL') {
          if (peakRate.type === 'INCREASE') {
            nightlyPrice += Number(peakRate.value);
          } else if (peakRate.type === 'DECREASE') {
            nightlyPrice -= Number(peakRate.value);
          }
        }

        nightlyPrice = Math.max(nightlyPrice, 0);
        break;
      }
    }

    totalPrice += nightlyPrice;
  }

  const payment = await prisma.payment.create({
    data: {
      method: paymentMethod,
      amount: totalPrice,
    },
  });

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
    include: {
      user: true,
      room: {
        include: {
          property: {
            include: {
              propertyImages: true,
            },
          },
        },
      },
      payment: true,
    },
  });

  return booking;
};

export const getBookingSummaryByRoomIdService = async (
  roomId: number,
  userId: number,
  startDate?: string,
  endDate?: string
) => {
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
      roomImages: {
        where: { deleted_at: null },
        orderBy: { created_at: 'asc' },
        take: 1,
      },
      roomHasPeakSeasonRates: {
        include: {
          peakSeasonRate: true,
        },
      },
    },
  });

  if (!room) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return null;

  let adjusted_price: number | undefined;

  // Hitung adjusted_price jika ada startDate dan endDate
  if (startDate && endDate) {
    const requestStartDate = new Date(startDate);
    const requestEndDate = new Date(endDate);

    const peakSeasonRates = room.roomHasPeakSeasonRates || [];
    let totalPrice = 0;

    // Loop per malam (tidak termasuk endDate)
    for (let d = new Date(requestStartDate); d < requestEndDate; d.setDate(d.getDate() + 1)) {
      let nightlyPrice = Number(room.base_price);

      for (const peakRateRelation of peakSeasonRates) {
        const peakRate = peakRateRelation.peakSeasonRate;
        const peakStartDate = new Date(peakRate.start_date);
        const peakEndDate = new Date(peakRate.end_date);

        if (d >= peakStartDate && d <= peakEndDate) {
          if (peakRate.value_type === 'PERCENTAGE') {
            const percentValue = Number(peakRate.value) / 100;
            if (peakRate.type === 'INCREASE') {
              nightlyPrice += nightlyPrice * percentValue;
            } else if (peakRate.type === 'DECREASE') {
              nightlyPrice -= nightlyPrice * percentValue;
            }
          } else if (peakRate.value_type === 'NOMINAL') {
            if (peakRate.type === 'INCREASE') {
              nightlyPrice += Number(peakRate.value);
            } else if (peakRate.type === 'DECREASE') {
              nightlyPrice -= Number(peakRate.value);
            }
          }

          nightlyPrice = Math.max(nightlyPrice, 0); 
          break; // hanya ambil satu peak rate yang cocok
        }
      }

      totalPrice += nightlyPrice;
    }

    adjusted_price = totalPrice;
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.profile_picture,
      phone: user.phone,
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
      adjusted_price, // tampilkan hasil akhir total dari semua malam
      capacity: room.capacity,
      size: room.size,
      image: room.roomImages[0]?.path || null,
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
              // peakSeasonRates: true, // Sertakan peakSeasonRates pada property
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
    const nights = Math.ceil(
      (checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 3600 * 24),
    );

    // const peakRate = room.property.peakSeasonRates.find((rate) => {
    //   return checkinDate >= rate.start_date && checkoutDate <= rate.end_date;
    // });

    const peakRate = 0

    const basePrice = room.base_price;
    const pricePerNight = peakRate
      // ? peakRate.value.toNumber()
      // : basePrice.toNumber();

    const totalPrice = pricePerNight * nights; // Total price calculation

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
        totalPrice, // Add totalPrice here
      },
      booking: {
        id: booking.id,
        order_number: booking.order_number,
        checkinDate: booking.checkin_date,
        checkoutDate: booking.checkout_date,
        status: booking.status,
        paymentMethod: booking.payment?.method ?? null,
        amount: booking.payment?.amount ?? totalPrice, // Use calculated totalPrice if payment amount is not available
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
