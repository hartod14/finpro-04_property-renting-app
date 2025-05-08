/** @format */
import multer, { FileFilterCallback } from 'multer';
import path, { join } from 'path';
import { type Request, Response, NextFunction } from 'express';
import { ErrorHandler } from './response.handler';

// Extend Express Request type to include fileValidationError
declare global {
  namespace Express {
    interface Request {
      fileValidationError?: string;
    }
  }
}

const maxSize = 1048576; // 1MB

const multerConfig: multer.Options = {
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      req.fileValidationError = 'Only .png, .jpg and .jpeg formats are allowed';
      return cb(null, false);
    }

    return cb(null, true);
  },
  limits: {
    fileSize: maxSize,
  },
};

// Create a single file upload middleware with error handling
export const uploadSingleFile = (fieldName: string) => {
  const upload = multer(multerConfig).single(fieldName);
  
  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              message: `File size too large. Maximum file size allowed is ${maxSize / 1024 / 1024}MB`,
            });
          }
        }
        
        return res.status(400).json({
          success: false,
          message: err.message || 'Error uploading file',
        });
      }
      
      if (req.fileValidationError) {
        return res.status(400).json({
          success: false,
          message: req.fileValidationError,
        });
      }
      
      next();
    });
  };
};

// For backward compatibility with existing code
export const uploader = () => {
  return multer(multerConfig);
};
