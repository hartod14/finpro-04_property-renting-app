import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/response.handler';
import { prisma } from '../config';
import { decodeVerificationJwt } from '../helpers/verification.jwt';
import { IUserLogin } from '../interfaces/user.interface';

interface AuthenticatedRequest extends Request {
  user?: IUserLogin;
}

export const authorizePropertyOwner = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const propertyId = parseInt(req.params.id);    
    if (isNaN(propertyId)) {
      return next(new ErrorHandler('Invalid property ID', 400));
    }
    
    // Get user from token
    const { authorization } = req.headers;
    if (!authorization) {
      return next(new ErrorHandler('Unauthorized: No token provided', 401));
    }
    
    const token = authorization.split('Bearer ')[1];
    if (!token) {
      return next(new ErrorHandler('Unauthorized: Invalid token format', 401));
    }
    
    const user = decodeVerificationJwt(token) as { id: number };
    
    // Check if property exists and belongs to the user
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { tenant_id: true },
    });
    
    if (!property) {
      return next(new ErrorHandler('Property not found', 404));
    }
    
    if (property.tenant_id !== user.id) {
      return next(new ErrorHandler('Unauthorized: You do not own this property', 403));
    }
    
    next();
  } catch (error) {
    next(error);
  }
}; 