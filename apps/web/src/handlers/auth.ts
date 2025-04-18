/** @format */
'use server';
import { api } from './_api';
import { cookies } from 'next/headers';
import { decode } from 'next-auth/jwt';
import { log } from 'console';
import { auth_secret } from '@/helpers/config';

export const login = async (credentials: Partial<Record<string, unknown>>) => {
  const res = await api('/auth', 'POST', {
    body: credentials,
    contentType: 'application/json',
  });

  return {
    access_token: res.data.access_token,
    refresh_token: res.data.refresh_token,
  };
};

export const register = async (newUser: { email: string; role: string }) =>
  await api('/auth/new', 'POST', {
    body: newUser,
    contentType: 'application/json',
  })
    .then(() => 'New user has been registered')
    .catch((err) => (err instanceof Error ? { error: err.message } : err));

export const refreshToken = async () => {
  const cookie = cookies();
  const ftoken = (await cookie).get('next-auth.session-token')?.value;
  const { refresh_token } = (await decode({
    token: String(ftoken),
    secret: auth_secret,
    salt: 'next-auth.session-token',
  })) as { refresh_token: string };

  const res = await api('/auth/token', 'POST', {}, refresh_token);

  return {
    access_token: res.data.access_token,
    refresh_token: res.data.refresh_token,
  };
};

export const updateUser = async (
  data: {
    name: string;
  },
  token: string,
) => {
  await api(
    '/auth',
    'PATCH',
    {
      body: data,
      contentType: 'application/json',
    },
    token,
  );
};

export const getAccessToken = async () => {
  const cookie = cookies();
  const token = (await cookie).get('next-auth.session-token')?.value;

  if (token) {
    const { access_token } = (await decode({
      token: String(token),
      secret: auth_secret,
      salt: 'next-auth.session-token',
    })) as { access_token: string };

    return access_token;
  } else {
    return;
  }
};

export const checkVerificationToken = async (token: string) => {
  return await api(
    `/auth/check-verification?token=${encodeURIComponent(token)}`,
    'GET',
    undefined,
  );
};

export const verificationAndSetPassword = async (
  token: string,
  values: any,
) => {
  return await api(`/auth/verification-set-password`, 'PATCH', {
    body: {
      token,
      password: values.password,
    },
    contentType: 'application/json',
  });
};

export const resendVerificationEmail = async (email: string) => {
  return await api('/auth/resend-verification', 'POST', {
    body: { email },
    contentType: 'application/json',
  }).catch((err) => (err instanceof Error ? { error: err.message } : err));
};

export const forgetPassword = async (email: string) => {
  return await api(`/auth/forget-password`, 'POST', {
    body: { email },
    contentType: 'application/json',
  }).catch((err) => (err instanceof Error ? { error: err.message } : err));
};

export const googleAuth = async (profileData: {
  email: string;
  name?: string;
  google_id: string;
  profile_picture?: string;
}) => {
  try {
    const response = await api('/auth/google', 'POST', {
      body: {
        ...profileData,
        role: 'USER',
      },
      contentType: 'application/json',
    });

    return {
      data: {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
      },
    };
  } catch (err) {
    throw err;
  }
};

export const updatePassword = async (token: string, values: any) => {
  return await api(`/auth/update-password?token=${encodeURIComponent(token)}`, 'PATCH', {
    body: { password: values.password },
    contentType: 'application/json',
  }).catch((err) => (err instanceof Error ? { error: err.message } : err));
};
