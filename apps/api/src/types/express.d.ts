// types/express.d.ts
import { User } from '@prisma/client'; // atau tipe user sesuai yang kamu pakai

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        // tambahkan properti lain jika diperlukan
      };
    }
  }
}
