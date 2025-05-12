import { NextFunction, Request, Response } from 'express';
import {
  responseHandler,
  responseHandlerPagination,
} from '@/helpers/response.handler';
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

  async getDataById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantRoomAvailabilityService.getDataById(
        Number(req.params.id),
      );
      responseHandler(res, 'get room availability by id success', data);
    } catch (error) {
      next(error);
    }
  }

  async createData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantRoomAvailabilityService.createData(req);
      responseHandler(res, 'create room availability success', data);
    } catch (error) {
      next(error);
    }
  }

  async updateData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantRoomAvailabilityService.updateData(
        Number(req.params.id),
        req
      );
      responseHandler(res, 'update room availability success', data);
    } catch (error) {
      next(error);
    }
  }
  async deleteData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantRoomAvailabilityService.deleteData(
        Number(req.params.id),
      );
      responseHandler(res, 'delete room availability success', data);
    } catch (error) {
      next(error);
    }
  }
}

export default new TenantRoomAvailabilityController();
