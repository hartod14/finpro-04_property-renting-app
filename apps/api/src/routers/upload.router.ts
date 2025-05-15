/** @format */

import uploadController from '../controllers/upload.controller';
import { uploadSingleFile } from '../helpers/multer';
import { Router } from 'express';

export const uploadRouter = () => {
  const router = Router();

  router.post('/', 
    uploadSingleFile('image'),
    uploadController.uploadImage
  );

  return router;
};
