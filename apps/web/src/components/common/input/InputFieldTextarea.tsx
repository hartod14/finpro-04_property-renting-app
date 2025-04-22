import { ErrorMessage, Field, FormikProps } from "formik";
import React from "react";

interface Props {
    id: string;
    name: string;
    label: string;
    required?: boolean
}

export const InputFieldTextarea = ({ id, name, label, required = false }: Props) => {
    return (
        <div className="w-full">
            <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {label} {!required && <span className="text-gray-500">(optional)</span>}
            </label>
            <Field
                as="textarea"
                id={id}
                name={name}
                rows="3"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <span className="text-red-400">
                <ErrorMessage
                    name={name}
                />
            </span>
        </div>
    );
};
