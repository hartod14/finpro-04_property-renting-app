import { useField, useFormikContext } from "formik";
import React from "react";
import { DateRangePicker } from "@/components/ui/calendar";

interface Props {
    startDateName: string;
    endDateName: string;
    label: string;
    required?: boolean;
    startDatePlaceholder?: string;
    endDatePlaceholder?: string;
}

export const InputFieldDateRange = ({
    startDateName,
    endDateName,
    label,
    required = false,
    startDatePlaceholder = "Check-in",
    endDatePlaceholder = "Check-out"
}: Props) => {
    const formik = useFormikContext<any>();
    const [startDateField, startDateMeta] = useField(startDateName);
    const [endDateField, endDateMeta] = useField(endDateName);

    const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        formik.setFieldValue(startDateName, start ? start.toISOString().split('T')[0] : '');
        formik.setFieldValue(endDateName, end ? end.toISOString().split('T')[0] : '');
    };

    return (
        <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {label} {!required && <span className="text-gray-500">(optional)</span>}
            </label>
            <div className="border border-gray-300 rounded-lg p-1">
                <DateRangePicker
                    startDate={startDateField.value ? new Date(startDateField.value) : null}
                    endDate={endDateField.value ? new Date(endDateField.value) : null}
                    onChange={handleDateRangeChange}
                    startDatePlaceholder={startDatePlaceholder}
                    endDatePlaceholder={endDatePlaceholder}
                />
            </div>
            {startDateMeta.touched && startDateMeta.error && (
                <div className="text-red-500 text-sm mt-1">
                    {startDateMeta.error}
                </div>
            )}
            {endDateMeta.touched && endDateMeta.error && (
                <div className="text-red-500 text-sm mt-1">
                    {endDateMeta.error}
                </div>
            )}
        </div>
    );
} 