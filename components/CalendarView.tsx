import React, { useState } from 'react';
import { Booking } from '../types';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isWithinInterval,
  addMonths,
  subMonths,
  isBefore,
  startOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react';

interface CalendarViewProps {
  bookings: Booking[];
  modelName: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ bookings, modelName }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfDay(new Date());

  const onNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const onPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  // Generate days
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const isDateBooked = (dateToCheck: Date) => {
    return bookings.some(b => {
      // Normalize booking dates to ensure time doesn't affect comparison
      const start = startOfDay(b.start);
      const end = startOfDay(b.end);
      const check = startOfDay(dateToCheck);
      return b.model === modelName && isWithinInterval(check, { start, end });
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-pink-100 border border-pink-100 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-pink-50 border-b border-pink-100">
        <button onClick={onPrevMonth} className="p-1 hover:bg-pink-100 rounded-full text-pink-500 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="text-pink-600 font-serif font-bold italic text-lg">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <button onClick={onNextMonth} className="p-1 hover:bg-pink-100 rounded-full text-pink-500 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 gap-1 p-2 bg-white">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
          <div key={i} className="text-center text-xs font-bold text-pink-400 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 p-2 bg-white">
        {calendarDays.map((dateItem, index) => {
          const isBooked = isDateBooked(dateItem);
          const isToday = isSameDay(dateItem, today);
          const isPast = isBefore(dateItem, today) && !isToday;
          const isCurrentMonth = isSameMonth(dateItem, monthStart);

          let cellClass = "h-10 rounded-lg flex items-center justify-center text-sm relative transition-all duration-200 border ";
          
          if (!isCurrentMonth) {
            cellClass += "text-gray-300 border-transparent bg-gray-50/50 ";
          } else if (isPast) {
             cellClass += "text-gray-400 bg-gray-100 border-transparent ";
          } else if (isBooked) {
            cellClass += "bg-red-50 text-red-500 border-red-100 font-semibold cursor-not-allowed ";
          } else {
            cellClass += "bg-green-50 text-green-600 border-green-100 font-medium ";
          }

          if (isToday) {
            cellClass += "ring-2 ring-pink-400 ring-offset-1 z-10 ";
          }

          return (
            <div key={index} className={cellClass}>
              <span>{format(dateItem, dateFormat)}</span>
              {isCurrentMonth && !isPast && (
                <div className="absolute bottom-0.5 right-0.5">
                    {isBooked ? <X size={10} strokeWidth={3} /> : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 text-center border-t border-gray-100 flex justify-center gap-4">
         <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span>Available</span>
         <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span>Busy</span>
         <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300"></span>Past</span>
      </div>
    </div>
  );
};

export default CalendarView;