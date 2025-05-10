export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}


export interface DateRange {
  start: string;
  end: string;
}

export interface Room {
  roomId: string;
  roomName: string;
  unavailableDates: DateRange[];
  bookedDates: DateRange[];
}

export interface Property {
  propertyId: string;
  propertyName: string;
  rooms: Room[];
}

export interface MonthlyCalendarProps {
  calendar: Property[];
}