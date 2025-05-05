import { responseHandlerPagination } from "@/helpers/response.handler";
import tenantPropertyService from "@/services/tenant-property.service";
import { NextFunction, Request, Response } from "express";

class TenantPropertyController {
    async getAllData(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await tenantPropertyService.getAllData(req);
            responseHandlerPagination(res, 'get all property success', data.data, data.total);
        } catch (error) {
            next(error);
        }
    }
}

export default new TenantPropertyController();
