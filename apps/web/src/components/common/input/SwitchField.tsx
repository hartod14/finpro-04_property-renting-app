import { FormikProps } from "formik";
import React from "react";

interface Props {
    id: string;
    name: string;
    label: string;
    formik: FormikProps<any>;
}

export const SwitchField = ({ id, name, label, formik, }: Props) => {
    const errorMessage = formik.touched[name] && formik.errors[name];

    return (
        <div>
            <label
                htmlFor={id}
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"

            >
                {label}
            </label>
            <label className="inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    id={id}
                    name={name}
                    checked={formik.values[name] === "ACTIVE"}
                    onChange={(e) => {
                        formik.setFieldValue(name, e.target.checked ? "ACTIVE" : "INACTIVE");
                    }}
                    onBlur={formik.handleBlur}
                    className="sr-only peer "
                />
                <div className="relative z-0 w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600" />
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {formik.values[name] == "ACTIVE" ? "Active" : "Inactive"}
                </span>
            </label>


            {errorMessage && (
                <p className="mb-4 text-red-400">
                    {typeof errorMessage === "string" && errorMessage}
                </p>
            )}
        </div>
    );
};
