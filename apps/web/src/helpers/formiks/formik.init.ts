/** @format */

import { User } from "next-auth";

export const registerInit = {
  email: "",
  name: "",
  phone: "",
  password: "",
  confirmPassword: "",
  referral_code: ""
};

export const updateProfileInit = (user: User) => {
  return {
    name: user.name || "",
    image: null,
    profile_photo: user.profile_photo || "",
  };
};

export const profileInit = {
  name: "",
  phone: "",
  email: "",
  profile_photo: ""
}

