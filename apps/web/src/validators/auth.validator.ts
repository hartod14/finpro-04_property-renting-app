/** @format */
import * as Yup from "yup";

export const registerValidator = Yup.object({
  email: Yup.string().email().required("Email is required"),
  role: Yup.string().nullable(),
});

export const updateProfileValidator = Yup.object({
  name: Yup.string().min(4).required("Name is required"),
  phone: Yup.string().min(4).required("Phone is required"),
});

export const changePasswordValidator = Yup.object({
  password: Yup.string()
    .required('Password is required'),
  new_password: Yup.string()
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Password must contain at least 8 characters, one uppercase, one number and one special case character',
    )
    .required('Password is required'),
  confirm_new_password: Yup.string()
    .required('Password Confirmation is required')
    .oneOf([Yup.ref('new_password')], 'Passwords must match'),
});
