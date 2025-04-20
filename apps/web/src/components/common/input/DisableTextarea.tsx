import { ErrorMessage, Field, FormikProps } from "formik";
import React from "react";

interface Props {
    value: string;
    label: string;
    // formik: FormikProps<any>;
}

export const DisableTextArea = ({ value, label }: Props) => {
    return (
        <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {label}
            </label>
            <textarea
                disabled
                value={value}
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                rows={3}
            />
        </div >
    );
}