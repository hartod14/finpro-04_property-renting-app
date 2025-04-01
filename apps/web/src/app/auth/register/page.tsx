/** @format */
"use client";
import { Alert, Snackbar } from "@mui/material";
import { useFormik } from "formik";
import Link from "next/link";
import React, { useRef } from "react";
import { registerValidator } from "@/validators/auth.validator";
import { registerInit } from "@/helpers/formiks/formik.init";
import { register } from "@/handlers/auth";
import { useRouter } from "next/navigation";

export default function Page() {
  const [errMessage, setErrMessage] = React.useState("");
  const open = useRef(false);
  const router = useRouter();

  const formik = useFormik({
    validationSchema: registerValidator,
    initialValues: registerInit,
    onSubmit: async (values) => {
      setErrMessage("");
      await register(values).then((res) => {
        if (res?.error) setErrMessage(res.error);
        else {
          open.current = true;
          formik.resetForm();
          router.push("/login");
        }
      });
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <div className="mb-4">
          <h4 className="text-2xl font-bold mb-2">Register</h4>
          <h5 className="mb-4">
            {"Already have an account? "}
            <Link href={"/login"} className="text-green-600 font-semibold">
              Sign in here
            </Link>
          </h5>
        </div>
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <input
            type="email"
            required
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500"
            placeholder="Email Address"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          <input
            type="text"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500"
            placeholder="Your Phone (optional)"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
          />
          <input
            type="text"
            required
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500"
            placeholder="Your Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          <p className="text-sm text-red-600">{formik.errors.name}</p>
          <input
            type="password"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500"
            placeholder="Password"
            name="password"
            required
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          <p className="text-sm text-red-600">{formik.errors.password}</p>
          <input
            type="password"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500"
            placeholder="Confirm Password"
            name="confirmPassword"
            required
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
          />
          <p className="text-sm text-red-600">{formik.errors.confirmPassword}</p>
          <input
            type="text"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500"
            placeholder="Referral code (optional)"
            name="referral_code"
            value={formik.values.referral_code}
            onChange={formik.handleChange}
          />
          <p className="text-sm text-red-600">{formik.errors.referral_code}</p>
          <p className="text-sm text-red-600">{errMessage}</p>
          <p className="text-xs text-gray-600">
            {"By registering, I agree to Eventic's "}
            <span className="text-green-600">Terms and Conditions</span>
            {" and "}
            <span className="text-green-600">Privacy Policy</span>
          </p>
          <button
            className={`${!(formik.isValid && formik.dirty) || formik.isSubmitting
                ? "bg-gray-300 text-gray-400"
                : "bg-green-600 text-white"
              } font-semibold p-4 w-full rounded-full transition duration-300 hover:bg-green-700 disabled:bg-gray-300`}
            disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
          >
            {formik.isSubmitting ? "Processing..." : "Register"}
          </button>
          <p className="text-center text-gray-500 text-sm">
            Your data will be protected and will not be shared
          </p>
        </form>
        <Snackbar
          open={open.current}
          autoHideDuration={1500}
          onClose={() => {
            open.current = false;
          }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
            Register Success
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
