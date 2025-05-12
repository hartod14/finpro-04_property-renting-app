import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { resolve } from 'path';


export const NODE_ENV = process.env.NODE_ENV || 'development';

const envFile = NODE_ENV === 'development' ? '.env.development' : '.env';

config({ path: resolve(__dirname, `../${envFile}`) });
config({ path: resolve(__dirname, `../${envFile}.local`), override: true });

export const PORT = process.env.PORT || 8000;
export const DATABASE_URL = process.env.DATABASE_URL || '';

export const prisma = new PrismaClient();

export const jwt_secret = process.env.SECRET || '';
export const refresh_jwt_secret = process.env.REFRESH_SECRET || '';

export const cloudinary_config = process.env.CLOUDINARY_URL || '';

const midtransClient = require('midtrans-client');
export const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export const node_account = {
  user: process.env.NODEMAILER_USER || '',
  pass: process.env.NODEMAILER_PASS || '',
};
