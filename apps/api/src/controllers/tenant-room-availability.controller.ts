import { NextFunction, Request, Response } from 'express';
import { responseHandlerPagination } from '@/helpers/response.handler';
import tenantRoomAvailabilityService from '@/services/tenant-room-availability.service';

class TenantRoomAvailabilityController {
  async getAllData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantRoomAvailabilityService.getAllData(req);
      responseHandlerPagination(
        res,
        'get all room availability success',
        data.data,
        data.total,
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new TenantRoomAvailabilityController();
