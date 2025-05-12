export interface ICalendarState {
  currentMonth: Date;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  hoverDate: Date | null;
  showCalendar: boolean;
}

export interface CalendarRenderProps {
  monthDate: Date;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  hoverDate: Date | null;
  handleDateClick: (date: Date) => void;
  handleHover: (date: Date) => void;
  isDateEqual: (date1: Date | null, date2: Date | null) => boolean;
  isDateInRange: (date: Date, startDate: Date | null, endDate: Date | null) => boolean;
  isDateHighlighted: (date: Date) => boolean;
  isDateInPast: (date: Date) => boolean;
  getDaysInMonth: (year: number, month: number) => number;
  getFirstDayOfMonth: (year: number, month: number) => number;
} 