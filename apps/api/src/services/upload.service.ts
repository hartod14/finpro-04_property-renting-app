/** @format */

import { Request } from 'express';
import { cloudinaryUpload } from '@/helpers/cloudinary';
import { ErrorHandler } from '@/helpers/response.handler';

class UploadImageService {
  async uploadImage(req: Request) {
    const { file } = req;
    
    // Check if file exists
    if (!file) throw new ErrorHandler('No File Uploaded', 400);
    
    // Additional validation (already handled by multer, but double check here)
    const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new ErrorHandler('Only PNG, JPG and JPEG image formats are allowed', 400);
    }
    
    // Double check size
    if (file.size > 1048576) { // 1MB
      throw new ErrorHandler('Image size should not exceed 1MB', 400);
    }
    
    // Proceed with upload
    const { secure_url } = await cloudinaryUpload(file);
    return secure_url;
  }
}

export default new UploadImageService();
