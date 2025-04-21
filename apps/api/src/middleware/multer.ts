import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Local directory setup (for reference, not needed if using Supabase)
const uploadDir = path.join(__dirname, '../../public/uploads/payment-proof');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
