import { Request, Response } from 'express';
import { tenantTransactionService } from '../services/tenantTransaction.service';

export const tenantTransactionController = {
  async getTenantOrders(req: Request, res: Response) {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const status = req.query.status as any;

      const orders = await tenantTransactionService.getTenantOrders(
        tenantId,
        status,
      );

      res.json({
        bookings: orders,
        total: orders.length,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async confirmPayment(req: Request, res: Response) {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const bookingId = parseInt(req.params.bookingId);
      const { accept } = req.body;

      const result = await tenantTransactionService.confirmPayment(
        tenantId,
        bookingId,
        accept,
      );
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async sendCheckinReminder(req: Request, res: Response) {
    try {
      await tenantTransactionService.sendCheckinReminder();
      res.json({ message: 'Check-in reminders sent successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async cancelUserOrder(req: Request, res: Response) {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const bookingId = parseInt(req.params.bookingId);

      const result = await tenantTransactionService.cancelUserOrder(
        tenantId,
        bookingId,
      );
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async getPropertyList(req: Request, res: Response) {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const properties =
        await tenantTransactionService.getPropertyList(tenantId);
      res.json(properties);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
