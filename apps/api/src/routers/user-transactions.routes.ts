import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller';
import * as paymentController from '../controllers/payment.controller';
import {
  uploadPaymentProofMiddleware,
  expireUnpaidBookingsMiddleware,
  checkBookingStatusForCancellation,
} from '../middleware/booking.middleware';

export class UserTransactionRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/bookings', bookingController.createBooking);
    this.router.get('/bookings', bookingController.listBookings);

    this.router.delete(
      '/bookings/:bookingId',
      checkBookingStatusForCancellation,
      bookingController.cancelBooking,
    );

    this.router.post(
      '/payments/:bookingId',
      uploadPaymentProofMiddleware, 
      paymentController.uploadPaymentProof,
    );

    this.router.get(
      '/payments/expire-unpaid',
      expireUnpaidBookingsMiddleware,
      paymentController.expireUnpaidBookings,
    );

    this.router.post(
      '/midtrans/:bookingId',
      paymentController.createMidtransPayment,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
