import { Router } from 'express';
import {
  registerValidation,
  verifyRefreshToken,
  verifyUser,
} from '../middalewares/auth.middleware';
import { registerSchema } from '../models/user.model';
import authController from '../controllers/auth.controller';

export const authRouter = () => {
  const router = Router();

  router.post(
    '/new',
    registerValidation(registerSchema),
    authController.signUp,
  );
  router.post('/', authController.signIn);
  router.post('/google', authController.googleAuth);
  router.post('/facebook', authController.facebookAuth);

  router.post('/token', verifyRefreshToken, authController.refreshToken);

  router.get('/check-verification', authController.checkVerificationToken);
  router.patch(
    '/verification-set-password',
    authController.verificationSetPassword,
  );
  router.post('/resend-verification', authController.resendVerificationEmail);
  router.post('/verification-only', authController.sendOnlyVerificationEmail);
  router.patch(
    '/update-status-verification',
    authController.updateStatusVerification,
  );

  router.post('/forget-password', authController.forgetPassword);
  router.patch('/update-password', authController.updatePassword);

  router.patch('/update', verifyUser, authController.updateUser);
  router.patch('/password/change', verifyUser, authController.changePassword);

  router.get(
    '/check-password-set',
    verifyUser,
    authController.checkPasswordSet,
  );

  return router;
};
