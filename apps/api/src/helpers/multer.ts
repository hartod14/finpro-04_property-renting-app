/** @format */
import multer, { FileFilterCallback } from 'multer';
import path, { join } from 'path';
import { type Request } from 'express';

const maxSize = 1048576;

const multerConfig: multer.Options = {
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {

    const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('file type is not image'));
    }

    if (file.size > maxSize) {
      return cb(new Error('max size 1mb'));
    }
    return cb(null, true);
  },
  limits: {
    fileSize: maxSize,
  },
};

export const uploader = () =>
  multer({
    ...multerConfig,
  });
