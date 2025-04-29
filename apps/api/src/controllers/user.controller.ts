import { responseHandler } from "@/helpers/response.handler";
import userService from "@/services/user.service";
import { NextFunction, Request, Response } from "express";

class UserController {
    async getAllTenant(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await userService.getAllTenant(req)
            responseHandler(res, 'get all tenant success', data)
        } catch (error) {
            next(error)
        }
    }
}

export default new UserController();
