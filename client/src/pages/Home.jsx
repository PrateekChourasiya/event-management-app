import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEvents } from '../store/eventSlice';
import EventCard from '../components/ui/EventCard';
import MainLayout from '../components/layout/MainLayout';

const Home = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="flex justify-between items-end mb-8 border-b-2 border-retro-light pb-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-retro text-retro-light tracking-wider drop-shadow-[2px_2px_0_rgba(79,70,229,0.2)]">EVENT MANIA</h2>
          <p className="text-sm font-bold text-gray-500 mt-2 tracking-wide uppercase">Where Epic Events Happen.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 font-retro text-xl animate-pulse">LOADING EVENTS...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl font-bold text-gray-500">NO EVENTS FOUND.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Home;
