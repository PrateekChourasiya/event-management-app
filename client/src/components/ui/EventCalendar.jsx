import React, { useState } from 'react';

const EventCalendar = ({ events, selectedDate, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Create an array of strings representing dates that have events
  const eventDates = events.map(e => new Date(e.startTime).toDateString());

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const d = new Date(year, month, day);
    return d.toDateString() === selectedDate.toDateString();
  };

  const hasEvent = (day) => {
    const d = new Date(year, month, day);
    return eventDates.includes(d.toDateString());
  };

  const isToday = (day) => {
    const d = new Date(year, month, day);
    return d.toDateString() === new Date().toDateString();
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-indigo-50 border-2 border-retro-light p-3 md:p-4 shadow-[4px_4px_0_rgba(79,70,229,0.3)] w-full h-fit flex flex-col rounded-sm">
      <div className="flex justify-between items-center mb-4 border-b-2 border-retro-light pb-3">
        <button 
          onClick={handlePrevMonth}
          className="bg-retro-accent text-white px-3 md:px-4 py-2 font-retro border-2 border-retro-light hover:bg-retro-hover transition-colors shadow-retro active:translate-x-[2px] active:translate-y-[2px]"
        >
          &lt;
        </button>
        <h3 className="text-base md:text-xl font-retro text-retro-light whitespace-nowrap px-2 text-center flex-1">
          {monthNames[month]} {year}
        </h3>
        <button 
          onClick={handleNextMonth}
          className="bg-retro-accent text-white px-3 md:px-4 py-2 font-retro border-2 border-retro-light hover:bg-retro-hover transition-colors shadow-retro active:translate-x-[2px] active:translate-y-[2px]"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center font-bold text-gray-500 uppercase text-[10px] md:text-xs tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 flex-1">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const selected = isSelected(day);
          const eventDay = hasEvent(day);
          const today = isToday(day);

          let baseClasses = "relative aspect-square flex justify-center items-center font-retro text-xs md:text-sm border-2 transition-all cursor-pointer select-none ";
          
          if (selected) {
            baseClasses += "border-retro-accent bg-retro-accent text-white shadow-[2px_2px_0_rgba(79,70,229,1)] scale-105 z-10 ";
          } else {
            baseClasses += "border-transparent hover:border-retro-light hover:bg-gray-50 text-retro-light ";
            if (today) {
              baseClasses += "border-dashed border-gray-400 ";
            }
          }

          if (eventDay && !selected) {
            baseClasses += "bg-green-100 text-green-800 border-green-300 hover:bg-green-200 ";
          }

          return (
            <div 
              key={day} 
              onClick={() => onSelectDate(new Date(year, month, day))}
              className={baseClasses}
            >
              {day}
              {eventDay && (
                <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${selected ? 'bg-white' : 'bg-green-500'}`}></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventCalendar;
