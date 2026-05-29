import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <Link to={`/event/${event._id}`} className="block h-full">
      <div className="bg-white border-2 border-retro-light p-6 shadow-[4px_4px_0px_rgba(33,37,41,1)] hover:shadow-[6px_6px_0px_rgba(79,70,229,1)] hover:-translate-y-1 transition-all flex flex-col h-full cursor-pointer group">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold px-2 py-1 bg-retro-brown text-retro-accent uppercase tracking-wider border border-retro-light">
            {event.category || 'General'}
          </span>
          <span className="font-bold text-sm">
            {event.isFree ? 'FREE' : `$${event.price}`}
          </span>
        </div>
        
        <h3 className="text-xl font-retro text-retro-light group-hover:text-retro-accent mb-2 line-clamp-2 leading-tight">
          {event.title}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
          {event.description}
        </p>

        <div className="border-t-2 border-retro-brown pt-4 mt-auto text-sm font-bold text-gray-500 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{new Date(event.startTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span className="truncate">{event.venue}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
