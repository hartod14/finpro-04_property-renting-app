import {
  responseHandler,
  responseHandlerPagination,
} from '@/helpers/response.handler';
import tenantPropertyService from '@/services/tenant-property.service';
import { NextFunction, Request, Response } from 'express';

class TenantPropertyController {
  async getAllData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantPropertyService.getAllData(req);
      responseHandlerPagination(
        res,
        'get all property success',
        data.data,
        data.total,
      );
    } catch (error) {
      next(error);
    }
  }

  async getPropertyById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await tenantPropertyService.getPropertyById(Number(id));
      responseHandler(res, 'get property by id success', data);
    } catch (error) {
      next(error);
    }
  }
  async createData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantPropertyService.createData(req);
      responseHandler(res, 'create property success', data);
    } catch (error) {
      next(error);
    }
  }

  async updateData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantPropertyService.updateData(req);
      responseHandler(res, 'update property success', data);
    } catch (error) {
      next(error);
    }
  }

  async deleteData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantPropertyService.deleteData(Number(req.params.id));
      responseHandler(res, 'delete property success', data);
    } catch (error) {
      next(error);
    }
  }
}

export default new TenantPropertyController();
