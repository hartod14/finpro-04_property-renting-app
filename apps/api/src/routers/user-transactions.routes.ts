import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller';
import * as paymentController from '../controllers/payment.controller';
import { verifyUser } from '../middalewares/auth.middleware';
import {
  uploadPaymentProofMiddleware,
  expireUnpaidBookingsMiddleware,
  checkBookingStatusForCancellation,
} from '../middalewares/booking.middleware';

export class UserTransactionRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/bookings', verifyUser, bookingController.createBooking);
    this.router.get('/bookings', verifyUser, bookingController.listBookings);

    this.router.get(
      '/bookings/room/:roomId',
      verifyUser, // Pastikan verifikasi user dilakukan di sini
      bookingController.getBookingSummaryByRoomId,
    );

    this.router.delete(
      '/bookings/:bookingId',
      verifyUser,
      checkBookingStatusForCancellation,
      bookingController.cancelBookingController,
    );

    this.router.post(
      '/payments/:bookingId',
      uploadPaymentProofMiddleware,
      paymentController.uploadPaymentProof,
    );

    this.router.post(
      '/payments/midtrans/:bookingId',
      verifyUser,
      paymentController.initiateMidtransPayment,
    );

    // this.router.post(
    //   '/payments/midtrans/callback',
    //   paymentController.midtransCallback,
    // );

    this.router.patch(
      '/payments/midtrans/:orderId',
      verifyUser,
      paymentController.updateMidtransStatus,
    );

    this.router.get(
      '/payments/expire-unpaid',
      expireUnpaidBookingsMiddleware,
      paymentController.expireUnpaidBookings,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
