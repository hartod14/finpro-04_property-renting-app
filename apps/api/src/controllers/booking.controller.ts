import { Request, Response } from 'express';
import { PrismaClient, PaymentMethod } from '@prisma/client';
import * as bookingService from '../services/booking.service';
import { BookingStatus } from '../models/booking.model'; 

const prisma = new PrismaClient();

export const createBooking = async (req: Request, res: Response) => {
  const { userId, roomId, checkinDate, checkoutDate, paymentMethod, amount } = req.body;

  try {
    const booking = await bookingService.createBooking(
      userId,
      roomId,
      new Date(checkinDate),
      new Date(checkoutDate),
      paymentMethod,
      amount
    );
    res.status(201).json(booking);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const listBookings = async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        user_id: Number(userId),
      },
      include: {
        user: true, // untuk info user
        room: {
          include: {
            property: {
              include: {
                propertyImages: true, // ambil gambar properti
              },
            },
          },
        },
        payment: true,
      },
    });

    const formattedBookings = bookings.map((booking) => ({
      user: {
        name: booking.user?.name,
        email: booking.user?.email,
        phone: booking.user?.phone,
      },
      property: {
        image: booking.room.property.propertyImages[0]?.path ?? null,
        name: booking.room.property.name,
        address: booking.room.property.address,
      },
      room: {
        name: booking.room.name,
        capacity: booking.room.capacity,
        price: booking.room.base_price,
      },
      booking: {
        id: booking.id,
        checkinDate: booking.checkin_date,
        checkoutDate: booking.checkout_date,
        status: booking.status,
        paymentMethod: booking.payment.method,
      },
    }));

    return res.status(200).json(formattedBookings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An unknown error occurred' });
  }
};

export const cancelBookingController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { bookingId } = req.params;
  console.log("Received cancel request for Booking ID:", bookingId); // Log ID yang diterima controller

  try {
    const id = Number(bookingId);

    if (isNaN(id)) {
      console.log("Invalid booking ID:", bookingId); // Log ketika ID tidak valid
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    // Memanggil service untuk membatalkan booking
    const result = await bookingService.cancelBooking(id);
    console.log("Booking cancellation result:", result); // Log hasil pembatalan
    return res.status(200).json(result);  // Mengembalikan hasil pembatalan
  } catch (error: any) {
    console.error("Error in cancelBookingController:", error); // Log error di controller

    // Pastikan backend mengirimkan detail error
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message }); // Error message dari service
    }

    return res.status(500).json({ message: 'Unknown error occurred' });
  }
};
