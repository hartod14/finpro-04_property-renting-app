/** @format */
'use server';
import { api } from './_api';
import { cookies } from 'next/headers';
import { decode } from 'next-auth/jwt';
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

export const updateUser = async (data: Record<string, unknown>) => {
  await api(
    '/auth/update',
    'PATCH',
    {
      body: data,
      contentType: 'application/json',
    },
    await getAccessToken(),
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

export const updateStatusVerification = async (token: string) => {
  return await api(
    `/auth/update-status-verification?token=${encodeURIComponent(token)}`,
    'PATCH',
    undefined,
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
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

export const facebookAuth = async (profileData: {
  email: string;
  name?: string;
  facebook_id: string;
  profile_picture?: string;
}) => {
  try {
    const response = await api('/auth/facebook', 'POST', {
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
  return await api(
    `/auth/update-password?token=${encodeURIComponent(token)}`,
    'PATCH',
    {
      body: { password: values.password },
      contentType: 'application/json',
    },
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
};

export const changePassword = async (data: Record<string, unknown>) => {
  return await api(
    '/auth/password/change',
    'PATCH',
    {
      body: data,
      contentType: 'application/json',
    },
    await getAccessToken(),
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
};

export const sendOnlyVerificationEmail = async (email: string) => {
  return await api('/auth/verification-only', 'POST', {
    body: { email },
    contentType: 'application/json',
  }).catch((err) => (err instanceof Error ? { error: err.message } : err));
};

export const checkPasswordSet = async (email: string) => {
  return await api(
    `/auth/check-password-set?email=${encodeURIComponent(email)}`,
    'GET',
    undefined,
    await getAccessToken(),
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
};

export const sendChangeEmail = async (email: string) => {
  return await api('/auth/change-email', 'POST', {
    body: { email },
    contentType: 'application/json',
  }).catch((err) => (err instanceof Error ? { error: err.message } : err));
};

export const updateChangeEmail = async (token: string, values: any) => {
  return await api(
    `/auth/change-email?token=${encodeURIComponent(token)}`,
    'PATCH',
    { body: values, contentType: 'application/json' },
  ).catch((err) => (err instanceof Error ? { error: err.message } : err));
};
