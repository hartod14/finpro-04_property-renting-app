import { responseHandler } from '@/helpers/response.handler';
import cityService from '@/services/city.service';
import { NextFunction, Request, Response } from 'express';

class CityController {
  async getAllCity(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await cityService.getAllData();
      responseHandler(res, 'get all city success', data);
    } catch (error) {
      next(error);
    }
  }
}

export default new CityController();
