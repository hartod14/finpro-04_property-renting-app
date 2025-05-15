/** @format */

import { Request } from 'express';
import { cloudinaryUpload } from '../helpers/cloudinary';
import { ErrorHandler } from '../helpers/response.handler';

class UploadImageService {
  async uploadImage(req: Request) {
    const { file } = req;
    
    if (!file) throw new ErrorHandler('No File Uploaded', 400);
    
    const { secure_url } = await cloudinaryUpload(file);
    return secure_url;
  }
}

export default new UploadImageService();
