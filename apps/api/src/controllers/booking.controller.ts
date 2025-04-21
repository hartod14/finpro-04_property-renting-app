import { Request, Response } from 'express';
import * as bookingService from '../services/booking.service';
import { BookingStatus } from '../models/booking.model'; // Assuming you have BookingStatus enum defined

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

export const listBookings = async (req: Request, res: Response) => {
  const { userId, status, orderNumber, date } = req.query;

  try {
    // Ensure userId is provided and is a number
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const bookings = await bookingService.listBookings(
      Number(userId),
      status ? (status as BookingStatus) : undefined,
      date ? new Date(date as string) : undefined,
      orderNumber as string,
    );
    res.status(200).json(bookings);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  try {
    const booking = await bookingService.cancelBooking(Number(bookingId));
    res.status(200).json(booking);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
