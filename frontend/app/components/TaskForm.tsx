'use client';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { generateRecurringDates } from '../utils/generateRecurringDates';

// MiniCalendar component for month view
function MiniCalendar({ month, year, highlightDates = [] }: { month: number; year: number; highlightDates?: Date[] }) {
  // Get first day of the month
  const firstDay = new Date(year, month, 1);
  const startingDay = firstDay.getDay(); // 0 = Sunday
  
  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Convert highlight dates to day numbers with month filter
  const highlightDaysInMonth = highlightDates
    .filter(date => date.getMonth() === month && date.getFullYear() === year)
    .map(date => date.getDate());
  
  // Generate calendar grid (6 rows max)
  const calendar = [];
  let day = 1;
  
  // Create weeks
  for (let i = 0; i < 6; i++) {
    const week = [];
    
    // Create days in a week
    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < startingDay) || day > daysInMonth) {
        // Empty cell
        week.push(null);
      } else {
        week.push(day);
        day++;
      }
    }
    
    calendar.push(week);
    
    // Stop if we've used all days
    if (day > daysInMonth) {
      break;
    }
  }
  
  return (
    <div className="mb-3">
      <div className="text-sm font-medium text-center text-gray-700 mb-2">
        {new Date(year, month).toLocaleString('default', { month: 'long' })} {year}
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {calendar.map((week, weekIndex) => (
          week.map((day, dayIndex) => (
            <div 
              key={`${weekIndex}-${dayIndex}`} 
              className={`h-6 flex items-center justify-center rounded-full ${
                day ? (
                  highlightDaysInMonth.includes(day)
                    ? 'bg-blue-500 text-white font-bold'
                    : 'text-gray-700'
                ) : ''
              }`}
            >
              {day || ''}
            </div>
          ))
        ))}
      </div>
    </div>
  );
}

export type Task = {
  id?: number;
  title: string;
  startDate: Date | null;
  recurrenceType: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekday' | 'nthWeekday';
  interval: number;
  endDate: Date | null;
  selectedWeekdays: number[];
  nthWeek: number;
  nthWeekday: number;
  completed?: boolean;
  // Add any other backend fields as needed
};

