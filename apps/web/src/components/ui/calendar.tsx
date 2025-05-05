'use client';

import * as React from 'react';
import DatePicker from 'react-datepicker';
import { FaCalendarAlt } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';

export interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: [Date | null, Date | null]) => void;
  startDatePlaceholder?: string;
  endDatePlaceholder?: string;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  startDatePlaceholder = 'Check-in',
  endDatePlaceholder = 'Check-out',
  className = '',
}: DateRangePickerProps) {
  const handleChange = (dates: [Date | null, Date | null]) => {
    onChange(dates);
  };

  // Custom styles for the date picker
  const customStyles = {
    '.react-datepicker': {
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      fontFamily: 'inherit',
      display: 'flex',
    },
    '.react-datepicker__month-container': {
      background: '#fff',
      padding: '8px 0',
      display: 'inline-block',
      width: 'auto',
    },
    '.react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range': {
      backgroundColor: '#3b82f6',
      borderRadius: '50%',
      color: 'white',
    },
    '.react-datepicker__day--keyboard-selected': {
      backgroundColor: '#93c5fd',
      borderRadius: '50%',
    },
    '.react-datepicker__day:hover': {
      backgroundColor: '#e0f2fe',
      borderRadius: '50%',
    },
    '.react-datepicker__header': {
      backgroundColor: 'white',
      borderBottom: 'none',
      padding: '8px 0',
    },
    '.react-datepicker__day--in-range:not(.react-datepicker__day--selected)': {
      backgroundColor: '#e0f2fe',
      color: '#1e3a8a',
    },
    '.react-datepicker__month': {
      margin: '0.4rem',
    },
  };
  
  return (
    <div className={`relative flex items-center w-full ${className} ` } >
      <div className="w-8 h-8 bg-gray-100 rounded-full absolute  flex items-center justify-center text-primary z-10">
        <FaCalendarAlt size={14} />
      </div>
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        monthsShown={2}
        placeholderText={`${startDatePlaceholder} - ${endDatePlaceholder}`}
        className="w-full py-2 pl-12 pr-2 bg-transparent text-gray-700 focus:outline-none"
        dateFormat="MMM dd, yyyy"
        minDate={new Date()}
        popperClassName="z-[1000]" // Higher z-index to ensure it's above other elements
        customInput={
          <input 
            className="w-full outline-none text-gray-700"
          />
        }
        calendarClassName="shadow-lg border-0 !z-[1000]"
        formatWeekDay={(day) => day.substr(0, 1)}
        showPopperArrow={false}
        inline={false}
      />
      <style jsx global>{`
        ${Object.entries(customStyles)
          .map(([selector, styles]) => 
            `${selector} { ${Object.entries(styles)
              .map(([prop, value]) => `${prop}: ${value};`)
              .join(' ')} }`
          )
          .join('\n')}
      `}</style>
    </div>
  );
}

export interface SingleDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  minDate?: Date;
}

export function SingleDatePicker({
  selected,
  onChange,
  placeholder = 'Select date',
  className = '',
  minDate,
}: SingleDatePickerProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="w-8 h-8 bg-gray-100 rounded-full absolute left-2 flex items-center justify-center text-gray-500 z-10">
        <FaCalendarAlt size={14} />
      </div>
      <DatePicker
        selected={selected}
        onChange={onChange}
        placeholderText={placeholder}
        className="w-full py-2 pl-12 pr-2 bg-transparent text-gray-700 focus:outline-none"
        dateFormat="MMM dd, yyyy"
        minDate={minDate || new Date()}
        popperClassName="z-[1000]"
        customInput={
          <input 
            className="w-full outline-none text-gray-700"
          />
        }
        calendarClassName="shadow-lg border-0"
        formatWeekDay={(day) => day.substr(0, 1)}
        showPopperArrow={false}
      />
    </div>
  );
} 