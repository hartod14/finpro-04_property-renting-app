/** @format */

import { NextFunction, Request, Response } from 'express';
import { ErrorHandler, responseHandler } from '../helpers/response.handler';
import authService from '@/services/auth.service';
import { decodeVerificationJwt } from '@/helpers/verification.jwt';

class AuthController {
  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.signIn(req);

      responseHandler(res, 'login success', data);
    } catch (error) {
      next(error);
    }
  }
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.signUp(req);
      responseHandler(res, 'register success');
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.updateUser(req);
      responseHandler(res, 'update success', data);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.changePassword(req);
      responseHandler(res, 'change password success', data);
    } catch (error) {
      next(error);
    }
  }

  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.googleAuth(req);
      responseHandler(res, 'google auth success', data);
    } catch (error) {
      next(error);
    }
  }

  async facebookAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.facebookAuth(req);
      responseHandler(res, 'facebook auth success', data);
    } catch (error) {
      next(error);
    }
  }
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.refreshToken(req);
      responseHandler(res, 'refresh token success', data);
    } catch (error) {
      next(error);
    }
  }

  async checkVerificationToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await authService.checkVerificationToken(req);
      responseHandler(res, 'check verification token success', data);
    } catch (error) {
      next(error);
    }
  }

  async verificationSetPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await authService.verificationSetPassword(req);
      responseHandler(res, 'update password success');
    } catch (error) {
      next(error);
    }
  }

  async resendVerificationEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {

      await authService.resendVerificationEmail(req.body.email);
      responseHandler(res, 'resend verification email success');
    } catch (error) {
      next(error);
    }
  }

  async sendOnlyVerificationEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await authService.sendOnlyVerificationEmail(req.body.email);
      responseHandler(res, 'send only verification email success');
    } catch (error) {
      next(error);
    }
  }

  async forgetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.forgetPassword(req.body.email);
      responseHandler(res, 'forget password success');
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.query.token as string;
      const decoded = decodeVerificationJwt(token) as {
        email: string;
      };
      await authService.updatePassword(decoded.email, req.body.password);
      responseHandler(res, 'update password success');
    } catch (error) {
      next(error);
    }
  }

  async updateStatusVerification(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await authService.updateStatusVerification(req.query.token as string);
      responseHandler(res, 'update status verification success');
    } catch (error) {
      next(error);
    }
  }

  async checkPasswordSet(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.checkPasswordSet(
        req.query.email as string,
      );
      responseHandler(res, 'check password set success', data);
    } catch (error) {
      next(error);
    }
  }

  async sendChangeEmail(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.sendChangeEmail(req.body.email);
      responseHandler(res, 'send change email success');
    } catch (error) {
      next(error);
    }
  }

  async updateChangeEmail(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.updateChangeEmail(req.query.token as string, req);
      responseHandler(res, 'update change email success');
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
