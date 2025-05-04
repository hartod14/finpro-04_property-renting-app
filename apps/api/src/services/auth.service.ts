import { Request } from 'express';
import { jwt_secret, prisma } from '../config';
import { Prisma, Role } from '@prisma/client';
import { hashedPassword } from '../helpers/bcrypt';
import { compare } from 'bcrypt';
import { getUserByEmail } from '../helpers/user.prisma';
import { ErrorHandler } from '../helpers/response.handler';
import { IUserLogin } from '../interfaces/user.interface';
import { generateReferralCode } from '../helpers/referral-code-generator';
import { generateAuthToken } from '../helpers/token';
import { transporter } from '../helpers/nodemailer';
import { hbs } from '../helpers/handlebars';
import {
  decodeVerificationJwt,
  verificationJwt,
} from '@/helpers/verification.jwt';
import { decode } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: IUserLogin;
}

class AuthService {
  async signIn(req: Request) {
    const { email, password, role } = req.body;

    const user = (await getUserByEmail(email)) as IUserLogin;

    if (!user) throw new ErrorHandler('wrong email', 401);
    if (!user.password)
      throw new ErrorHandler(
        'Password not set for this account, try to login with your social account below',
        401,
      );

    if (!(await compare(password, user.password as string)))
      throw new ErrorHandler('wrong password', 401);

    if (role == 'USER' && user.role == 'TENANT')
      throw new ErrorHandler('wrong email', 401);

    if (role == 'TENANT' && user.role == 'USER')
      throw new ErrorHandler('wrong email', 401);

    return await generateAuthToken(user);
  }

  async googleAuth(req: Request) {
    const { email, name, google_id, profile_picture, role } = req.body;

    // Check if user exists
    let user = await getUserByEmail(email);

    if (!user) {
      // Create new user if email doesn't exist
      user = await prisma.user.create({
        data: {
          email,
          name: name || 'User',
          google_id,
          profile_picture,
          role: role || 'USER',
          is_verified: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          password: true,
          profile_picture: true,
          is_verified: true,
          role: true,
        },
      });
    } else {
      // Update existing user with Google info
      user = await prisma.user.update({
        where: { email },
        data: {
          google_id,
          name: user.name || name || 'User',
          profile_picture: user.profile_picture || profile_picture,
          is_verified: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          password: true,
          profile_picture: true,
          is_verified: true,
          role: true,
        },
      });
    }

    const authTokens = await generateAuthToken(user as IUserLogin);

    return authTokens;
  }

