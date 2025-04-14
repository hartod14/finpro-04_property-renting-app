/** @format */

import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { jwtDecode } from "jwt-decode";
import { InvalidAuthError } from "../interfaces/auth.error";
import { login, refreshToken } from "../handlers/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        domain: process.env.AUTH_DOMAIN as string,
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: true,
      },
    },
  },
  secret: process.env.AUTH_SECRET as string,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          return await login(credentials);
        } catch (error: unknown) {
          throw new InvalidAuthError(error);
        }
      },
    }),
    Google({
      authorization: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
      },
    }),
  ],
  callbacks: {
    signIn({ account, profile }) {
      if (account?.provider == "google") {
        return profile?.email_verified || false;
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        const { access_token, refresh_token } = user;
        return { access_token, refresh_token };
      } else if (token.access_token || trigger == "update") {
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
        session.user.profile_picture = user.profile_picture as string;
        session.user.name = user.name as string;
        session.user.role = user.role as string;
        session.user.access_token = token.access_token as string;
        session.user.phone = user.phone as string;
      }
      
      return session;
    },
  },
});