export default function TaskForm({ onAdd }: { onAdd: (task: Task) => void }) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [recurrenceType, setRecurrenceType] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekday' | 'nthWeekday'>('none');
  const [interval, setInterval] = useState(1);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]); // For specific weekdays
  const [nthWeek, setNthWeek] = useState<number>(1); // For nth weekday
  const [nthWeekday, setNthWeekday] = useState<number>(0); // For nth weekday (e.g., Monday = 1)
  const [previewDates, setPreviewDates] = useState<Date[]>([]);

  // Generate preview dates whenever recurrence parameters change
  useEffect(() => {
    try {
      if (startDate) {
        // Generate next 10 occurrences (or fewer if endDate limits it)
        const dates = generateRecurringDates({
          startDate,
          recurrenceType,
          interval: Math.max(1, interval || 1), // Ensure interval is at least 1
          endDate,
          selectedWeekdays: recurrenceType === 'weekday' ? selectedWeekdays : undefined,
          nthWeek: recurrenceType === 'nthWeekday' ? Math.max(1, nthWeek || 1) : undefined,
          nthWeekday: recurrenceType === 'nthWeekday' ? (nthWeekday || 0) : undefined,
          limit: 30
        });
        
        console.log("Generated dates:", dates);
        setPreviewDates(Array.isArray(dates) && dates.length > 0 ? dates : [new Date(startDate)]);
      } else {
        setPreviewDates([new Date()]);
      }
    } catch (error) {
      console.error("Error generating preview dates:", error);
      setPreviewDates(startDate ? [new Date(startDate)] : [new Date()]);
    }
  }, [startDate, recurrenceType, interval, endDate, selectedWeekdays, nthWeek, nthWeekday]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({
        title,
        startDate,
        recurrenceType,
        interval,
        endDate,
        selectedWeekdays,
        nthWeek,
        nthWeekday,
      });
      setTitle('');
      setStartDate(new Date());
      setRecurrenceType('none');
      setInterval(1);
      setEndDate(null);
      setSelectedWeekdays([]);
      setNthWeek(1);
      setNthWeekday(0);
    }
  };

  // Display interval options for recurring tasks
  const showIntervalOptions = () => {
    if (recurrenceType !== 'none' && recurrenceType !== 'weekday' && recurrenceType !== 'nthWeekday') {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Repeat Every</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              value={interval}
              onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
              className="w-20 border border-gray-300 rounded px-3 py-2"
            />
            <span className="text-gray-600">
              {recurrenceType === 'daily' && 'day(s)'}
              {recurrenceType === 'weekly' && 'week(s)'}
              {recurrenceType === 'monthly' && 'month(s)'}
              {recurrenceType === 'yearly' && 'year(s)'}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Format date for the mini calendar
  const formatPreviewDate = (date: Date) => {
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      year: date.getFullYear(),
      weekday: date.toLocaleString('default', { weekday: 'short' })
    };
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Create New Task</h2>
      
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
        <input
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="MMM d, yyyy"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="MMM d, yyyy"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholderText="No end date"
            isClearable
            minDate={startDate || new Date()}
          />
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">Recurrence</label>
        <select
          value={recurrenceType}
          onChange={(e) => setRecurrenceType(e.target.value as Task['recurrenceType'])}
          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="none">No Recurrence</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="weekday">Specific Weekdays</option>
          <option value="nthWeekday">Nth Weekday of Month</option>
        </select>
      </div>

      {showIntervalOptions()}

      {recurrenceType === 'weekday' && (
        <div className="mb-5 bg-gray-50 p-4 rounded-md border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Days</label>
          <div className="grid grid-cols-7 gap-2 text-sm">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={day} className="flex flex-col items-center">
                <button
                  type="button"
                  className={`w-10 h-10 rounded-full flex items-center justify-center focus:outline-none ${
                    selectedWeekdays.includes(i)
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setSelectedWeekdays((prev) =>
                      prev.includes(i)
                        ? prev.filter((d) => d !== i)
                        : [...prev, i]
                    );
                  }}
                >
                  {day}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {recurrenceType === 'nthWeekday' && (
        <div className="mb-5 bg-gray-50 p-4 rounded-md border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Which Weekday</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Week</label>
              <select
                value={nthWeek}
                onChange={(e) => setNthWeek(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>First</option>
                <option value={2}>Second</option>
                <option value={3}>Third</option>
                <option value={4}>Fourth</option>
                <option value={5}>Fifth</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Day</label>
              <select
                value={nthWeekday}
                onChange={(e) => setNthWeekday(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
                  (day, i) => (
                    <option key={day} value={i}>
                      {day}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>
      )}

      {recurrenceType !== 'none' && startDate && (
        <div className="mb-5 bg-blue-50 p-4 rounded-md border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Recurrence Summary</h3>
          <p className="text-sm text-blue-700">
            {recurrenceType === 'daily' && `Repeats every ${interval} day(s)`}
            {recurrenceType === 'weekly' && `Repeats every ${interval} week(s)`}
            {recurrenceType === 'monthly' && `Repeats every ${interval} month(s)`}
            {recurrenceType === 'yearly' && `Repeats every ${interval} year(s)`}
            {recurrenceType === 'weekday' && `Repeats on selected weekdays`}
            {recurrenceType === 'nthWeekday' && 
              `Repeats on the ${['first', 'second', 'third', 'fourth', 'fifth'][nthWeek-1]} ${
                ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][nthWeekday]
              } of each month`
            }
            {endDate ? ` until ${endDate.toLocaleDateString()}` : ' with no end date'}
          </p>
        </div>
      )}

      {/* Mini Calendar Preview */}
      {previewDates.length > 0 && (
        <div className="mb-5 bg-white p-4 rounded-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Upcoming Occurrences</h3>
          
          {/* Calendar View */}
          <div className="mb-4">
            {startDate && (
              <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-center text-xs font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                
                <MiniCalendar 
                  month={startDate.getMonth()} 
                  year={startDate.getFullYear()} 
                  highlightDates={previewDates}
                />
                
                {/* Show next month if we have events there */}
                {previewDates.some(date => 
                  date.getMonth() !== startDate.getMonth() || 
                  date.getFullYear() !== startDate.getFullYear()
                ) && (
                  <MiniCalendar 
                    month={(startDate.getMonth() + 1) % 12} 
                    year={startDate.getMonth() === 11 ? startDate.getFullYear() + 1 : startDate.getFullYear()} 
                    highlightDates={previewDates}
                  />
                )}
              </div>
            )}
          </div>
          
          {/* Date Cards */}
          <div className="flex overflow-x-auto pb-2 -mx-1">
            {previewDates.map((date, index) => {
              const formattedDate = formatPreviewDate(date);
              return (
                <div key={index} className="flex-shrink-0 mx-1">
                  <div className="w-20 h-24 rounded-lg border border-gray-200 overflow-hidden flex flex-col">
                    <div className="bg-blue-100 text-center py-1 text-xs font-medium text-blue-800">
                      {formattedDate.month}
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center bg-white">
                      <div className="text-2xl font-semibold text-gray-800">{formattedDate.day}</div>
                      <div className="text-xs text-gray-500">{formattedDate.weekday}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {previewDates.length === 1 
              ? "One-time task" 
              : `Showing next ${previewDates.length} occurrence${previewDates.length > 1 ? 's' : ''}`}
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={() => {
            setTitle('');
            setStartDate(new Date());
            setRecurrenceType('none');
            setInterval(1);
            setEndDate(null);
            setSelectedWeekdays([]);
            setNthWeek(1);
            setNthWeekday(0);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Clear
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={!title.trim()}
        >
          Add Task
        </button>
      </div>
    </form>
  );
}