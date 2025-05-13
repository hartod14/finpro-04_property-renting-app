import {
  responseHandler,
  responseHandlerPagination,
} from '../helpers/response.handler';
import tenantPropertyRoomService from '../services/tenant-property-room.service';
import { NextFunction, Request, Response } from 'express';

class TenantPropertyRoomController {
  async getRoomByPropertyId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await tenantPropertyRoomService.getRoomByPropertyId(
        Number(id),
        req,
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

  async getRoomById(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;
      const data = await tenantPropertyRoomService.getRoomById(Number(roomId));
      responseHandler(res, 'success get room by id', data);
    } catch (error) {
      next(error);
    }
  }

  async createRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await tenantPropertyRoomService.createRoom(Number(id), req);
      responseHandler(res, 'success create room', data);
    } catch (error) {
      next(error);
    }
  }

  async updateRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;
      const data = await tenantPropertyRoomService.updateRoom(
        Number(roomId),
        req,
      );
      responseHandler(res, 'success update room', data);
    } catch (error) {
      next(error);
    }
  }

  async deleteRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;
      const data = await tenantPropertyRoomService.deleteRoom(Number(roomId));
      responseHandler(res, 'success delete room', data);
    } catch (error) {
      next(error);
    }
  }
}

export default new TenantPropertyRoomController();
