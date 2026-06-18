import { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const SERVICE_COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-red-500',
  'bg-indigo-500',
];

export function AppointmentCalendar({ appointments, onDateClick, serviceColorMap, services}) {
  useEffect(()=>{
    // console.log("Services => ",services)
    // console.log("Appointments => ",appointments)

  })
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const daysInCalendar = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getAppointmentsForDay = (day) => {
    return appointments.filter(apt => isSameDay(new Date(apt.date), day));
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const today = new Date();
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}

        {daysInCalendar.map((day, index) => {
          const dayAppointments = getAppointmentsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, today);

          return (
            <div
              key={index}
              onClick={() => onDateClick(day)}
              className={`
                min-h-24 p-2 border rounded-lg cursor-pointer transition-all hover:shadow-md
                ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                ${isToday ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              <div className={`text-sm mb-1 ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${isToday ? 'font-bold text-blue-600' : ''}`}>
                {format(day, 'd')}
              </div>

              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map(apt => (
                  <div
                    key={apt.id}
                    className={`${serviceColorMap[apt.service_id]} text-white text-xs px-2 py-1 rounded truncate`}
                    title={`${services.find(service => service.id == apt.service_id)?.name} (${services.find(service => service.id == apt.service_id)?.duration} min)`}
                  >
                    {services.find(service => service.id == apt.service_id)?.name}
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-gray-500 px-2">
                    +{dayAppointments.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { SERVICE_COLORS };
