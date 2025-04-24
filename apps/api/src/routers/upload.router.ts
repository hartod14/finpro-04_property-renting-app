/** @format */

import uploadController from '@/controllers/upload.controller';
import { uploader } from '@/helpers/multer';
import { Router } from 'express';

export const uploadRouter = () => {
  const router = Router();

  router.post('/', uploader().single('image'), uploadController.uploadImage);

  return router;
};
