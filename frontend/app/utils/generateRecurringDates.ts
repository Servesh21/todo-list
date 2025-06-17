import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  isAfter,
  startOfMonth,
} from 'date-fns';

type RecurrenceType = 'none' | 'weekday' | 'nthWeekday' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export function generateRecurringDates({
  startDate,
  recurrenceType,
  interval = 1,
  endDate = null,
  selectedWeekdays = [],
  nthWeek = 1,
  nthWeekday = 0,
  limit = 10
}: {
  startDate: Date;
  recurrenceType: RecurrenceType;
  interval?: number;
  endDate?: Date | null;
  selectedWeekdays?: number[];
  nthWeek?: number;
  nthWeekday?: number;
  limit?: number;
}) {
  // Input validation
  if (!startDate || !(startDate instanceof Date) || isNaN(startDate.getTime())) {
    return [new Date()]; // Return today if invalid date
  }
  
  // Ensure interval is valid
  interval = Math.max(1, Number(interval) || 1);
  
  // Initialize variables
  const dates = [];
  let current = new Date(startDate);
  let count = 0;
  
  // Special case: non-recurring events
  if (recurrenceType === 'none') {
    return [new Date(startDate)];
  }

  // Handle specific weekdays recurrence
  if (recurrenceType === 'weekday' && (!selectedWeekdays || selectedWeekdays.length === 0)) {
    // Default to all weekdays if none selected
    selectedWeekdays = [1, 2, 3, 4, 5]; // Monday-Friday
  }

  while (count < limit) {
    // Check if we've passed the end date
    if (endDate && isAfter(current, endDate)) break;
    
    // Handle different recurrence types
    switch (recurrenceType) {
      case 'weekday':
        // Add date if it's one of the selected weekdays
        if (selectedWeekdays.includes(current.getDay())) {
          dates.push(new Date(current));
        }
        current = addDays(current, 1);
        break;
        
      case 'nthWeekday':
        // Find nth occurrence of the weekday in the month
        let weekdayCount = 0;
        
        // Create a new date object to avoid modifying current
        const monthYear = current.getFullYear();
        const month = current.getMonth();
        
        // Loop through days of the month
        for (let d = 1; d <= 31; d++) {
          const temp = new Date(monthYear, month, d);
          
          // Stop if we've moved to the next month
          if (temp.getMonth() !== month) break;
          
          // Count occurrences of the specified weekday
          if (temp.getDay() === nthWeekday) {
            weekdayCount++;
            if (weekdayCount === nthWeek) {
              // We found the nth occurrence!
              if (count === 0 || isAfter(temp, startDate)) {
                dates.push(new Date(temp));
              }
              break;
            }
          }
        }
        
        // Move to next month
        current = addMonths(current, 1);
        // Reset to first day of month
        current = startOfMonth(current);
        break;
        
      case 'daily':
        dates.push(new Date(current));
        current = addDays(current, interval);
        break;
        
      case 'weekly':
        dates.push(new Date(current));
        current = addWeeks(current, interval);
        break;
        
      case 'monthly':
        dates.push(new Date(current));
        current = addMonths(current, interval);
        break;
        
      case 'yearly':
        dates.push(new Date(current));
        current = addYears(current, interval);
        break;
        
      default:
        // Default case, shouldn't normally be reached
        dates.push(new Date(current));
        current = addDays(current, 1);
        break;
    }
    
    count++;
    
    // Safety check: if we're adding dates too close together or identical dates
    if (dates.length > 1) {
      const lastDate = dates[dates.length - 1];
      const secondLastDate = dates[dates.length - 2];
      
      // If dates are identical or too close (within 1 hour), we might be in an infinite loop
      if (Math.abs(lastDate.getTime() - secondLastDate.getTime()) < 3600000) {
        break; // Exit the loop to prevent infinite loops
      }
    }
  }
  
  return dates;
}