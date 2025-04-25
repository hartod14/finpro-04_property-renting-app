import { Request, Response, NextFunction } from 'express';
import { PrismaClient, BookingStatus } from '@prisma/client';
import multer from 'multer';
import { validateImage } from '../utils/validation';
import * as paymentService from '../services/payment.services';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const prisma = new PrismaClient();

export const uploadPaymentProofMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  upload.single('file')(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'Error uploading file.' });
    } else if (err) {
      return res.status(500).json({ message: 'File processing error.' });
    }

    if (req.file) {
      try {
        validateImage(req.file); // Pastikan validasi berjalan dengan baik
        next();
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    } else {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
  });
};

export const expireUnpaidBookingsMiddleware = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const expiredBookings = await paymentService.expireUnpaidBookings();

    if (expiredBookings.count > 0) {
      console.log(`${expiredBookings.count} booking(s) have been expired.`);
    }

    next();
  } catch (error: any) {
    console.error('Error expiring unpaid bookings:', error);
    res.status(500).json({ message: 'Failed to expire unpaid bookings.' });
  }
};

export const checkBookingStatusForCancellation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const bookingId = Number(req.params.bookingId);

  try {
    console.log(`Checking cancellation for booking ID: ${bookingId}`);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      console.log(`Booking with ID ${bookingId} not found`);
      res.status(404).json({ message: 'Booking not found' });
      return; // Don't call next() if you respond with a status code
    }

    if (booking.status !== 'WAITING_FOR_PAYMENT') {
      console.log(
        `Booking with ID ${bookingId} cannot be cancelled due to status: ${booking.status}`,
      );
      res
        .status(400)
        .json({ message: 'Booking cannot be cancelled due to status' });
      return; // Don't call next() if you respond with a status code
    }

    // Call next() to proceed to the next middleware/controller if the booking is valid
    next();
  } catch (error) {
    console.error(
      `Error in checkBookingStatusForCancellation middleware for booking ID ${bookingId}:`,
      error,
    );
    res.status(500).json({ message: 'Middleware failure' });
  }
};
