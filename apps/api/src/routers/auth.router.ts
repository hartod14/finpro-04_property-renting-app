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

  router.post('/token', verifyRefreshToken, authController.refreshToken);

  router.get('/check-verification', authController.checkVerificationToken);
  router.patch(
    '/verification-set-password',
    authController.verificationSetPassword,
  );
  router.post('/resend-verification', authController.resendVerificationEmail);

  // router.patch('/:id', verifyUser, authController.updateUser);

  router.post('/forget-password', authController.forgetPassword);
  router.patch('/update-password', authController.updatePassword);
  // router.get("/reset-password", authController.resetPasswordCheck)
  // router.post("/reset-password/:id", authController.resetPassword)

  // router.patch('/update', verifyUser, authController.updateUser);
  // router.patch('/password/change', verifyUser, authController.changePassword)

  return router;
};
