import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/response.handler';
import { Role } from '@prisma/client';
import { IUserLogin } from '../interfaces/user.interface';

interface AuthenticatedRequest extends Request {
  user?: IUserLogin;
}

export const authorizeTenantAction = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const tenantId = parseInt(req.params.tenantId);

  if (!req.user) {
    return next(new ErrorHandler('unauthorized', 401));
  }

  if (req.user.role !== Role.TENANT) {
    return next(new ErrorHandler('forbidden: only tenants allowed', 403));
  }

  if (req.user.id !== tenantId) {
    return next(new ErrorHandler('unauthorized tenant access', 401));
  }

  next();
};