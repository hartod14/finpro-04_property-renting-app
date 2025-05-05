import {
  responseHandler,
  responseHandlerPagination,
} from '@/helpers/response.handler';
import categoryService from '@/services/category.service';
import { NextFunction, Request, Response } from 'express';

class CategoryController {
  async getAllCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await categoryService.getAllData();
      responseHandler(res, 'get all category success', data);
    } catch (error) {
      next(error);
    }
  }

  async getAllDataByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await categoryService.getAllDataByUserId(req);
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
      const data = await categoryService.getDataById(req.params.id);
      responseHandler(res, 'get category by id success', data);
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await categoryService.createData(req);
      responseHandler(res, 'create category success', data);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await categoryService.updateData(req.params.id, req.body);
      responseHandler(res, 'update category success', data);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await categoryService.deleteData(req.params.id);
      responseHandler(res, 'delete category success', data);
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
