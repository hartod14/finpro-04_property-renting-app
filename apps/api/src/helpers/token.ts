/** @format */

import { jwt_secret, refresh_jwt_secret } from "../config";
import { sign } from "jsonwebtoken";
import { IUserLogin } from "../interfaces/user.interface";
import { getUserByEmail } from "./user.prisma";
import { ErrorHandler } from "./response.handler";

export const generateAuthToken = async (user?: IUserLogin, email?: string) => {
  const existingUser = user || ((await getUserByEmail(email!)) as IUserLogin);
  if (!existingUser) throw new ErrorHandler("wrong email", 401);
  delete existingUser.password;

  const access_token = sign(existingUser, jwt_secret, {
    expiresIn: "1h",
  });
  const refresh_token = sign(
    { email: existingUser.email },
    refresh_jwt_secret,
    {
      expiresIn: "2h",
    }
  );
  return { access_token, refresh_token };
};
