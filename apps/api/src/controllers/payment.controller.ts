import { Request, Response } from 'express';
import * as paymentService from '../services/payment.services';

export const uploadPaymentProof = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const bookingId = Number(req.params.bookingId);
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return; // Pastikan keluar setelah mengirimkan respons
  }

  try {
    await paymentService.uploadPaymentProof(bookingId, req.file);
    res.status(200).json({ message: 'Proof uploaded successfully' });
  } catch (error: any) {
    console.error(error); // Tambahkan log error
    res
      .status(500)
      .json({ error: 'Failed to upload proof', details: error.message });
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

export const initiateMidtransPayment = async (req: Request, res: Response) => {
  try {
    const bookingId = parseInt(req.params.bookingId, 10);
    const result = await paymentService.createMidtransPayment(bookingId);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Midtrans Payment Error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to initiate payment' });
  }
};

export const midtransCallback = async (req: Request, res: Response) => {
  try {
    const result = await paymentService.updatePaymentStatus(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Midtrans Callback Error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to update payment status' });
  }
};


export const updateMidtransStatus = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;
    const result = await paymentService.updatePaymentStatusByOrderId(orderId);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Update Payment Error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to update payment status' });
  }
};
