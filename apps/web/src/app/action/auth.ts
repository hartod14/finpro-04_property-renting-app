/** @format */

'use server';

import { signIn, signOut } from '@/helpers/auth';

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const result = await signIn('credentials', {
      ...credentials,
      redirect: false,
    });
    return result;
  } catch (err) {
    return err instanceof Error ? { error: err.message } : err;
  }
};

export const googleLogin = async () => {
  await signIn('google', {
    redirectTo: '/',
  });
};

export const facebookLogin = async () => {
  await signIn('facebook', {
    redirectTo: '/',
  });
};

export const logout = async () => {
  await signOut();
};
