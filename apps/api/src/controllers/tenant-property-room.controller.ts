import {
  responseHandler,
  responseHandlerPagination,
} from '@/helpers/response.handler';
import tenantPropertyRoomService from '@/services/tenant-property-room.service';
import { NextFunction, Request, Response } from 'express';

class TenantPropertyRoomController {
  async getRoomByPropertyId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await tenantPropertyRoomService.getRoomByPropertyId(
        Number(id),req
      );
      responseHandlerPagination(
        res,
        'success get room by property id',
        data.data,
        data.total,
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new TenantPropertyRoomController();
