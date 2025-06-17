'use client';

import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { 
  format, 
  parse, 
  startOfWeek, 
  getDay, 
  parseISO, 
  isSameDay,
  addMonths,
  subMonths,
  isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, CheckCircle2, Clock } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetchUpcoming } from '../lib/api';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {},
});

type UpcomingTask = {
  title: string;
  upcomingDates: string[];
};

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
};

export default function TaskOverview() {
  const [tasks, setTasks] = useState<UpcomingTask[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDateTasks, setSelectedDateTasks] = useState<UpcomingTask[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const allTasks = await fetchUpcoming('month');
        setTasks(allTasks);

        // Convert to calendar events
        const calendarEvents: CalendarEvent[] = [];
        allTasks.forEach((task: { upcomingDates: string[]; title: string; }) => {
          task.upcomingDates.forEach(dateStr => {
            const date = parseISO(dateStr);
            calendarEvents.push({
              title: task.title,
              start: date,
              end: date,
              allDay: true,
            });
          });
        });
        setEvents(calendarEvents);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDateClick = (slotInfo: { start: Date }) => {
    const clickedDate = slotInfo.start;
    setSelectedDate(clickedDate);
    
    const filteredTasks = tasks.filter(task =>
      task.upcomingDates.some(dateStr =>
        isSameDay(parseISO(dateStr), clickedDate)
      )
    );
    setSelectedDateTasks(filteredTasks);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const clearSelectedDate = () => {
    setSelectedDate(null);
    setSelectedDateTasks([]);
  };

  const currentMonthDisplay = format(currentDate, 'MMMM yyyy');

  // Custom event styling
  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: '#4f46e5',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0',
        display: 'block',
        fontSize: '0.75rem',
        padding: '2px 5px',
      }
    };
  };

  // Custom day cell styling
  const dayPropGetter = (date: Date) => {
    if (isToday(date)) {
      return {
        style: {
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
        },
      };
    }
    if (selectedDate && isSameDay(date, selectedDate)) {
      return {
        style: {
          backgroundColor: '#ede9fe',
          borderRadius: '8px',
        },
      };
    }
    return {};
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">Task Calendar</h2>
        </div>
        
        <div className="flex items-center space-x-1 px-2 py-1 bg-white rounded-lg shadow-sm">
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={handlePreviousMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          
          <span className="text-lg font-medium px-4">{currentMonthDisplay}</span>
          
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="h-[70vh] bg-white shadow-md rounded-lg p-4 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                onSelectSlot={handleDateClick}
                views={['month']}
                date={currentDate}
                onNavigate={(date) => {
                  setCurrentDate(date);
                }}
                eventPropGetter={eventStyleGetter}
                dayPropGetter={dayPropGetter}
                toolbar={false}
                className="text-sm"
                style={{ height: '100%' }}
              />
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-4 h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                {selectedDate ? (
                  <span>Tasks for {format(selectedDate, 'MMMM d, yyyy')}</span>
                ) : (
                  <span>Select a date to view tasks</span>
                )}
              </h3>
              {selectedDate && (
                <button
                  onClick={clearSelectedDate}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  aria-label="Clear selection"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {selectedDate ? (
              selectedDateTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <CheckCircle2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No tasks scheduled for this date</p>
                  <p className="text-gray-500 text-sm mt-2">Enjoy your free time!</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {selectedDateTasks.map((task, i) => (
                    <li 
                      key={i} 
                      className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 bg-indigo-600 rounded-full p-1">
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-800">{task.title}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <CalendarIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">Select a date on the calendar</p>
                <p className="text-gray-500 text-sm mt-2">Click on any date to view scheduled tasks</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}