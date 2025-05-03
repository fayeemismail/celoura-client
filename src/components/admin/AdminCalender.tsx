import React, { useState } from "react";
import { ADMIN_COLORS } from "../../styles/theme";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock events for the calendar
const events = [
  { day: 5, title: "Marketing meeting", type: "meeting" },
  { day: 10, title: "New destination launch", type: "event" },
  { day: 12, title: "Quarterly review", type: "meeting" },
  { day: 15, title: "Travel expo", type: "event" },
  { day: 18, title: "Budget planning", type: "meeting" },
  { day: 22, title: "Team outing", type: "event" },
  { day: 25, title: "Stakeholder presentation", type: "meeting" }
];

export default function AdminCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Get current month name and year
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();
  
  // Navigate to previous month
  const prevMonth = () => {
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCurrentMonth(previousMonth);
  };
  
  // Navigate to next month
  const nextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const daysInMonth = getDaysInMonth(year, currentMonth.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(year, currentMonth.getMonth());
  
  // Generate calendar days
  const days = [];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 border-t border-r p-1"></div>);
  }
  
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = events.filter(event => event.day === day);
    
    days.push(
      <div 
        key={`day-${day}`} 
        style={{ borderColor: ADMIN_COLORS.border }}
        className="h-24 border-t border-r p-1 relative"
      >
        <span
          style={{ color: ADMIN_COLORS.text }}
          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm ${
            day === new Date().getDate() && 
            currentMonth.getMonth() === new Date().getMonth() && 
            year === new Date().getFullYear()
              ? `bg-${ADMIN_COLORS.accent} text-white`
              : ""
          }`}
        >
          {day}
        </span>
        
        <div className="mt-1 space-y-1">
          {dayEvents.map((event, idx) => (
            <div
              key={idx}
              style={{ 
                backgroundColor: event.type === "meeting" ? "#E1F5FE" : "#FFF8E1",
                color: event.type === "meeting" ? "#0288D1" : "#FF8F00"
              }}
              className="truncate rounded px-1 py-0.5 text-xs"
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Fill remaining cells to complete the grid
  const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;
  for (let i = daysInMonth + firstDayOfMonth; i < totalCells; i++) {
    days.push(<div key={`empty-end-${i}`} className="h-24 border-t border-r p-1"></div>);
  }
  
  return (
    <div 
      style={{ backgroundColor: ADMIN_COLORS.cardBg, borderColor: ADMIN_COLORS.border }} 
      className="rounded-lg border shadow-sm"
    >
      <div 
        style={{ borderColor: ADMIN_COLORS.border }} 
        className="flex items-center justify-between border-b p-6"
      >
        <h2 style={{ color: ADMIN_COLORS.text }} className="text-lg font-semibold">
          Events Calendar
        </h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <button
              onClick={prevMonth}
              style={{ color: ADMIN_COLORS.secondaryText }}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div style={{ color: ADMIN_COLORS.text }} className="mx-2 text-sm font-medium">
              {monthName} {year}
            </div>
            
            <button
              onClick={nextMonth}
              style={{ color: ADMIN_COLORS.secondaryText }}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          <button 
            style={{ color: ADMIN_COLORS.accent }} 
            className="text-sm font-medium"
          >
            Add Event
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div 
          style={{ borderColor: ADMIN_COLORS.border }}
          className="grid grid-cols-7 border-l border-b"
        >
          {/* Weekday headers */}
          {weekdays.map((day) => (
            <div
              key={day}
              style={{ 
                backgroundColor: ADMIN_COLORS.hoverBg, 
                color: ADMIN_COLORS.secondaryText,
                borderColor: ADMIN_COLORS.border 
              }}
              className="border-t border-r p-2 text-center text-xs font-medium"
            >
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#E1F5FE]"></div>
              <span style={{ color: ADMIN_COLORS.secondaryText }} className="ml-2 text-xs">
                Meetings
              </span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#FFF8E1]"></div>
              <span style={{ color: ADMIN_COLORS.secondaryText }} className="ml-2 text-xs">
                Events
              </span>
            </div>
          </div>
          
          <button
            style={{ 
              backgroundColor: ADMIN_COLORS.hoverBg, 
              color: ADMIN_COLORS.accent,
              borderColor: ADMIN_COLORS.border
            }}
            className="rounded-lg border px-4 py-1 text-xs font-medium hover:bg-opacity-80"
          >
            View All Events
          </button>
        </div>
      </div>
    </div>
  );
}