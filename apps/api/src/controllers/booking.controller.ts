import { Request, Response } from 'express';
import { PrismaClient, PaymentMethod } from '@prisma/client';
import * as bookingService from '../services/booking.service';
import { BookingStatus } from '../models/booking.model';

const prisma = new PrismaClient();

export const createBooking = async (req: Request, res: Response) => {
  const { userId, roomId, checkinDate, checkoutDate, paymentMethod } = req.body;

  try {
    const booking = await bookingService.createBooking(
      userId,
      roomId,
      new Date(checkinDate),
      new Date(checkoutDate),
      paymentMethod,
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

export const getBookingSummaryByRoomId = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { roomId } = req.params; // Ambil roomId dari URL params
  const { startDate, endDate } = req.query; // Ambil startDate dan endDate dari query params
  const userId = (req as any).user?.id; // Ambil userId dari request user

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const bookingSummary = await bookingService.getBookingSummaryByRoomIdService(
      Number(roomId),
      userId,
      startDate as string, // Kirim startDate dan endDate ke service
      endDate as string
    );

    if (!bookingSummary) {
      return res.status(404).json({ message: 'Room or user not found' });
    }

    return res.status(200).json(bookingSummary); // Kirimkan booking summary ke FE
  } catch (error) {
    console.error('Error fetching booking summary:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const listBookings = async (req: Request, res: Response): Promise<any> => {
  const { userId, search = '', page = 1, limit = 10 } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  try {
    const whereClause: any = {
      user_id: Number(userId),
    };

    if (search) {
      whereClause.OR = [
        { order_number: { contains: search as string, mode: 'insensitive' } },
        { room: { name: { contains: search as string, mode: 'insensitive' } } },
        {
          room: {
            property: {
              name: { contains: search as string, mode: 'insensitive' },
            },
          },
        },
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: whereClause,
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
        skip,
        take: limitNumber,
        orderBy: { created_at: 'desc' },
      }),
      prisma.booking.count({ where: whereClause }),
    ]);

    const formattedBookings = bookings.map((booking) => {
      const room = booking.room;
      const checkinDate = booking.checkin_date;
      const checkoutDate = booking.checkout_date;

      const nights = Math.ceil(
        (checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 3600 * 24),
      );

      const pricePerNight = Number(room.base_price);
      const totalPrice = booking.payment?.amount ?? pricePerNight * nights;

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
          price: pricePerNight, // Per night price
        },
        booking: {
          id: booking.id,
          order_number: booking.order_number,
          checkinDate: checkinDate,
          checkoutDate: checkoutDate,
          nights,
          status: booking.status,
          paymentMethod: booking.payment?.method ?? null,
          amount: totalPrice,
        },
      };
    });

    return res.status(200).json({
      bookings: formattedBookings,
      total,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const cancelBookingController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { bookingId } = req.params;
  console.log('Received cancel request for Booking ID:', bookingId); // Log ID yang diterima controller

  try {
    const id = Number(bookingId);

    if (isNaN(id)) {
      console.log('Invalid booking ID:', bookingId); // Log ketika ID tidak valid
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    // Memanggil service untuk membatalkan booking
    const result = await bookingService.cancelBooking(id);
    console.log('Booking cancellation result:', result); // Log hasil pembatalan
    return res.status(200).json(result); // Mengembalikan hasil pembatalan
  } catch (error: any) {
    console.error('Error in cancelBookingController:', error); // Log error di controller

    // Pastikan backend mengirimkan detail error
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message }); // Error message dari service
    }

    return res.status(500).json({ message: 'Unknown error occurred' });
  }
};
