/** @format */
"use server";
import { api } from "./_api";
import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { log } from "console";
import { auth_secret } from "@/helpers/config";

export const login = async (credentials: Partial<Record<string, unknown>>) => {
  const res = await api("/auth", "POST", {
    body: credentials,
    contentType: "application/json",
  });

  return {
    access_token: res.data.access_token,
    refresh_token: res.data.refresh_token,
  };
};

export const register = async (newUser: {
  email: string;
  name: string;
  phone: string;
  password: string;
}) =>
  await api("/auth/new", "POST", {
    body: newUser,
    contentType: "application/json",
  })
    .then(() => "New user has been registered")
    .catch((err) => (err instanceof Error ? { error: err.message } : err));

export const refreshToken = async () => {
  const cookie = cookies();
  const ftoken = (await cookie).get("next-auth.session-token")?.value;
  const { refresh_token } = (await decode({
    token: String(ftoken),
    secret: auth_secret,
    salt: "next-auth.session-token",
  })) as { refresh_token: string };

  const res = await api("/auth/token", "POST", {}, refresh_token);

  return {
    access_token: res.data.access_token,
    refresh_token: res.data.refresh_token,
  };
};

export const updateUser = async (
  data: {
    name: string;
  },
  token: string
) => {
  await api(
    "/auth",
    "PATCH",
    {
      body: data,
      contentType: "application/json",
    },
    token
  );
};

export const updateUserNew = async (data: Record<string, unknown>) => {
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

export const changePassword = async (data: Record<string, unknown>) => {
  await api(
    '/auth/password/change',
    'PATCH',
    {
      body: data,
      contentType: 'application/json',
    },
    await getAccessToken(),
  );
};

export const forgetPassword = async (data: Record<string, unknown>) => {  
  await api(
    '/auth/forget-password',
    'POST',
    {
      body: data,
      contentType: 'application/json',
    },
  );
};

export const getAccessToken = async () => {
  const cookie = cookies();
  const token = (await cookie).get("next-auth.session-token")?.value;

  if (token) {
    const { access_token } = (await decode({
      token: String(token),
      secret: auth_secret,
      salt: "next-auth.session-token",
    })) as { access_token: string };

    return access_token
  } else {
    return;
  }
}

// export const checkResetPasswordToken = async (token: string) => {
//   return await api(
//     `/auth/reset-password?token=${encodeURIComponent(token)}`,
//     'GET',
//     undefined
//   );
// };

// export const resetPassword = async (id: number, body: {
//   password: string,
//   token: string
// }) => {
//   return await api(
//     `/auth/reset-password/${id}`,
//     `POST`,
//     {
//       body,
//       contentType: "application/json",
//     },
//   )
// }