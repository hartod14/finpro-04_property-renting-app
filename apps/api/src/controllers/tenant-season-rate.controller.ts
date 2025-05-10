import { NextFunction, Request, Response } from 'express';
import {
  responseHandler,
  responseHandlerPagination,
} from '@/helpers/response.handler';
import tenantSeasonRateService from '@/services/tenant-season-rate.service';

class TenantSeasonRateController {
  async getAllData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantSeasonRateService.getAllData(req);
      responseHandlerPagination(
        res,
        'get all season rates success',
        data.data,
        data.total,
      );
    } catch (error) {
      next(error);
    }
  }

  async getDataById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantSeasonRateService.getDataById(
        Number(req.params.id),
      );
      responseHandler(res, 'get season rate by id success', data);
    } catch (error) {
      next(error);
    }
  }

  async createData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantSeasonRateService.createData(req);
      responseHandler(res, 'create season rate success', data);
    } catch (error) {
      next(error);
    }
  }

  async updateData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantSeasonRateService.updateData(
        Number(req.params.id),
        req
      );
      responseHandler(res, 'update season rate success', data);
    } catch (error) {
      next(error);
    }
  }

  async deleteData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantSeasonRateService.deleteData(
        Number(req.params.id),
      );
      responseHandler(res, 'delete season rate success', data);
    } catch (error) {
      next(error);
    }
  }
}

export default new TenantSeasonRateController(); 