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
}

export default new CategoryController();
