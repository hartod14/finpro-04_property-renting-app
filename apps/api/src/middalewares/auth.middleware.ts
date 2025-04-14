/** @format */

import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { jwt_secret, refresh_jwt_secret } from "../config";
import { ErrorHandler } from "../helpers/response.handler";
import { IUserLogin } from "../interfaces/user.interface";
import yup from "yup";
import { getUserByEmail } from "../helpers/user.prisma";
import { Role } from "@prisma/client";


interface AuthenticatedRequest extends Request {
  user?: IUserLogin;
}


export const verifyUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    const token = String(authorization || "").split("Bearer ")[1];

    try {
      const verifiedUser = verify(token, jwt_secret) as IUserLogin;
      req.user = verifiedUser as IUserLogin;

      next();
    } catch (error) {
      throw new ErrorHandler("unauthorized", 401);
    }
  } catch (error) {
    next(error);
  }
};

export const verifyRefreshToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    const token = String(authorization || "").split("Bearer ")[1];
    const verfiedUser = verify(token, refresh_jwt_secret);
    req.user = verfiedUser as IUserLogin; // {}
    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeOrganizer = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req?.user?.role != Role.TENANT) {
    return next(new ErrorHandler("forbidden", 403));
  }
  next();
};

export const registerValidation =
  (schema: yup.ObjectSchema<any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await schema.validate(req.body);
        if (await getUserByEmail(req.body.email))
          throw new ErrorHandler("email already used");
        return next();
      } catch (err) {
        next(err);
      }
    };