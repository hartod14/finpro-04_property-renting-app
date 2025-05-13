import { Router } from 'express';
import { tenantTransactionController } from '@/controllers/tenantTransaction.controller';
import { verifyUser } from '@/middalewares/auth.middleware';
import { authorizeTenantAction } from '@/middalewares/authorizeTenantAction';

export class TenantTransactionRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/tenant/:tenantId/orders',
      verifyUser,
      authorizeTenantAction,
      tenantTransactionController.getTenantOrders,
    );

    this.router.post(
      '/tenant/:tenantId/booking/:bookingId/confirm',
      verifyUser,
      authorizeTenantAction,
      tenantTransactionController.confirmPayment,
    );

    this.router.delete(
      '/tenant/:tenantId/bookings/:bookingId/cancel',
      verifyUser,
      authorizeTenantAction,
      tenantTransactionController.cancelUserOrder,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
