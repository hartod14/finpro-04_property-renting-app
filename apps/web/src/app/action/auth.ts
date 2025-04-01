/** @format */

"use server";

import { signIn, signOut } from "@/helpers/auth";


export const login = async (credentials: { email: string; password: string }) =>
  await signIn("credentials", {
    ...credentials,
    redirect: false,
  }).catch((err) => (err instanceof Error ? { error: err.message } : err));

export const logout = async () => {
  await signOut();
};
