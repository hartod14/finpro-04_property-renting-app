import { responseHandler } from '../helpers/response.handler';
import facilityService from '../services/facility.service';
import { NextFunction, Request, Response } from 'express';

class FacilityController {
  async getAllFacility(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await facilityService.getAllData(req);
      responseHandler(res, 'get all facility success', data);
    } catch (error) {
      next(error);
    }
  }
}

export default new FacilityController(); 