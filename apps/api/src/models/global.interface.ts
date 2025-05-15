/** @format */

import { IUserLogin } from '../interfaces/user.interface';

declare global {
  namespace Express {
    export interface Request {
      user?: IUserLogin;
    }
  }
}
