'use client';

import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { DayPicker } from 'react-day-picker';
import { FaCalendarAlt } from 'react-icons/fa';

export interface DateRangeWithPricesProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onChange: (dates: [Date | undefined, Date | undefined]) => void;
  startDatePlaceholder?: string;
  endDatePlaceholder?: string;
  className?: string;
}

function DayWithPrice(props: any) {
  const { date, displayMonth, selected, disabled, hidden, inRange, ...rest } =
    props;

  const price = 500;

  if (hidden) return <div aria-hidden className="rdp-day_hidden"></div>;

  const isCurrentMonth =
    displayMonth && date ? displayMonth.getMonth() === date.getMonth() : false;

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        className={`
          w-10 h-10 mx-auto flex items-center justify-center rounded-full
          ${
            selected
              ? 'bg-primary text-white'
              : inRange
                ? 'bg-primary/10 text-primary'
                : disabled
                  ? 'text-gray-300'
                  : !isCurrentMonth
                    ? 'text-gray-400'
                    : 'hover:bg-gray-100'
          } 
          transition-colors
        `}
        disabled={disabled}
        {...rest}
      >
        {date?.getDate()}
      </button>
      {!disabled && isCurrentMonth && (
        <span
          className={`text-xs font-semibold mt-1 ${selected ? 'text-primary' : 'text-gray-600'}`}
        >
          ${price.toLocaleString()}
        </span>
      )}
    </div>
  );
}

export function CalendarWithPrices({
  startDate,
  endDate,
  onChange,
  startDatePlaceholder = 'Check-in',
  endDatePlaceholder = 'Check-out',
  className = '',
}: DateRangeWithPricesProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Get date 12 months from now for the calendar limit
  const getMaxDate = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 12, today.getDate());
  };

  const handleChange = (range: any) => {
    if (!range) {
      onChange([undefined, undefined]);
      return;
    }
    onChange([range.from, range.to]);

    if (range.from && range.to) {
      setIsOpen(false);
    }
  };

  const selected = {
    from: startDate || undefined,
    to: endDate || undefined,
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={calendarRef}>
      <div className="w-8 h-8 bg-gray-100 rounded-full absolute left-2 top-3 flex items-center justify-center text-primary z-10">
        <FaCalendarAlt size={14} />
      </div>
      <div
        className="w-full pl-12 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center h-12 text-gray-700">
          {startDate ? startDate.toLocaleDateString() : startDatePlaceholder}
          {' - '}
          {endDate ? endDate.toLocaleDateString() : endDatePlaceholder}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-1 bg-white shadow-xl rounded-lg p-4 w-full md:max-w-[700px]">
          <DayPicker
            mode="range"
            selected={selected}
            onSelect={handleChange}
            numberOfMonths={isDesktop ? 2 : 1}
            pagedNavigation
            className="border-0 p-0"
            components={{
              Day: DayWithPrice,
            }}
            modifiers={{
              inRange: { from: selected.from, to: selected.to },
            }}
            modifiersClassNames={{
              selected: 'bg-primary text-white',
              today: 'font-bold',
              disabled: 'text-gray-300',
              inRange: 'bg-primary/10 text-primary',
            }}
            styles={{
              months: {
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
              },
              month: { margin: '0 5px' },
              caption: {
                textAlign: 'center',
                margin: '10px 0',
                position: 'relative',
              },
              caption_label: { fontSize: '1rem', fontWeight: 'bold' },
              day: { margin: '1px', width: '40px', height: '60px' },
            }}
            showOutsideDays
            fromMonth={new Date()}
            toMonth={getMaxDate()}
          />
          <div className="mt-4 text-xs text-gray-500 text-center">
            Prices shown are per night, excluding taxes and fees
          </div>
        </div>
      )}
    </div>
  );
}
