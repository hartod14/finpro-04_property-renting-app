import { ErrorMessage, Field, FormikProps } from "formik";
import React from "react";

interface Props {
    id: string;
    name: string;
    label: string;
    options: Array<any>;
    required?: boolean;
}

export const InputSelect = ({ id, name, label, options, required = false }: Props) => {
    return (
        <div>
            <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {label} {!required && <span className="text-gray-500">(optional)</span>}
            </label>
            <Field
                as="select"
                id={id}
                name={name}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value=""></option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </Field>
            <span className="text-red-400">
                <ErrorMessage
                    name={name}
                />
            </span>
        </div>
    );
};
