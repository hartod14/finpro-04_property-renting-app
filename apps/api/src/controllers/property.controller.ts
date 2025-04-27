import { responseHandler } from "@/helpers/response.handler";
import propertyService from "@/services/property.service";
import { NextFunction, Request, Response } from "express";

class PropertyController {
    async getAllProperty(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await propertyService.getAllData(req);
            responseHandler(res, 'get all property success', data);
        } catch (error) {
            next(error);
        }
    }
}

export default new PropertyController();
