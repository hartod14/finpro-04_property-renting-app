import * as Yup from 'yup';

export const verificationFormik = Yup.object({
  password: Yup.string()
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Password must contain at least 8 characters, one uppercase, one number, and one special case character',
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .required('Password Confirmation is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});
