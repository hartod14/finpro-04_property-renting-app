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

    async getPropertyById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const data = await propertyService.getPropertyById(Number(id));
            responseHandler(res, 'get property detail success', data);
        } catch (error) {
            next(error);
        }
    }

    async getPropertyBySlug(req: Request, res: Response, next: NextFunction) {
        try {
            const { slug } = req.params;
            const data = await propertyService.getPropertyBySlug(slug);
            responseHandler(res, 'get property detail success', data);
        } catch (error) {
            next(error);
        }
    }

    async getRecommendedProperties(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await propertyService.getRecommendedProperties(req);
            responseHandler(res, `get properties by filter city ${data[0].city.name}`, data);
        } catch (error) {
            next(error);
        }
    }
}

export default new PropertyController();
