import { ErrorMessage, Field, Formik } from "formik";
import React from "react";

interface Props {
    id: string;
    type: string;
    name: string;
    placeholder: string;
    label: string;
    required?: boolean
    // formik: FormikProps<any>;
}

export const InputField = ({ id, type, name, label, placeholder = "", required = false }: Props) => {
    return (
        <div className="w-full">
            <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {label} {!required && <span className="text-gray-500">(optional)</span>}
            </label>
            <Field
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <span className="text-red-400">
                <ErrorMessage
                    name={name}
                />
            </span>
        </div>
    );
}