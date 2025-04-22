/** @format */

import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { jwtDecode } from 'jwt-decode';
import { InvalidAuthError } from '../interfaces/auth.error';
import { login, refreshToken, googleAuth, facebookAuth } from '@/handlers/auth';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth/user/login',
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        domain: process.env.AUTH_DOMAIN as string,
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
      },
    },
  },
  secret: process.env.AUTH_SECRET as string,
  trustHost: true,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 3,
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const result = await login(credentials);
          return result;
        } catch (error: unknown) {
          throw new InvalidAuthError(error);
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      // console.log('account', account);
      // console.log('profile', profile);
      // console.log('user', user);
      if (account?.provider == 'google' && profile?.email) {
        try {
          const { sub, email, name, picture } = profile;
          const auth = await googleAuth({
            email: email as string,
            name: name as string,
            google_id: sub || '',
            profile_picture: picture || '',
          });

          if (auth?.data?.access_token) {
            user.access_token = auth.data.access_token;
            user.refresh_token = auth.data.refresh_token;
          }
        } catch (error) {
          return false;
        }
      }

      if (account?.provider == 'facebook' && profile?.email) {
        try {
          const { id, email, name, picture } = profile;
          const auth = await facebookAuth({
            email: email as string,
            name: name as string,
            facebook_id: id || '',
            profile_picture: picture.data.url || '',
          });

          if (auth?.data?.access_token) {
            user.access_token = auth.data.access_token;
            user.refresh_token = auth.data.refresh_token;
          }
        } catch (error) {
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger }) {
      if (user) {
        const { access_token, refresh_token } = user;
        return { access_token, refresh_token };
      } else if (token.access_token || trigger == 'update') {
        const newToken = await refreshToken();

        return newToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.access_token) {
        const user = jwtDecode(token.access_token!) as User;
        session.user.id = user.id as string;
        session.user.email = user.email as string;
        session.user.phone = user.phone as string;
        session.user.profile_picture = user.profile_picture as string;
        session.user.is_verified = user.is_verified as boolean;
        session.user.name = user.name as string;
        session.user.role = user.role as string;
        session.user.access_token = token.access_token as string;
      }

      return session;
    },
  },
});
