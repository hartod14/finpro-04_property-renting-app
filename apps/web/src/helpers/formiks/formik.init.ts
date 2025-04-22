/** @format */

import { User } from "next-auth";

export const registerInit = {
  email: "",
  // name: "",
  // phone: "",
  // password: "",
  // confirmPassword: "",
  // referral_code: ""
};

export const updateProfileInit = (user: User) => {
  return {
    name: user.name || "",
    image: null,
    profile_picture: user.profile_picture || "",
  };
};

export const profileInit = {
  name: "",
  phone: "",
  email: "",
  profile_photo: ""
}

