import { NextFunction, Request, Response } from 'express';
import {
  responseHandler,
  responseHandlerPagination,
} from '../helpers/response.handler';
import tenantCategoryService from '../services/tenant-category.service';
import tenantPropertyService from '../services/tenant-property.service';

class TenantCategoryController {
  async getAllData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantCategoryService.getAllData(req);
      responseHandlerPagination(
        res,
        'get all category success',
        data.data,
        data.total,
      );
    } catch (error) {
      next(error);
    }
  }
  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantCategoryService.getDataById(req.params.id);
      responseHandler(res, 'get category by id success', data);
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantCategoryService.createData(req);
      responseHandler(res, 'create category success', data);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantCategoryService.updateData(
        req.params.id,
        req.body,
      );
      responseHandler(res, 'update category success', data);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tenantCategoryService.deleteData(req.params.id);
      responseHandler(res, 'delete category success', data);
    } catch (error) {
      next(error);
    }
  }
}

export default new TenantCategoryController();
