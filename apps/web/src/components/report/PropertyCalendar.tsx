import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameMonth, isWithinInterval } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRange {
  start: string;
  end: string;
}

interface Room {
  roomId: string;
  roomName: string;
  unavailableDates: DateRange[];
  bookedDates: DateRange[];
}

interface Property {
  propertyId: string;
  propertyName: string;
  rooms: Room[];
}

interface PropertyCalendarProps {
  calendar: Property[];
  currentMonth: Date;
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
}

const PropertyCalendar: React.FC<PropertyCalendarProps> = ({ calendar, currentMonth, goToNextMonth, goToPreviousMonth }) => {
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });

  const isInRange = (day: Date, range: DateRange[]) => {
    return range.some(({ start, end }) => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      return isWithinInterval(day, { start: startDate, end: endDate });
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8 w-full max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Property Calendar
      </h2>

      {/* Navigation for month */}
      <div className="flex justify-center items-center gap-6 mb-4">
        <button
          onClick={goToPreviousMonth}
          className="text-white font-semibold text-lg bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 px-6 py-3 rounded-full shadow-lg transform hover:scale-110"
        >
          <ChevronLeft size={24} />
        </button>

        <span className="text-2xl font-bold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </span>

        <button
          onClick={goToNextMonth}
          className="text-white font-semibold text-lg bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 px-6 py-3 rounded-full shadow-lg transform hover:scale-110"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {calendar.map((property: Property) => (
        <div key={property.propertyId} className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {property.propertyName}
          </h3>

          {property.rooms.map((room: Room) => (
            <div key={room.roomId} className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-4">
                {room.roomName}
              </h4>

              {/* Weekday Labels */}
              <div className="grid grid-cols-7 gap-3 text-center text-xs text-gray-600 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="font-semibold">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-3 text-center text-sm">
                {days.map((day) => {
                  const isBooked = isInRange(day, room.bookedDates);
                  const isUnavailable = isInRange(day, room.unavailableDates);
                  const isCurrentMonth = isSameMonth(day, currentMonth);

                  return (
                    <div
                      key={day.toISOString()}
                      className={`p-3 rounded-full text-xs transition-all ${
                        isBooked
                          ? 'bg-green-500 text-white'
                          : isUnavailable
                          ? 'bg-red-500 text-white'
                          : isCurrentMonth
                          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer'
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      <div>{format(day, 'd')}</div>
                      <div className="text-xs mt-1">
                        {isBooked
                          ? 'Booked'
                          : isUnavailable
                          ? 'Unavailable'
                          : 'Available'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PropertyCalendar;