  async facebookAuth(req: Request) {
    const { email, name, facebook_id, profile_picture, role } = req.body;
    let user = await getUserByEmail(email);

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || 'User',
          facebook_id,
          profile_picture,
          role: role || 'USER',
          is_verified: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          password: true,
          profile_picture: true,
          is_verified: true,
          role: true,
        },
      });
    } else {
      // Update existing user with Google info
      user = await prisma.user.update({
        where: { email },
        data: {
          facebook_id,
          name: user.name || name || 'User',
          profile_picture: user.profile_picture || profile_picture,
          is_verified: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          password: true,
          profile_picture: true,
          is_verified: true,
          role: true,
        },
      });
    }

    const authTokens = await generateAuthToken(user as IUserLogin);

    return authTokens;
  }

  async signUp(req: Request) {
    const { email, role } = req.body;
    let name = '';
    const result = await prisma.$transaction(async (tx) => {
      const token = verificationJwt(email);
      if (role === 'TENANT') name = 'Tenant property';

      const newUser = await tx.user.create({
        data: {
          email,
          role,
          name,
        },
      });

      await this.sendEmailVerifAndSetPass(email, token, role);

      return newUser;
    });

    return result;
  }

  async updateUser(req: Request) {
    const { password, name, phone, profile_picture, email } = req.body;
    const id = Number((req as any).user?.id);
    const data: Prisma.UserUpdateInput = {};
    if (profile_picture) data.profile_picture = profile_picture;
    if (password) data.password = password;
    if (name) data.name = name;
    if (phone) data.phone = String(phone);
    if (email) data.email = email;

    await prisma.user.update({
      data,
      where: {
        id,
      },
    });
    return await prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        role: true,
        profile_picture: true,
        phone: true,
      },
      where: {
        id,
      },
    });
  }

  async changePassword(req: Request) {
    const { password, new_password, confirm_new_password } = req.body;
    const email = (req as any).user?.email;
    const user = (await getUserByEmail(email)) as IUserLogin;
    if (new_password != confirm_new_password)
      throw new ErrorHandler(
        'new password and confirm new passwod not same',
        401,
      );

    if (!(await compare(password, user.password as string)))
      throw new ErrorHandler('wrong password', 401);

    await prisma.user.update({
      data: {
        password: await hashedPassword(new_password),
      },
      where: {
        id: user.id,
      },
    });
  }

  async refreshToken(req: AuthenticatedRequest) {
    if (!req.user?.email) throw new ErrorHandler('invalid token');

    return await generateAuthToken(undefined, req.user?.email);
  }

  async forgetPassword(email: string) {
    const user = await getUserByEmail(email);
    if (!user) throw new ErrorHandler('user not found', 400);
    const token = verificationJwt(email);

    await this.sendEmailForgetPassword(email, token);
    return user;
  }

  async sendEmailForgetPassword(email: string, token: string) {
    try {
      const compiledTemplate = hbs('forget-password.hbs');
      const html = compiledTemplate({
        email,
        token,
        FRONTEND_URL: process.env.FRONTEND_URL,
      });

      transporter.sendMail({
        to: email,
        subject: 'Forget Password Request',
        html,
      });

      return 'Success send email';
    } catch (error) {
      throw new ErrorHandler('Failed send email');
    }
  }

  async sendEmailVerifAndSetPass(
    email: string,
    token: string,
    role: string = 'USER',
  ) {
    try {
      const compiledTemplate = hbs('verification-and-set-password.hbs');
      const html = compiledTemplate({
        email,
        token,
        role,
        FRONTEND_URL: process.env.FRONTEND_URL,
      });

      transporter.sendMail({
        to: email,
        subject: 'Verification and Set Password',
        html,
      });
      return 'Success send email';
    } catch (error) {
      throw new ErrorHandler('Failed send email');
    }
  }

  async sendEmailVerification(email: string, token: string) {
    try {
      const compiledTemplate = hbs('verification.hbs');
      const html = compiledTemplate({
        email,
        token,
        FRONTEND_URL: process.env.FRONTEND_URL,
      });

      transporter.sendMail({
        to: email,
        subject: 'Verification',
        html,
      });

      return 'Success send email';
    } catch (error) {
      throw new ErrorHandler('Failed send email');
    }
  }

  async sendChangeEmailVerification(email: string, token: string) {
    try {
      const compiledTemplate = hbs('change-email.hbs');
      const html = compiledTemplate({
        email,
        token,
        FRONTEND_URL: process.env.FRONTEND_URL,
      });

      transporter.sendMail({
        to: email,
        subject: 'Change Email Verification',
        html,
      });

      return 'Success send email';
    } catch (error) {
      throw new ErrorHandler('Failed send email');
    }
  }
  async checkVerificationToken(req: Request) {
    const { token } = req.query;
    const decoded = decodeVerificationJwt(token as string);

    if (decoded && typeof decoded === 'object' && 'iat' in decoded) {
      const issuedAt = new Date((decoded.iat as number) * 1000);
      const currentTime = new Date();
      const hoursPassed =
        (currentTime.getTime() - issuedAt.getTime()) / (1000 * 60 * 60);

      if (hoursPassed > 1) {
        return 'token invalid';
      }
    }

    return decoded;
  }

  async verificationSetPassword(req: Request) {
    const { token, password } = req.body;
    const decoded = decodeVerificationJwt(token as string) as { email: string };
    try {
      await this.updatePassword(decoded.email, password, true);
    } catch (error) {
      throw new ErrorHandler(error as string);
    }
  }

  async updatePassword(
    email: string,
    password: string,
    is_verified: boolean | null = false,
  ) {
    try {
      const data: any = {
        password: await hashedPassword(password),
      };

      if (is_verified !== null) {
        data.is_verified = is_verified;
      }

      return await prisma.user.update({
        where: { email },
        data,
      });
    } catch (error) {
      throw new ErrorHandler('Failed update password');
    }
  }

  async resendVerificationEmail(email: string) {
    const token = verificationJwt(email);
    await this.sendEmailVerifAndSetPass(email, token);
  }

  async sendOnlyVerificationEmail(email: string) {
    const token = verificationJwt(email);
    await this.sendEmailVerification(email, token);
  }

  async updateStatusVerification(token: string) {
    const user = decodeVerificationJwt(token) as { email: string };

    await prisma.user.update({
      where: { email: user.email },
      data: { is_verified: true },
    });
  }

  async checkPasswordSet(email: string) {
    const userDetail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userDetail?.password) {
      return true;
    } else {
      return false;
    }
  }

  async sendChangeEmail(email: string) {
    const token = verificationJwt(email);
    await this.sendChangeEmailVerification(email, token);
  }

  async updateChangeEmail(token: string, req: Request) {
    const user = decodeVerificationJwt(token) as { email: string };
    const { email, password } = req.body;
    const emailExist = await prisma.user.findUnique({
      where: { email: email },
    });
    if (emailExist) throw new ErrorHandler('Email already exists', 400);

    await prisma.user.update({
      where: { email: user.email },
      data: {
        email: email,
        password: await hashedPassword(password),
        is_verified: false,
        google_id: null,
        facebook_id: null,
      },
    });
  }
}

export default new AuthService();
