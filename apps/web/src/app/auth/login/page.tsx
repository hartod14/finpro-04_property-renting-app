/** @format */
"use client";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import { login } from "@/app/action/auth";

export default function Page() {
  const { push } = useRouter();
  const open = useRef(false);
  const [errMessage, setErrMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      setErrMessage("");
      await login(values).then((res) => {
        if (res?.error) {
          setErrMessage(res.error);
        } else {
          open.current = true;
          push("/");
        }
      });
    },
  });

  return (
    <div>
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <div className="mb-6 text-center">
          <h4 className="text-2xl font-bold mb-2">Login</h4>
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-green-600 font-semibold">
              Sign up here
            </Link>
          </p>
        </div>
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <input
            type="email"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Email Address"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          <input
            type="password"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {errMessage && <p className="text-sm text-red-600">{errMessage}</p>}
          <button
            className={`w-full p-3 rounded-md text-white font-semibold transition-all duration-200 ease-in-out ${
              formik.isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Processing..." : "Login"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href={"/forget-password"} className="text-green-600 font-semibold">
            Forgot password?
          </Link>
        </div>
      </div>
      <Snackbar
        open={open.current}
        autoHideDuration={1500}
        onClose={() => {
          open.current = false;
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          Login Success
        </Alert>
      </Snackbar>
    </div>
  );
}
