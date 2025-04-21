import { Request, Response } from 'express';
import * as paymentService from '../services/payment.services';

export const uploadPaymentProof = async (req: Request, res: Response) => {
  const bookingId = Number(req.params.bookingId);
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    await paymentService.uploadPaymentProof(bookingId, req.file);
    return res.status(200).json({ message: 'Proof uploaded successfully' });
  } catch (error: any) {
    console.error(error); // Tambahkan ini
    return res.status(500).json({ error: 'Failed to upload proof', details: error.message });
  }
};

export const expireUnpaidBookings = async (_req: Request, res: Response) => {
  try {
    const result = await paymentService.expireUnpaidBookings();
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
};

export const createMidtransPayment = async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  try {
    const result = await paymentService.createMidtransPayment(Number(bookingId));
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to create Midtrans payment.' });
  }
};
