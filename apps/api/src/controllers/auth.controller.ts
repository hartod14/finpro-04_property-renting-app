/** @format */

import { NextFunction, Request, Response } from 'express';
import { ErrorHandler, responseHandler } from '../helpers/response.handler';
import authService from '@/services/auth.service';

class AuthController {
  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log(req);
      
      const data = await authService.signIn(req);
      // console.log(data);
      
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

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.refreshToken(req);
      responseHandler(res, 'refresh token success', data);
    } catch (error) {
      next(error);
    }
  }

  //   async forgetPassword(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const user = await authService.forgetPassword(req);
  //       await authService.sendEmailForgetPassword(user.email, String(user.forget_password_token));
  //       responseHandler(res, "reset password has been sent to email")
  //     } catch (error) {
  //       next(error)
  //     }
  //   }

  //   async resetPasswordCheck(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const data = await authService.resetPasswordCheck(req);
  //       responseHandler(res, "credential valid", data)
  //     } catch (error) {
  //       next(error)
  //     }
  //   }

  //   async resetPassword(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const data = await authService.resetPassword(req);
  //       responseHandler(res, "success reset password", data)
  //     } catch (error) {
  //       next(error)
  //     }
  //   }
}

export default new AuthController();
