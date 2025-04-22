/** @format */

import { NextFunction, Request, Response } from "express";
import { ErrorHandler, responseHandler, responsHandlerPagination } from "../helpers/response.handler";
import uploadService from "@/services/upload.service";
class UploadImageController {

    async uploadImage(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await uploadService.uploadImage(req);
            responseHandler(res, "upload image success",data);
        } catch (error) {
            next(error);
        }
    }
}

export default new UploadImageController();
